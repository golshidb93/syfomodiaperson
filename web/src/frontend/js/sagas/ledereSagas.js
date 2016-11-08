import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from '../api';

export function* hentLedere(action) {
    yield put({ type: 'HENTER_LEDERE' });
    try {
        const data = yield call(get, `${window.APP_SETTINGS.REST_ROOT}/naermesteleder?fnr=${action.fnr}`);
        yield put({ type: 'LEDERE_HENTET', data });
    } catch (e) {
        yield put({ type: 'HENT_LEDERE_FEILET' });
    }
}

function* watchHentLedere() {
    yield* takeEvery('HENT_LEDERE_FORESPURT', hentLedere);
}

export default function* ledereSagas() {
    yield fork(watchHentLedere);
}
