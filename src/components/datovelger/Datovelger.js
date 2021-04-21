import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import MaskedInput from "react-maskedinput";
import Feilmelding from "./DatovelgerFeilmelding";
import DayPickerComponent from "./DayPicker";

import {
  erGyldigDato,
  erGyldigDatoformat,
  fraInputdatoTilJSDato,
} from "../../utils/datovelgerUtils";
import { toDatePrettyPrint } from "../../utils/datoUtils";

export class DatoField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erApen: false,
    };
  }

  onKeyUp(e) {
    const ESCAPE_KEYCODE = 27;
    if (e.which === ESCAPE_KEYCODE) {
      this.lukk();
    }
  }

  toggle() {
    if (this.state.erApen) {
      this.lukk();
    } else {
      this.apne();
    }
  }

  apne() {
    this.setState({
      erApen: true,
    });
  }

  lukk() {
    this.setState({
      erApen: false,
    });
    this.refs.toggle.focus();
  }

  render() {
    const { meta, input, id, tidligsteFom, senesteTom } = this.props;
    return (
      <div className="datovelger">
        <div
          className="datovelger__inner"
          onClick={(event) => {
            try {
              event.nativeEvent.stopImmediatePropagation();
            } catch (e) {
              event.stopPropagation();
            }
          }}
        >
          <div className="datovelger__inputContainer">
            <MaskedInput
              className={`skjemaelement__input datovelger__input${
                meta.touched && meta.error
                  ? " skjemaelement__input--harFeil"
                  : ""
              }`}
              type="tel"
              mask="11.11.1111"
              autoComplete="off"
              placeholder="dd.mm.åååå"
              id={id}
              {...input}
            />
            <button
              className="js-toggle datovelger__toggleDayPicker"
              ref="toggle"
              id={`toggle-${id}`}
              onKeyUp={(e) => {
                this.onKeyUp(e);
              }}
              onClick={(e) => {
                e.preventDefault();
                this.toggle();
              }}
              aria-pressed={this.erApen}
            >
              {this.state.erApen ? "Skjul datovelger" : "Vis datovelger"}
            </button>
          </div>
          {this.state.erApen && (
            <DayPickerComponent
              {...this.props}
              ariaControlledBy={`toggle-${id}`}
              tidligsteFom={tidligsteFom}
              senesteTom={senesteTom}
              onDayClick={(event, jsDato) => {
                const dateString = toDatePrettyPrint(new Date(jsDato));
                this.props.input.onChange(dateString);
                this.props.input.onBlur();
                this.lukk();
              }}
              onKeyUp={(e) => {
                this.onKeyUp(e);
              }}
              lukk={() => {
                this.lukk();
              }}
            />
          )}
          <Feilmelding {...meta} />
        </div>
      </div>
    );
  }
}

DatoField.propTypes = {
  meta: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  tidligsteFom: PropTypes.instanceOf(Date),
  senesteTom: PropTypes.instanceOf(Date),
};

export const validerPeriode = (input, alternativer) => {
  const { fra, til } = alternativer;
  const inputDato = fraInputdatoTilJSDato(input);
  if (fra && til && (inputDato < fra || inputDato > til)) {
    return `Datoen må være innenfor perioden ${toDatePrettyPrint(
      fra
    )}-${toDatePrettyPrint(til)}`;
  }
  if (til && inputDato > til) {
    return `Datoen må være før ${toDatePrettyPrint(til)}`;
  }
  if (fra && inputDato < fra) {
    return `Datoen må være etter ${toDatePrettyPrint(fra)}`;
  }
  return undefined;
};

export const validerDatoField = (value) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const alternativer = {
    fra: startOfDay,
    til: undefined,
  };
  if (!value) {
    return undefined;
  } else if (!erGyldigDatoformat(value)) {
    return "Datoen må være på formatet dd.mm.åååå";
  } else if (!erGyldigDato(value)) {
    return "Datoen er ikke gyldig";
  } else if (alternativer && (alternativer.fra || alternativer.til)) {
    return validerPeriode(value, alternativer);
  }
  return undefined;
};

const Datovelger = (props) => (
  <Field component={DatoField} validate={validerDatoField} {...props} />
);

export default Datovelger;
