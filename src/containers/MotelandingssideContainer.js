import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Side from '../sider/Side';
import { MOETEPLANLEGGER } from '../enums/menypunkter';
import * as moterActions from '../actions/moter_actions';
import AppSpinner from '../components/AppSpinner';
import Feilmelding from '../components/Feilmelding';
import Motelandingsside from '../components/Motelandingsside';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';

const texts = {
    pageTitle: 'Møtelandingsside',
    errorTitle: 'Du har ikke tilgang til denne tjenesten',
};

export class MotelandingssideSide extends Component {
    componentDidMount() {
        const {
            hentMoter,
            fnr,
        } = this.props;
        hentMoter(fnr);
    }

    render() {
        const {
            fnr,
            henter,
            hentingFeilet,
            mote,
            tilgang,
        } = this.props;
        return (<Side fnr={fnr} tittel={texts.pageTitle} aktivtMenypunkt={MOETEPLANLEGGER}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    }
                    if (!tilgang.harTilgang) {
                        return (<Feilmelding
                            tittel={texts.errorTitle}
                            melding={hentBegrunnelseTekst(tilgang.begrunnelse)}
                        />);
                    }
                    if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    return (<Motelandingsside
                        fnr={fnr}
                        mote={mote}
                    />);
                })()
            }
        </Side>);
    }
}

MotelandingssideSide.propTypes = {
    fnr: PropTypes.string,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    hentMoter: PropTypes.func,
    mote: PropTypes.object,
    tilgang: PropTypes.object,
};

export const mapStateToProps = (state, ownProps) => {
    const aktivtMote = state.moter.data.filter((mote) => {
        return mote.status !== 'AVBRUTT';
    })[0];

    return {
        fnr: ownProps.params.fnr,
        henter: state.tilgang.henter
        || state.moter.henter,
        hentingFeilet: state.tilgang.hentingFeilet,
        mote: aktivtMote,
        tilgang: state.tilgang.data,
    };
};

const MotelandingssideContainer = connect(mapStateToProps, moterActions)(MotelandingssideSide);

export default MotelandingssideContainer;
