import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Tidspunkter from '../../../js/mote/skjema/Tidspunkter';
import Tidspunkt from '../../../js/mote/skjema/Tidspunkt';
import Datovelger from '../../../js/components/datovelger/Datovelger';

describe('Tidspunkter', () => {
    let component;

    it('Skal vise et tidspunkter som default', () => {
        component = shallow(<Tidspunkter skjemanavn="Bananer" />);
        expect(component.find(Tidspunkt)).to.have.length(1);
    });

    it('Skal vise tre tidspunkter dersom man dytter det inn eksplisitt', () => {
        component = shallow(<Tidspunkter
            skjemanavn='Bananer'
            antallNyeTidspunkt={3}
        />);
        expect(component.find(Tidspunkt)).to.have.length(3);
    });

    it('Skal sende skjemanavn videre til Tidspunkt', () => {
        component = shallow(<Tidspunkter
            skjemanavn="mitt-skjemanavn"
            antallNyeTidspunkt={3}
        />);
        expect(component.find(Tidspunkt).at(0).prop('skjemanavn')).to.equal('mitt-skjemanavn')
    });
});

describe('Tidspunkt', () => {
    let component;

    beforeEach(() => {
        component = shallow(<Tidspunkt
            antallNyeTidspunkt={1}
            skjemanavn="Bananer"
        />);
    });

    it('Skal inneholde en Datovelger', () => {
        expect(component.find(Datovelger)).to.have.length(1);
    });

    it('Skal sende skjemanavn videre til Datovelger', () => {
        expect(component.find(Datovelger)).to.have.length(1);
        expect(component.find(Datovelger).prop('skjemanavn')).to.equal('Bananer')
    });
});
