import React, {PropTypes} from "react";
import {Link} from "react-router";
import {Varselstripe, DineSykmeldingOpplysninger, getLedetekst, getHtmlLedetekst} from "digisyfo-npm";

const DinSykmelding = ({ sykmelding, ledetekster, visEldreSykmeldingVarsel, eldsteSykmeldingId }) => {
    return (<div>
        <div className="panel blokk">
            <div className="media">
                <img src="/sykefravaer/img/svg/nav-ansatt.svg" className="media__img media__img--desktop" alt="Ansatt i NAV" />
                <img src="/sykefravaer/img/svg/nav-ansatt-mobil.svg" className="media__img media__img--mobil" alt="Ansatt i NAV" />
                <h2 className="typo-syfotittel">{getLedetekst('din-sykmelding.ny-tjeneste.tittel', ledetekster)}</h2>
            </div>
            <div className="redaksjonelt-innhold" dangerouslySetInnerHTML={getHtmlLedetekst('din-sykmelding.ny-tjeneste.tekst', ledetekster)} />
        </div>
        {
            visEldreSykmeldingVarsel && <div className="panel blokk">
                <Varselstripe type="info">
                    <p className="sist side-innhold">
                        <span>{getLedetekst('starte-sykmelding.eldre-sykmeldinger.tekst', ledetekster)} </span>
                        <Link to={`/sykefravaer/sykmeldinger/${eldsteSykmeldingId}`}>{getLedetekst('starte-sykmelding.eldre-sykmeldinger.lenke', ledetekster)}</Link>
                    </p>
                </Varselstripe>
            </div>
        }
        <header className="panelHeader panelHeader--lysebla">
            <img className="panelHeader__ikon" src="/sykefravaer/img/svg/person.svg" alt="Du" />
            <img className="panelHeader__ikon panelHeader__ikon--hoykontrast"
                src="/sykefravaer/img/svg/person-highcontrast.svg" alt="Du" />
            <h2 className="panelHeader__tittel">{sykmelding.pasient.fornavn} {sykmelding.pasient.etternavn}</h2>
        </header>
        <div className="panel blokk">
            <DineSykmeldingOpplysninger sykmelding={sykmelding} ledetekster={ledetekster} />
        </div>
    </div>);
};

DinSykmelding.propTypes = {
    sykmelding: PropTypes.object,
    ledetekster: PropTypes.object,
    visEldreSykmeldingVarsel: PropTypes.bool,
    eldsteSykmeldingId: PropTypes.string,
};

export default DinSykmelding;
