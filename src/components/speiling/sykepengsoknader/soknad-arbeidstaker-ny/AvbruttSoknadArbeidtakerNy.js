import React from "react";
import PropTypes from "prop-types";
import {
  brodsmule,
  soknad as soknadPt,
  sykmelding as sykmeldingPt,
} from "../../../../propTypes";
import { tilLesbarDatoMedArstall } from "../../../../utils/datoUtils";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../Statuspanel";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import SykmeldingUtdrag from "../SykmeldingUtdragContainer";
import VerktoylinjeGjenapne from "../soknad-felles/VerktoylinjeGjenapneSoknad";

const texts = {
  avbrutt: "Avbrutt av deg",
  status: "Status",
};

const AvbruttSoknadArbeidstakerStatuspanel = ({ soknad }) => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.avbrutt}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel="Dato avbrutt">
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
      <VerktoylinjeGjenapne soknad={soknad} />
    </Statuspanel>
  );
};

AvbruttSoknadArbeidstakerStatuspanel.propTypes = {
  brukernavn: PropTypes.string,
  brodsmuler: PropTypes.arrayOf(brodsmule),
  soknad: soknadPt,
  fnr: PropTypes.string,
  sykmelding: sykmeldingPt,
};

const AvbruttSoknadArbeidstaker = ({ brukernavn, brodsmuler, soknad, fnr }) => {
  return (
    <div>
      <SoknadSpeiling
        tittel="Søknad om sykepenger"
        brukernavn={brukernavn}
        brodsmuler={brodsmuler}
      >
        <AvbruttSoknadArbeidstakerStatuspanel soknad={soknad} />
        <SykmeldingUtdrag soknad={soknad} fnr={fnr} />
      </SoknadSpeiling>
    </div>
  );
};

AvbruttSoknadArbeidstaker.propTypes = {
  brukernavn: PropTypes.string,
  brodsmuler: PropTypes.arrayOf(brodsmule),
  soknad: soknadPt,
  fnr: PropTypes.string,
};

export default AvbruttSoknadArbeidstaker;
