import React from 'react';
import {
    getLedetekst,
    toDatePrettyPrint,
    Hjelpetekst,
    SykmeldingNokkelOpplysning,
} from 'digisyfo-npm';
import KnappBase from 'nav-frontend-knapper';
import { sykepengesoknadstatuser } from 'digisyfo-npm';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';

const { SENDT, TIL_SENDING, KORRIGERT } = sykepengesoknadstatuser;

const getSendtTilSuffix = (sykepengesoknad) => {
    if (sykepengesoknad.sendtTilArbeidsgiverDato && sykepengesoknad.sendtTilNAVDato) {
        return '.til-arbeidsgiver-og-nav';
    }
    if (sykepengesoknad.sendtTilArbeidsgiverDato) {
        return '.til-arbeidsgiver';
    }
    if (sykepengesoknad.sendtTilNAVDato) {
        return '.til-nav';
    }
    return '';
};

const getStatusTittel = (sykepengesoknad) => {
    switch (sykepengesoknad.status) {
        case SENDT: {
            return getLedetekst(`sykepengesoknad.status.SENDT${getSendtTilSuffix(sykepengesoknad)}`);
        }
        case TIL_SENDING: {
            return getLedetekst('sykepengesoknad.status.TIL_SENDING');
        }
        case KORRIGERT: {
            return getLedetekst('sykepengesoknad.status.KORRIGERT');
        }
        default: {
            return 'Ukjent status';
        }
    }
};

export const tilSendingHjelpetekst = () => {
    return (<Hjelpetekst
        tittel={getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tittel')}
        tekst={getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tekst')} />);
};

const getArbeidsgiverOpplysning = (sykepengesoknad) => {
    return {
        tittel: getLedetekst('sykepengesoknad.oppsummering.arbeidsgiver.label'),
        opplysning: `${sykepengesoknad.arbeidsgiver.navn} (${sykepengesoknad.arbeidsgiver.orgnummer})`,
    };
};

export const getNokkelopplysninger = (sykepengesoknad) => {
    return [[{
        tittel: getLedetekst('sykepengesoknad.oppsummering.status.label'),
        opplysning: getStatusTittel(sykepengesoknad),
        hjelpetekst: sykepengesoknad.status === TIL_SENDING ? tilSendingHjelpetekst() : null,
    }, {
        tittel: getLedetekst('sykepengesoknad.oppsummering.dato.label'),
        opplysning: toDatePrettyPrint(sykepengesoknad.sendtTilNAVDato || sykepengesoknad.sendtTilArbeidsgiverDato),
    }], [getArbeidsgiverOpplysning(sykepengesoknad)]];
};

const SendtLikt = ({ sykepengesoknad }) => {
    const opplysninger = getNokkelopplysninger(sykepengesoknad);
    return (<div>
        {
            opplysninger.map((opplysninger_, index1) => {
                return (<div className="statusopplysninger" key={index1}>
                    {
                        opplysninger_.map(({ tittel, opplysning, hjelpetekst }, index2) => {
                            return (<SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" Overskrift="h2" tittel={tittel} key={index2}>
                                {
                                    hjelpetekst ?
                                        <div>
                                            <span>{opplysning}</span>{hjelpetekst}
                                        </div>
                                        :
                                        <p>{opplysning}</p>
                                }
                            </SykmeldingNokkelOpplysning>);
                        })
                    }
                </div>);
            })
        }
    </div>);
};

SendtLikt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const SendtUlikt = ({ sykepengesoknad }) => {
    const opplysning = getArbeidsgiverOpplysning(sykepengesoknad);
    return (<div className="statusopplysninger">
        <SykmeldingNokkelOpplysning Overskrift="h2" tittel="Status">
            <p>
                {getLedetekst('sykepengesoknad.status.SENDT.til-nav')}: {toDatePrettyPrint(sykepengesoknad.sendtTilNAVDato)} <br />
                {getLedetekst('sykepengesoknad.status.SENDT.til-arbeidsgiver')}: {toDatePrettyPrint(sykepengesoknad.sendtTilArbeidsgiverDato)}
            </p>
        </SykmeldingNokkelOpplysning>
        <SykmeldingNokkelOpplysning Overskrift="h2" tittel={opplysning.tittel}>
            <p>{opplysning.opplysning}</p>
        </SykmeldingNokkelOpplysning>
    </div>);
};

SendtUlikt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const getSistSendtDato = (s) => {
    if (s.sendtTilNAVDato && s.sendtTilArbeidsgiverDato) {
        if (new Date(s.sendtTilNAVDato).getTime() > new Date(s.sendtTilArbeidsgiverDato.getTime())) {
            return new Date(s.sendtTilNAVDato);
        }
        return new Date(s.sendtTilArbeidsgiverDato);
    }
    if (s.sendtTilNAVDato) {
        return new Date(s.sendtTilNAVDato);
    }
    return new Date(s.sendtTilArbeidsgiverDato);
};


export const Knapperad = ({ sykepengesoknad }) => {
    const frist = new Date();
    const ANTALL_MAANEDER_KORRIGERING_ER_MULIG = 3;
    frist.setMonth(frist.getMonth() - ANTALL_MAANEDER_KORRIGERING_ER_MULIG);
    const sendtDato = new Date(getSistSendtDato(sykepengesoknad));
    return (<div>
        <div className="verktoylinje">
            {
                sendtDato.getTime() >= frist.getTime() && <div className="verktoylinje__element">
                    <KnappBase
                        type="standard"
                        mini
                        disabled>
                        Endre søknad
                    </KnappBase>
                </div>
            }
            {
                sykepengesoknad.sendtTilNAVDato === null && <KnappBase
                    type="standard"
                    mini
                    disabled>
                    Send til NAV
                </KnappBase>
            }
            {
                sykepengesoknad.sendtTilArbeidsgiverDato === null && <KnappBase type="standard" mini disabled>
                    Send til arbeidsgiveren din
                </KnappBase>
            }
        </div>
    </div>);
};

Knapperad.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export const Statuspanel = ({ sykepengesoknad }) => {
    const sendtTilBeggeMenIkkeSamtidig = sykepengesoknad.sendtTilNAVDato && sykepengesoknad.sendtTilArbeidsgiverDato && sykepengesoknad.sendtTilNAVDato.getTime() !== sykepengesoknad.sendtTilArbeidsgiverDato.getTime();
    return (<div className="panel panel--komprimert blokk">
        <div>
            {
                (() => {
                    if (sendtTilBeggeMenIkkeSamtidig) {
                        return <SendtUlikt sykepengesoknad={sykepengesoknad} />;
                    }
                    return <SendtLikt sykepengesoknad={sykepengesoknad} />;
                })()
            }
        </div>
        <Knapperad sykepengesoknad={sykepengesoknad} />
    </div>);
};

Statuspanel.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default Statuspanel;
