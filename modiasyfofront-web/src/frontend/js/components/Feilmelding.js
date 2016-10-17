import React, { PropTypes } from 'react';

const Feilmelding = ({ tittel = 'Beklager, det oppstod en feil', melding = 'Vennligst prøv igjen litt senere.' }) => {
    return (<div className="panel">
        <h3 className="typo-undertittel">{tittel}</h3>
        <p>{melding}</p>
    </div>);
};

Feilmelding.propTypes = {
    tittel: PropTypes.string,
    melding: PropTypes.string,
};

export default Feilmelding;
