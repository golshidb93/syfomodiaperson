import { tilgangBrukerMock } from "../data/tilgangtilbrukerMock";
import { SYFOTILGANGSKONTROLL_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";

const Auth = require("../../server/auth/index.js");

export const mockSyfotilgangskontroll = (server) => {
  server.get(
    `${SYFOTILGANGSKONTROLL_ROOT}/tilgang/navident/person`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(tilgangBrukerMock));
      } else {
        res.status(400).send();
      }
    }
  );
};
