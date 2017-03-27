import chai from 'chai';
import React from 'react'
import {mount, shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import DayPicker from 'react-day-picker';
import { Field } from 'redux-form';
import MaskedInput from 'react-maskedinput';
import { connect } from 'react-redux';

chai.use(chaiEnzyme());
const expect = chai.expect;

import Datovelger, { DatoField, validerDatoField } from '../../js/components/datovelger/Datovelger';
import DaypickerComponent, { Caption, MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from '../../js/components/datovelger/DayPicker';

describe("DaypickerComponent", () => {

    let component; 
    let input;
    let meta;
    let preventDefault;
    let stopImmediatePropagation;
    let clock;
    let dp;
    let onKeyUp;
    let onDayClick;

    beforeEach(() => {
        clock = sinon.useFakeTimers(1484524800000); // 16. januar 2017
        input = {
            value: ""
        }
        meta = {
            touched: false,
            error: ""
        }
        onKeyUp = sinon.spy();
        onDayClick = sinon.spy();
        component = shallow(<DaypickerComponent input={input} meta={meta} onKeyUp={onKeyUp} onDayClick={onDayClick} />)
        dp = component.find(DayPicker);
    });

    afterEach(() => {
        clock.restore();
    });

    it("Skal ha en selectedDays-funksjon som returnere false (fordi dato ikke er satt)", () => {
        expect(component.instance().selectedDays(new Date())).to.be.false;
    });

    it("Skal sette initialMonth til dagens måned", () => {
        expect(dp.prop("initialMonth")).to.deep.equal(new Date())
    });

    describe("Når dato er satt", () => {
        beforeEach(() => {
            input.value = "22.02.2017";
            component = shallow(<DaypickerComponent input={input} meta={meta} />);
            component.setState({erApen: true});
        });

        it("Skal sette initialMonth til valgt måned", () => {
            expect(component.find(DayPicker).prop("initialMonth")).to.deep.equal(new Date("2017-02-22"))        
        });

        it("Skal ha en selectedDays-funksjon som returnere true hvis innsendt dato er lik valgt dato", () => {
            expect(component.instance().selectedDays(new Date("2017-02-22"))).to.be.true;
        });

        it("Skal ha en selectedDays-funksjon som returnere true hvis innsendt dato ikke er lik valgt dato", () => {
            expect(component.instance().selectedDays(new Date("2017-02-21"))).to.be.false;
        });
    });

    describe("Når dato er satt til noe ugyldig", () => {
        beforeEach(() => {
            input.value = "22.02.201";
            component = shallow(<DaypickerComponent input={input} meta={meta} id="olsen" />);
            component.setState({erApen: true});
        });

        it("Skal sette initialMonth til dagens måned", () => {
            expect(component.find(DayPicker).prop("initialMonth")).to.deep.equal(new Date())        
        });

        it("Skal ha en selectedDays-funksjon som returnerer false", () => {
            expect(component.instance().selectedDays(new Date("2017-02-22"))).to.be.false;
        });
    });

    describe("onDayClick", () => {

        beforeEach(() => {
            const tidligsteFom = new Date("2017-01-10");
            const senesteTom = new Date("2017-01-20");
            component = shallow(<DaypickerComponent input={input} meta={meta} onDayClick={onDayClick} tidligsteFom={tidligsteFom} senesteTom={senesteTom} />);
            dp = component.find(DayPicker);
        })

        it("Skal kalle på innsendt onDayClick hvis dag er aktiv", () => {
            dp.prop("onDayClick")({}, new Date("2017-01-12"));
            expect(onDayClick.called).to.be.true;
        });

        it("Skal kalle på innsendt onDayClick hvis dag er aktiv og det ikke finnes tidligsteFom/senesteTom", () => {
            component = shallow(<DaypickerComponent input={input} meta={meta} onKeyUp={onKeyUp} onDayClick={onDayClick} />)
            dp = component.find(DayPicker);
            dp.prop("onDayClick")({}, new Date("2017-01-12"));
            expect(onDayClick.called).to.be.true;
        });

        it("Skal ikke kalle på innsendt onDayClick hvis dag er deaktivert", () => {
            dp.prop("onDayClick")({}, new Date("2017-01-09"));
            expect(onDayClick.called).to.be.false;
        });

    });

    describe("erDeaktivertDag", () => {

        let erDeaktivertDag;
        let component;

        beforeEach(() => {
            const tidligsteFom = new Date("2017-01-10");
            const senesteTom = new Date("2017-01-20");
            component = shallow(<DaypickerComponent input={input} meta={meta} id="olsen" tidligsteFom={tidligsteFom} senesteTom={senesteTom} />);
        });

        it("Skal returnere true hvis innsendt dato er før tidligsteFom", () => {
            expect(component.instance().erDeaktivertDag(new Date("2017-01-08"))).to.be.true;
        });

        it("Skal returnere true hvis innsendt dato er etter senesteTom", () => {
            expect(component.instance().erDeaktivertDag(new Date("2017-01-21"))).to.be.true;
        });

        it("Skal returnere false hvis innsendt dato er samme dag som tidligsteFom", () => {
            expect(component.instance().erDeaktivertDag(new Date("2017-01-10"))).to.be.false;
        });

        it("Skal returnere false hvis innsendt dato er samme dag som senesteTom", () => {
            expect(component.instance().erDeaktivertDag(new Date("2017-01-20"))).to.be.false;
        });

        it("Skal returnere false hvis innsendt dato er mellom tidligsteFom og senesteTom", () => {
            expect(component.instance().erDeaktivertDag(new Date("2017-01-11"))).to.be.false;
            expect(component.instance().erDeaktivertDag(new Date("2017-01-19"))).to.be.false;
        });

        it("Feil med tidssone", () => {
            var day = new Date("Wed Jul 20 2016 12:00:00 GMT+0200 (Central Europe Daylight Time)");
            var senesteTom = new Date("Wed Jul 20 2016 02:00:00 GMT+0200 (Central Europe Daylight Time)");
            component = shallow(<DaypickerComponent input={input} meta={meta} id="olsen" senesteTom={senesteTom} />);
            expect(component.instance().erDeaktivertDag(day)).to.be.false;
        })

        describe("erDeaktivertDag med bare tidligsteFom", () => {

            beforeEach(() => {
                const tidligsteFom = new Date("2017-01-10");
                component = shallow(<DaypickerComponent input={input} meta={meta} id="olsen" tidligsteFom={tidligsteFom} />);
            });

            it("Skal returnere true hvis innsendt dato er før tidligsteFom", () => {
                expect(component.instance().erDeaktivertDag(new Date("2017-01-08"))).to.be.true;
            });

            it("Skal returnere false hvis innsendt dato er samme dag som tidligsteFom", () => {
                expect(component.instance().erDeaktivertDag(new Date("2017-01-10"))).to.be.false;
            });

            it("Skal returnere false hvis innsendt dato er etter tidligsteFom", () => {
                expect(component.instance().erDeaktivertDag(new Date("2017-01-11"))).to.be.false;
            });

        });

        describe("erDeaktivertDag med bare senesteTom", () => {

            beforeEach(() => {
                const senesteTom = new Date("2017-01-20");
                component = shallow(<DaypickerComponent input={input} meta={meta} id="olsen" senesteTom={senesteTom} />);
            });

            it("Skal returnere true hvis innsendt dato er etter senesteTom", () => {
                expect(component.instance().erDeaktivertDag(new Date("2017-01-21"))).to.be.true;
            });

            it("Skal returnere false hvis innsendt dato er samme dag som senesteTom", () => {
                expect(component.instance().erDeaktivertDag(new Date("2017-01-20"))).to.be.false;
            });

            it("Skal returnere false hvis innsendt dato er før senesteTom", () => {
                expect(component.instance().erDeaktivertDag(new Date("2017-01-11"))).to.be.false;
            });

        });


    });

});