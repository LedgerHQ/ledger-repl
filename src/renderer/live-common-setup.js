// @flow
import axios from "axios";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import TransportWebAuthn from "@ledgerhq/hw-transport-webauthn";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import TransportWebBLE from "@ledgerhq/hw-transport-web-ble";
import { setNetwork } from "@ledgerhq/live-common/lib/network";
import { registerTransportModule } from "@ledgerhq/live-common/lib/hw";

import "@ledgerhq/live-common/lib/load/tokens/ethereum/erc20";

// TODO : should log the network requests to the console itself!
setNetwork(axios);

const webusbDevices = {};

/*
TODO node-hid transport support + forward APDUs from renderer using a new kind of hw-transport proxy.
*/

registerTransportModule({
  id: "u2f",

  open: (id: string): ?Promise<*> => {
    if (id.startsWith("u2f")) {
      return TransportU2F.create();
    }
    return null;
  },

  disconnect: id =>
    id.startsWith("u2f")
      ? Promise.resolve() // nothing to do
      : null
});

registerTransportModule({
  id: "webauthn",

  open: (id: string): ?Promise<*> => {
    if (id.startsWith("webauthn")) {
      return TransportWebAuthn.create();
    }
    return null;
  },

  disconnect: id =>
    id.startsWith("webauthn")
      ? Promise.resolve() // nothing to do
      : null
});

registerTransportModule({
  id: "webusb",

  open: (id: string): ?Promise<*> => {
    if (id.startsWith("webusb")) {
      const existingDevice = webusbDevices[id];
      return (existingDevice
        ? TransportWebUSB.open(existingDevice)
        : TransportWebUSB.create()
      ).then(t => {
        // fallback on create() in case discovery not used (we later should backport this in open?)
        t.setDebugMode(true);
        return t;
      });
    }
    return null;
  },

  disconnect: id =>
    id.startsWith("webusb")
      ? Promise.resolve() // nothing to do
      : null
});

const webbleDevices = {};

registerTransportModule({
  id: "webble",

  open: (id: string): ?Promise<*> => {
    if (id.startsWith("webble")) {
      const existingDevice = webbleDevices[id];
      return (existingDevice
        ? TransportWebBLE.open(existingDevice)
        : TransportWebBLE.create()
      ).then(t => {
        // fallback on create() in case discovery not used (we later should backport this in open?)
        t.setDebugMode(true);
        return t;
      });
    }
    return null;
  },

  disconnect: id =>
    id.startsWith("webble")
      ? Promise.resolve() // nothing to do
      : null
});

registerTransportModule({
  id: "hid",

  open: async (id: string): Promise<*> => {
    if (id.startsWith("hid")) {
      await window.ledgerHidTransport("open");
      return {
        on: () => {},
        setDebugMode: () => {},
        setScrambleKey: () => {},
        decorateAppAPIMethods: () => {},
        close: () => window.ledgerHidTransport("close"),
        send: async (...args) => {
          const { data } = await window.ledgerHidTransport("send", ...args);
          return Buffer.from(data);
        }
      };
    }
    return null;
  },

  disconnect: id =>
    id.startsWith("hid") ? window.ledgerHidTransport("close") : null
});
