import React, { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";
import { useDispatch } from "react-redux";
import { fetchDialogmote } from "@/data/dialogmote/dialogmote_actions";
import Side from "../../sider/Side";
import { MOETEPLANLEGGER } from "@/enums/menypunkter";
import SideLaster from "../SideLaster";
import Sidetopp from "../Sidetopp";
import Feilmelding from "../Feilmelding";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";

interface DialogmoteSideProps {
  title: string;
  header: string;
  children: (dialogmote: DialogmoteDTO) => ReactElement;
}

const texts = {
  moteNotFound: "Fant ikke dialogmøte",
};

export const DialogmoteSideContainer = ({
  title,
  header,
  children,
}: DialogmoteSideProps): ReactElement => {
  const { dialogmoteUuid, fnr } = useParams<{
    dialogmoteUuid: string;
    fnr: string;
  }>();
  const {
    henterMote,
    henterMoteFeil,
    dialogmoter,
    moterHentet,
  } = useAppSelector((state) => state.dialogmote);
  const { isDm2FysiskBrevEnabled } = useDM2FeatureToggles();
  const {
    kontaktinfo: { skalHaVarsel: brukerKanVarslesDigitalt },
  } = useNavBrukerData();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!moterHentet) {
      dispatch(fetchDialogmote(fnr));
    }
  }, [dispatch, fnr, moterHentet]);

  const henter = henterMote;
  const dialogmote = dialogmoter.find(
    (dialogmote) => dialogmote.uuid === dialogmoteUuid
  );

  return (
    <Side fnr={fnr} tittel={title} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster henter={henter} hentingFeilet={!!henterMoteFeil}>
        <Sidetopp tittel={header} />
        {isDm2FysiskBrevEnabled && !brukerKanVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        {dialogmote ? (
          children(dialogmote)
        ) : (
          <Feilmelding tittel={texts.moteNotFound} />
        )}
      </SideLaster>
    </Side>
  );
};
