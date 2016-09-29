import { expect } from 'chai';
import { hentLedere } from '../../js/sagas/ledereSagas.js';
import { get } from '../../js/api';
import { put, call } from 'redux-saga/effects';

window.SYFO_SETTINGS = {
    REST_ROOT: "http://tjenester.nav.no/rest"
}

describe("ledereSagas", () => {

    const generator = hentLedere({
        fnr: "55"
    });

    it("Skal dispatche HENTER_LEDERE", () => {
        const nextPut = put({type: 'HENTER_LEDERE'});
        expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest hente ledere", () => {
        const nextCall = call(get, "http://tjenester.nav.no/rest/rest/naermesteleder?fnr=55");
        expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dernest hente ledere", () => {
        const nextPut = put({
            type: 'LEDERE_HENTET',
            data: "mine data"
        });
        expect(generator.next("mine data").value).to.deep.equal(nextPut);
    });

})