import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { getLedetekst } from 'digisyfo-npm';


const LenkeTilDineSykmeldinger = ({ ledetekster, fnr }) => {
    return (<p className="side-innhold ikke-print blokk navigasjonsstripe">
        <Link to={`/sykefravaer/${fnr}/sykmeldinger`}>
            {getLedetekst('din-sykmelding.tilbake', ledetekster)}
        </Link>
    </p>);
};

LenkeTilDineSykmeldinger.propTypes = {
    ledetekster: PropTypes.object,
    fnr: PropTypes.string,
};

export default LenkeTilDineSykmeldinger;
