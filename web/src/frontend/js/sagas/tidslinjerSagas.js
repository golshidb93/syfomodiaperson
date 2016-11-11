import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from '../api';
import * as actions from '../actions/tidslinjer_actions';
import { apneHendelser, log } from 'digisyfo-npm';

export function* hentTidslinjer(action) {
    yield put(actions.henterTidslinjer());
    try {
        const data = yield call(get, `${window.APP_SETTINGS.REST_ROOT}/tidslinje?fnr=${action.fnr}&type=${action.arbeidssituasjon}`);
        yield put(actions.setTidslinjer(data, action.arbeidssituasjon));
        if (action.apneHendelseIder.length) {
            yield put(apneHendelser(action.apneHendelseIder));
        }
    } catch (e) {
        log(e);
        yield put(actions.hentTidslinjerFeilet());
    }
}

function* watchHentTidslinjer() {
    yield* takeEvery('HENT_TIDSLINJER_FORESPURT', hentTidslinjer);
}

export default function* tidslinjerSagas() {
    yield fork(watchHentTidslinjer);
}
