import { expect } from 'chai';
import { MotebookingSkjema, VelgLeder, FyllUtLeder, validate, genererDato, getData } from '../../../js/mote/skjema/MotebookingSkjema';
import TextFieldLocked from '../../../js/components/TextFieldLocked';
import TextField from '../../../js/components/TextField';
import Tidspunkter from '../../../js/mote/skjema/Tidspunkter';
import { Field } from 'redux-form';
import { mount, shallow, render } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

describe("MotebookingSkjema", () => {

    describe("MotebookingSkjema", () => {

        let handleSubmit;

        beforeEach(() => {
            handleSubmit = sinon.spy();
        })

        it("Skal inneholde tidspunkter", () => {
            const compo = shallow(<MotebookingSkjema ledere={[]} handleSubmit={handleSubmit} />);
            expect(compo.contains(<Tidspunkter />)).to.be.true;
        });

        it("Skal inneholde felt med mulighet for å skrive inn sted", () => {
            const compo = shallow(<MotebookingSkjema ledere={[]} handleSubmit={handleSubmit} />);
            expect(compo.find(".js-sted").prop("name")).to.equal("sted");
        });

        it("Skal ikke vise feilmelding hvis sendingFeilet !== true", () => {
            const compo = shallow(<MotebookingSkjema ledere={[]} handleSubmit={handleSubmit} />);
            expect(compo.text()).not.to.contain("Beklager")
        });

        it("Skal vise feilmelding hvis sendingFeilet", () => {
            const compo = shallow(<MotebookingSkjema ledere={[]} handleSubmit={handleSubmit} sendingFeilet />);
            expect(compo.text()).to.contain("Beklager")
        });

        describe("Dersom det ikke finnes ledere", () => {
            it("SKal vise FyllUtLeder", () => {
                const compo = shallow(<MotebookingSkjema ledere={[]} handleSubmit={handleSubmit} />);
                expect(compo.find(FyllUtLeder)).to.have.length(1);
            })

            it("Skal ikke vise en dropdown dersom det ikke finnes ledere", () => {
                const compo = shallow(<MotebookingSkjema ledere={[]} handleSubmit={handleSubmit} sendingFeilet />);
                expect(compo.find(VelgLeder)).to.have.length(0);
            });
        });

        describe("Dersom det finnes ledere", () => {

            let ledere;

            beforeEach(() => {
                ledere = [{
                    navn: "Ole",
                    epost: "ole@ole.no",
                    organisasjonsnavn: "Oles pizza"
                }];
            })

            it("Skal vise en dropdown dersom det finnes ledere", () => {
                const compo = shallow(<MotebookingSkjema ledere={ledere} handleSubmit={handleSubmit} sendingFeilet />);
                expect(compo.find(VelgLeder)).to.have.length(1);
            });

            it("Skal da ikke inneholde felter for å skrive inn arbeidsgivers opplysninger", () => {
                const compo = shallow(<MotebookingSkjema ledere={ledere} handleSubmit={handleSubmit} />);
                expect(compo.find(".js-arbeidsgiver").find(FyllUtLeder)).to.have.length(0);
            });

            it("Skal vise felter for å skrive inn arbeidsgivers opplysninger når state.visLederValg === true", () => {
                const compo = shallow(<MotebookingSkjema ledere={ledere} handleSubmit={handleSubmit} />);
                compo.setState({visLederValg: true})
                expect(compo.find(".js-arbeidsgiver").find(FyllUtLeder)).to.have.length(1);
            });

            it("Skal sende inn TextField === TextField dersom manuell === true", () => {
                const compo = shallow(<MotebookingSkjema ledere={ledere} handleSubmit={handleSubmit} />);
                compo.setState({visLederValg: true, manuell: true})
                expect(compo.find(".js-arbeidsgiver").find(FyllUtLeder).prop("FieldComponent")).to.equal(TextField)
            });


            it("Skal sende inn TextField === TextFieldLocked dersom manuell === false", () => {
                const compo = shallow(<MotebookingSkjema ledere={ledere} handleSubmit={handleSubmit} />);
                compo.setState({visLederValg: true, manuell: false})
                expect(compo.find(".js-arbeidsgiver").find(FyllUtLeder).prop("FieldComponent")).to.equal(TextFieldLocked)
            });

        })

    });

    describe("FyllUtLeder", () => {
        it("Skal inneholde felter for å skrive inn arbeidsgivers opplysninger", () => {
            const compo = shallow(<FyllUtLeder />);
            expect(compo.find(Field)).to.have.length(2);
        });

        it("Skal inneholde felter med riktig type for å skrive inn arbeidsgivers opplysninger", () => {
            const compo = shallow(<FyllUtLeder />);
            expect(compo.find(Field).first().prop("name")).to.equal("deltakere[0].navn")
            expect(compo.find(Field).last().prop("name")).to.equal("deltakere[0].epost")
        });
    });

    describe("VelgLeder", () => {

        let onChange;
        let ledere;

        beforeEach(() => {
            onChange = sinon.spy();
            ledere = [{
                id: 1,
                navn: "Bjarne",
                organisasjonsnavn: "BEKK"
            }, {
                id: 2,
                navn: "Arne", 
                organisasjonsnavn: "BEKK"
            }, {
                id: 3, 
                navn: "Abba",
                organisasjonsnavn: "BEKK"
            }, {
                id: 4,
                navn: "Aage",
                organisasjonsnavn: "ABC Buss"
            }]
        });

        it("Skal kalle onChange v/change", () => {
            const compo = mount(<VelgLeder ledere={ledere} onChange={onChange} />);

            compo.find("select").simulate("change", {
                target: {
                    value: "druer"
                }
            });
            expect(onChange.calledOnce).to.be.true;
            expect(onChange.getCall(0).args[0]).to.equal("druer");
        });

        it("Skal inneholde et valg for manuell utfylling", () => {
            const compo = mount(<VelgLeder ledere={ledere} onChange={onChange} />);
            expect(compo.find("option")).to.have.length(6);
            expect(compo.find("option").last().text()).to.contain("fyll inn manuelt")
        });

    });

    describe("validate", () => {

        let values;

        beforeEach(() => {
            values = {};
        });

        it("Skal validere nærmeste leders e-post dersom e-post ikke er fylt ut", () => {
            const res = validate(values);
            expect(res.deltakere[0].epost).to.equal("Vennligst fyll ut nærmeste leders e-post-adresse");
        });

        it("Skal validere nærmeste leders e-post dersom e-post er ugyldig", () => {
            values.deltakere = [{
                epost: "min epost"
            }];
            const res = validate(values);
            expect(res.deltakere[0].epost).to.equal("Vennligst fyll ut en gyldig e-post-adresse");
        });

        it("Skal validere nærmeste leders navn dersom det ikke er fylt ut", () => {
            const res = validate(values);
            expect(res.deltakere[0].navn).to.equal("Vennligst fyll ut nærmeste leders navn");
        });

        it("Skal validere tidspunkter dersom ingen felt er angitt (1)", () => {
            const res = validate(values);
            expect(res.tidspunkter).to.deep.equal([{
                dato: "Vennligst angi dato",
                klokkeslett: "Vennligst angi klokkeslett"
            }, {
                dato: "Vennligst angi dato",
                klokkeslett: "Vennligst angi klokkeslett"
            }])
        });

        it("Skal validere tidspunkter dersom ingen felt er angitt (2)", () => {
            values.tidspunkter = []
            const res = validate(values);
            expect(res.tidspunkter).to.deep.equal([{
                dato: "Vennligst angi dato",
                klokkeslett: "Vennligst angi klokkeslett"
            }, {
                dato: "Vennligst angi dato",
                klokkeslett: "Vennligst angi klokkeslett"
            }])
        });

        it("Skal validere tidspunkter dersom første felt mangler dato", () => {
            values.tidspunkter = [{
                klokkeslett: "12.15"
            }, {
                dato: "22.01.2016",
                klokkeslett: "10.00"
            }]
            const res = validate(values);
            expect(res.tidspunkter).to.deep.equal([{
                dato: "Vennligst angi dato",
            }, {}])
        });

        it("Skal validere tidspunkter dersom dato er på feil format", () => {
            values.tidspunkter = [{
                dato: "A1.12.2016",
            }, {}]
            const res = validate(values);
            expect(res.tidspunkter[0].dato).to.equal("Vennligst angi riktig datoformat; dd.mm.åååå");
        });

        it("Skal validere tidspunkter dersom klokkeslett er på feil format", () => {
            values.tidspunkter = [{
                dato: "12.12.2016",
                klokkeslett: "A1.11"
            }, {}]
            const res = validate(values);
            expect(res.tidspunkter[0].klokkeslett).to.equal("Vennligst angi riktig format; f.eks. 13.00");
        });

        it("Skal validere tidspunkter dersom andre felt mangler dato", () => {
            values.tidspunkter = [{
                dato: "22.02.2016",
                klokkeslett: "12.15"
            }, {
                klokkeslett: "10.00"
            }]
            const res = validate(values);
            expect(res.tidspunkter).to.deep.equal([{}, {
                dato: "Vennligst angi dato",
            }])
        });

        it("Skal validere tidspunkter dersom andre felt mangler klokkeslett", () => {
            values.tidspunkter = [{
                dato: "12.12.2016",
                klokkeslett: "10.00"
            }, {
                dato: "22.01.2016",
            }]
            const res = validate(values);
            expect(res.tidspunkter).to.deep.equal([{}, {
                klokkeslett: "Vennligst angi klokkeslett",
            }])
        });

        it("Skal validere sted dersom sted ikke finnes", () => {
            const res = validate(values)
            expect(res.sted).to.equal("Vennligst angi møtested")
        });

        it("Skal validere sted dersom sted finnes", () => {
            values.sted = "Økernveien 94"
            const res = validate(values)
            expect(res.sted).to.be.undefined;
        });

        it("Skal validere sted dersom sted er en tom streng (1)", () => {
            values.sted = " ";
            const res = validate(values)
            expect(res.sted).to.equal("Vennligst angi møtested")
        });

        it("Skal validere sted dersom sted er en tom streng (2)", () => {
            values.sted = "";
            const res = validate(values)
            expect(res.sted).to.equal("Vennligst angi møtested")
        });

    })

    describe("genererDato", () => {
        it("Skal returnere dato på riktig format når dato er dd.mm.åååå", () => {
            const klokkeslett = "12.15";
            const dato = "15.06.2017";
            expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T10:15:00.000Z");
        });

        it("Skal returnere dato på riktig format når dato er dd.mm.åå", () => {
            const klokkeslett = "12.15";
            const dato = "15.06.17";
            expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T10:15:00.000Z");
        });

        it("Skal returnere dato på riktig format", () => {
            const klokkeslett = "1.15";
            const dato = "15.06.2017";
            expect(genererDato(dato, klokkeslett)).to.equal("2017-06-14T23:15:00.000Z");
        });
    });

    describe("getData", () => {
        it("Skal svare med data på riktig format", () => {
            const values = {
                "deltakere": [
                    {
                        "navn": "***REMOVED***",
                        "epost": "ole.olsen@nav.no",
                    }
                ],
                "tidspunkter": [
                    {
                        "dato": "12.08.2016",
                        "klokkeslett": "15.00"
                    },
                    {
                        "dato": "13.08.2016",
                        "klokkeslett": "12.00"
                    }
                ],
                "sted": "Oslo"
            };
            const res = getData(values)
            expect(res).to.deep.equal({
                deltakere: [
                    {
                        "navn": "***REMOVED***",
                        "epost": "ole.olsen@nav.no",
                        "type": "arbeidsgiver",
                        "svar": [
                            {
                                "sted": "Oslo",
                                "tid": "2016-08-12T13:00:00.000Z",
                                "valgt":false,
                            },
                            {
                                "sted": "Oslo",
                                "tid": "2016-08-13T10:00:00.000Z",
                                "valgt":false,
                            }
                        ],
                        "avvik": [],
                    }
                ],
                alternativer: [{
                    "sted": "Oslo",
                    "tid": "2016-08-12T13:00:00.000Z",
                    "valgt": false
                }, {
                    "sted": "Oslo",
                    "tid": "2016-08-13T10:00:00.000Z",
                    "valgt": false
                }]
            })
        });
    })

})