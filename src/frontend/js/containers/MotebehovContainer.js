import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getLedetekst,
    getHtmlLedetekst,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import * as motebehovActions from '../actions/motebehov_actions';
import * as veilederoppgaverActions from '../actions/veilederoppgaver_actions';
import * as oppfoelgingsdialogerActions from '../actions/oppfoelgingsdialoger_actions';
import * as oppfolgingstilfelleperioderActions from '../actions/oppfolgingstilfelleperioder_actions';
import * as sykmeldingerActions from '../actions/sykmeldinger_actions';
import * as ledereActions from '../actions/ledere_actions';
import * as virksomhetActions from '../actions/virksomhet_actions';
import { MOETEPLANLEGGER } from '../enums/menypunkter';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';
import {
    sorterMotebehovDataEtterDato,
    finnNyesteMotebehovsvarFraHverDeltaker,
} from '../utils/motebehovUtils';
import {
    harForsoktHentetLedetekster,
    harForsoktHentetMotebehov,
    ikkeHenterEllerForsoktHentetLedere,
    ikkeHenterEllerForsoktHentetMotebehov,
} from '../utils/reducerUtils';
import { finnLedereUtenInnsendtMotebehov } from '../utils/ledereUtils';
import Motebehov from '../components/Motebehov';
import { bindActionCreators } from 'redux';

export class MotebehovSide extends Component {
    componentDidMount() {
        const {
            actions,
            fnr,
            skalHenteMotebehov,
            skalHenteLedere,
        } = this.props;
        if (skalHenteMotebehov) {
            actions.hentMotebehov(fnr);
        }
        actions.hentOppfoelgingsdialoger(fnr);
        if (skalHenteLedere) {
            actions.hentLedere(fnr);
        }
        actions.hentOppfolgingstilfelleperioder(fnr);
        actions.hentSykmeldinger(fnr);
    }

    render() {
        const {
            actions,
            aktiveDialoger,
            fnr,
            henter,
            hentingFeilet,
            ledereData,
            ledereUtenInnsendtMotebehov,
            ledetekster,
            motebehovListeUtenFlereSvarFraSammePerson,
            motebehovTilgang,
            oppgaver,
            sykmeldt,
            tilgang,
            ufiltrertMotebehovListeTilOppgavebehandling,
            veilederinfo,
            oppfolgingstilfelleperioder,
            sykmeldinger,
        } = this.props;
        return (<Side fnr={fnr} tittel="Møtebehov" aktivtMenypunkt={MOETEPLANLEGGER}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    }
                    if (!tilgang.harTilgang) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(tilgang.begrunnelse), ledetekster)}
                        />);
                    }
                    if (motebehovTilgang.harTilgang === false) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(motebehovTilgang.begrunnelse), ledetekster)}
                        />);
                    }
                    if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    if (motebehovListeUtenFlereSvarFraSammePerson.length > 0) {
                        return (<Motebehov
                            actions={actions}
                            fnr={fnr}
                            ledereData={ledereData}
                            ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
                            ledetekster={ledetekster}
                            motebehovListe={motebehovListeUtenFlereSvarFraSammePerson}
                            oppgaver={oppgaver}
                            sykmeldt={sykmeldt}
                            ufiltrertMotebehovListeTilOppgavebehandling={ufiltrertMotebehovListeTilOppgavebehandling}
                            veilederinfo={veilederinfo}
                            aktiveDialoger={aktiveDialoger}
                            oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
                            sykmeldinger={sykmeldinger}
                        />);
                    }
                    return (<Feilmelding
                        tittel={getLedetekst('mote.motebehov.feilmelding.tittel', ledetekster)}
                        melding={getHtmlLedetekst('mote.motebehov.feilmelding.ikkeFunnet', ledetekster)}
                    />);
                })()
            }
        </Side>);
    }
}

MotebehovSide.propTypes = {
    actions: PropTypes.object,
    aktiveDialoger: PropTypes.array,
    fnr: PropTypes.string,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    ledereData: PropTypes.arrayOf(PropTypes.object),
    ledereUtenInnsendtMotebehov: PropTypes.arrayOf(PropTypes.object),
    ledetekster: PropTypes.object,
    motebehovListeUtenFlereSvarFraSammePerson: PropTypes.arrayOf(PropTypes.object),
    motebehovTilgang: PropTypes.object,
    oppgaver: PropTypes.arrayOf(PropTypes.object),
    skalHenteLedere: PropTypes.bool,
    skalHenteMotebehov: PropTypes.bool,
    sykmeldt: PropTypes.object,
    tilgang: PropTypes.object,
    ufiltrertMotebehovListeTilOppgavebehandling: PropTypes.arrayOf(PropTypes.object),
    veilederinfo: PropTypes.object,
    oppfolgingstilfelleperioder: PropTypes.object,
    sykmeldinger: PropTypes.arrayOf(PropTypes.object),
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, motebehovActions, veilederoppgaverActions, oppfoelgingsdialogerActions, oppfolgingstilfelleperioderActions, sykmeldingerActions, ledereActions, virksomhetActions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export const mapStateToProps = (state, ownProps) => {
    const motebehovData = state.motebehov.data;
    const sortertMotebehovListe = motebehovData.sort(sorterMotebehovDataEtterDato);
    const motebehovListeUtenFlereSvarFraSammePerson = finnNyesteMotebehovsvarFraHverDeltaker(sortertMotebehovListe);

    const ledereData = state.ledere.data;
    const ledereUtenInnsendtMotebehov = finnLedereUtenInnsendtMotebehov(ledereData, motebehovData);

    const oppfoelgingsdialoger = state.oppfoelgingsdialoger.data.map((dialog) => {
        const oppgaver = state.veilederoppgaver.data.filter((oppgave) => {
            return oppgave.type === 'SE_OPPFOLGINGSPLAN' && oppgave.uuid === dialog.uuid;
        });
        return Object.assign({}, dialog, {
            oppgaver,
        });
    });

    const aktiveDialoger = oppfoelgingsdialoger.filter((dialog) => {
        return dialog.status !== 'AVBRUTT' && new Date(dialog.godkjentPlan.gyldighetstidspunkt.tom) > new Date();
    });

    const harForsoktHentetAlt = harForsoktHentetMotebehov(state.motebehov)
    && harForsoktHentetLedetekster(state.ledetekster);
    return {
        fnr: ownProps.params.fnr,
        henter: !harForsoktHentetAlt,
        hentingFeilet:
        state.motebehov.hentingFeilet
        || state.ledetekster.hentingFeilet,
        ledereData,
        ledereUtenInnsendtMotebehov,
        ledetekster: state.ledetekster.data,
        motebehovListeUtenFlereSvarFraSammePerson,
        motebehovTilgang: state.motebehov.tilgang,
        oppgaver: state.veilederoppgaver.data,
        skalHenteLedere: ikkeHenterEllerForsoktHentetLedere(state.ledere),
        skalHenteMotebehov: ikkeHenterEllerForsoktHentetMotebehov(state.motebehov),
        sykmeldt: state.navbruker.data,
        tilgang: state.tilgang.data,
        ufiltrertMotebehovListeTilOppgavebehandling: state.motebehov.data,
        veilederinfo: state.veilederinfo.data,
        aktiveDialoger,
        oppfolgingstilfelleperioder: state.oppfolgingstilfelleperioder,
        sykmeldinger: state.sykmeldinger.data,
    };
};

const MotebehovContainer = connect(mapStateToProps, mapDispatchToProps)(MotebehovSide);

export default MotebehovContainer;
