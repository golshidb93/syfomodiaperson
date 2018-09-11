import {
    HENT_SOKNADER_FEILET,
    HENTER_SOKNADER,
    SOKNADER_HENTET,
} from '../actions/actiontyper';
import { TIMER, DATO, PERIODER, PROSENT } from '../enums/svartyper';

const initiellState = {
    data: [],
    henter: false,
    hentingFeilet: false,
    hentet: false,
};

const getMinMax = (sporsmal) => {
    switch (sporsmal.svartype) {
        case PERIODER:
        case DATO: {
            return {
                min: sporsmal.min ? new Date(sporsmal.min) : sporsmal.min,
                max: sporsmal.max ? new Date(sporsmal.max) : sporsmal.max,
            };
        }
        case TIMER:
        case PROSENT: {
            return {
                min: parseInt(sporsmal.min, 10),
                max: parseInt(sporsmal.max, 10),
            };
        }
        default: {
            return {};
        }
    }
};

const parseSporsmal = (sporsmal) => {
    const minMax = getMinMax(sporsmal);
    return {
        ...sporsmal,
        ...minMax,
        undersporsmal: [...sporsmal.undersporsmal].map(parseSporsmal),
    };
};

export const parseSoknad = (soknad) => {
    console.log(soknad);
    return {
        ...soknad,
        fom: new Date(soknad.fom),
        tom: new Date(soknad.tom),
        opprettetDato: new Date(soknad.opprettetDato),
        sporsmal: [...soknad.sporsmal].map(parseSporsmal),
    };
};

export default (state = initiellState, action = {}) => {
    switch (action.type) {
        case SOKNADER_HENTET: {
            return {
                data: action.soknader.map(parseSoknad),
                hentet: true,
                henter: false,
                hentingFeilet: false,
            };
        }
        case HENT_SOKNADER_FEILET: {
            return {
                data: [],
                hentet: true,
                henter: false,
                hentingFeilet: true,
            };
        }
        case HENTER_SOKNADER: {
            return {
                data: [],
                hentet: false,
                henter: true,
                hentingFeilet: false,
            };
        }
        default: {
            return state;
        }
    }
};
