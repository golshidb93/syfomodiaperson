import React from "react";
import { Column, Row } from "nav-frontend-grid";

interface BoksRadProps {
  kolonne1Tekst: string;
  kolonne2Tekst: string;
  erTittel?: boolean;
}

const BoksRad = (boksRadProps: BoksRadProps) => {
  const kolonne1Tekst = boksRadProps.kolonne1Tekst;
  const kolonne2Tekst = boksRadProps.kolonne2Tekst;
  const erTittel = boksRadProps.erTittel;
  return (
    <Row>
      <Column className="col-sm-6">
        <p
          className={`sykmeldingMotebehovVisning__boksRad--${
            erTittel ? "tittel" : "tekst"
          }`}
        >
          {kolonne1Tekst}
        </p>
      </Column>
      <Column className="col-sm-6">
        <p
          className={`sykmeldingMotebehovVisning__boksRad--${
            erTittel ? "tittel" : "tekst"
          }`}
        >
          {kolonne2Tekst}
        </p>
      </Column>
    </Row>
  );
};

export default BoksRad;
