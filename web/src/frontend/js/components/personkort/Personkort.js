import React, { PropTypes, Component } from 'react';
import { getLedetekst, Utvidbar } from 'digisyfo-npm';
import PersonkortVisning from './PersonkortVisning';
import Etikett from '../Etikett';
import { hentBrukersAlderFraFnr, hentBrukersKjoennFraFnr } from '../../utils/fnrUtils';
import {
    PERSONKORTVISNING_TYPE,
    KJOENN,
} from '../../konstanter';
import {
    henterEllerHarHentetDiskresjonskode,
    henterEllerHarHentetEgenansatt,
    henterEllerHarHentetFastleger,
} from '../../utils/reducerUtils';

export const PersonkortTittel = ({ diskresjonskode, egenansatt, navbruker }) => {
    const visEtiketter = diskresjonskode.data.diskresjonskode === '6'
    || diskresjonskode.data.diskresjonskode === '7'
    || egenansatt.data.erEgenAnsatt;
    const tittelImg = hentBrukersKjoennFraFnr(navbruker.kontaktinfo.fnr) === KJOENN.KVINNE ?
        '/sykefravaer/img/svg/kvinne.svg' : '/sykefravaer/img/svg/mann.svg';

    return (<div className="personkortTittel">
        <div className="personkortTittel__info">
            <img src={tittelImg} alt="person" />
            <div>
                <h3>{`${navbruker.navn ? navbruker.navn : ''} (${hentBrukersAlderFraFnr(navbruker.kontaktinfo.fnr)} år)`}</h3>
                <p>{navbruker.kontaktinfo.fnr}</p>
            </div>
        </div>
        { visEtiketter && <div className="personkortTittel__etikker">
            { diskresjonskode.data.diskresjonskode === '6' && <div>
                <Etikett tekst="Kode 6" variant="info" />
            </div> }
            { diskresjonskode.data.diskresjonskode === '7' && <div>
                <Etikett tekst="Kode 7" variant="info" />
            </div> }
            { egenansatt.data.erEgenAnsatt && <div>
                <Etikett tekst="Egen ansatt" variant="info" />
            </div> }
        </div>
        }
    </div>);
};
PersonkortTittel.propTypes = {
    egenansatt: PropTypes.object,
    diskresjonskode: PropTypes.object,
    navbruker: PropTypes.object,
};

class Personkort extends Component {
    constructor() {
        super();
        this.state = {
            visning: PERSONKORTVISNING_TYPE.SYKMELDT,
        };
        this.byttVisning = this.byttVisning.bind(this);
    }

    componentWillMount() {
        const { diskresjonskode, egenansatt, fastleger } = this.props;
        const brukerFnr = this.props.navbruker.kontaktinfo && this.props.navbruker.kontaktinfo.fnr;
        if (brukerFnr && !henterEllerHarHentetDiskresjonskode(diskresjonskode)) {
            this.props.actions.hentDiskresjonskode(brukerFnr);
        }
        if (brukerFnr && !henterEllerHarHentetEgenansatt(egenansatt)) {
            this.props.actions.hentEgenansatt(brukerFnr);
        }
        if (brukerFnr && !henterEllerHarHentetFastleger(fastleger)) {
            this.props.actions.hentFastleger(brukerFnr);
        }
    }

    byttVisning(visning) {
        this.setState({
            visning,
        });
    }

    render() {
        const {
            diskresjonskode,
            egenansatt,
            navbruker,
        } = this.props;
        const visning = this.state.visning;

        return (<div className="grid personkort">
            <div className="unit whole">
                <Utvidbar
                    erApen={false}
                    tittel={<PersonkortTittel
                        diskresjonskode={diskresjonskode}
                        egenansatt={egenansatt}
                        navbruker={navbruker}
                    />}
                >
                    <div>
                        <ul>
                            <li>
                                <button
                                    className={`${visning === PERSONKORTVISNING_TYPE.SYKMELDT && 'personkort__knapp--aktiv'}`}
                                    aria-pressed={visning === PERSONKORTVISNING_TYPE.SYKMELDT}
                                    onClick={() => {this.byttVisning(PERSONKORTVISNING_TYPE.SYKMELDT);}}>
                                    {getLedetekst('modiafront.personkort.visning.sykmeldt.knapp')}
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`${visning === PERSONKORTVISNING_TYPE.LEDER && 'personkort__knapp--aktiv'}`}
                                    aria-pressed={visning === PERSONKORTVISNING_TYPE.LEDER}
                                    onClick={() => {this.byttVisning(PERSONKORTVISNING_TYPE.LEDER);}}>
                                    {getLedetekst('modiafront.personkort.visning.leder.knapp')}
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`${visning === PERSONKORTVISNING_TYPE.LEGE && 'personkort__knapp--aktiv'}`}
                                    aria-pressed={visning === PERSONKORTVISNING_TYPE.LEGE}
                                    onClick={() => {this.byttVisning(PERSONKORTVISNING_TYPE.LEGE);}}>
                                    {getLedetekst('modiafront.personkort.visning.fastlege.knapp')}
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`${visning === PERSONKORTVISNING_TYPE.ENHET && 'personkort__knapp--aktiv'}`}
                                    aria-pressed={visning === PERSONKORTVISNING_TYPE.ENHET}
                                    onClick={() => {this.byttVisning(PERSONKORTVISNING_TYPE.ENHET);}}>
                                    {getLedetekst('modiafront.personkort.visning.enhet.knapp')}
                                </button>
                            </li>
                        </ul>

                        <PersonkortVisning
                            {...this.props}
                            visning={visning}
                        />

                    </div>
                </Utvidbar>
            </div>
        </div>);
    }
}
Personkort.propTypes = {
    ledetekster: PropTypes.object,
    actions: PropTypes.object,
    diskresjonskode: PropTypes.object,
    egenansatt: PropTypes.object,
    fastleger: PropTypes.object,
    navbruker: PropTypes.object,
    ledere: PropTypes.array,
    behandlendeEnhet: PropTypes.object,

};
export default Personkort;
