// @flow
import axios from "axios";
import { Observable } from "rxjs";
import {
  deserializeError,
  DisconnectedDevice,
  DisconnectedDeviceDuringOperation
} from "@ledgerhq/errors";
import { map } from "rxjs/operators";
import Transport from "@ledgerhq/hw-transport";
import TransportWebAuthn from "@ledgerhq/hw-transport-webauthn";
import withStaticURL from "@ledgerhq/hw-transport-http";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import TransportWebBLE from "@ledgerhq/hw-transport-web-ble";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { setNetwork } from "@ledgerhq/live-common/lib/network";
import { registerTransportModule } from "@ledgerhq/live-common/lib/hw";
import { implementCountervalues } from "@ledgerhq/live-common/lib/countervalues";

import "@ledgerhq/live-common/lib/load/tokens/ethereum/erc20";

// TODO : should log the network requests to the console itself!
setNetwork(axios);

implementCountervalues({
  network: axios,
  log: (...args) => console.log(...args), // eslint-disable-line no-console
  getAPIBaseURL: () => "https://countervalues.api.live.ledger.com",
  storeSelector: state => state.countervalues,
  pairsSelector: () => [],
  setExchangePairsAction: () => ({})
});

const webusbDevices = {};

registerTransportModule({
  id: "webhid",

  open: (id: string): ?Promise<*> => {
    if (id.startsWith("webhid")) {
      return TransportWebHID.create();
    }
    return null;
  },

  disconnect: id =>
    id.startsWith("webhid")
      ? Promise.resolve() // nothing to do
      : null
});

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
      return existingDevice
        ? TransportWebUSB.open(existingDevice)
        : TransportWebUSB.create();
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
      return existingDevice
        ? TransportWebBLE.open(existingDevice)
        : TransportWebBLE.create();
    }
    return null;
  },

  disconnect: id =>
    id.startsWith("webble")
      ? Promise.resolve() // nothing to do
      : null
});

let proxy;
registerTransportModule({
  id: "proxy",

  open: (id: string): ?Promise<*> => {
    if (id.startsWith("proxy")) {
      const urls = id.slice(6) || "ws://localhost:8435";
      const Tr = withStaticURL(urls);
      return Tr.create().then(t => {
        proxy = t;
        return t;
      });
    }
    return null;
  },

  disconnect: id => (id.startsWith("proxy") ? proxy && proxy.close() : null)
});

const { ledgerHidTransport } = window;
if (ledgerHidTransport) {
  const cmd = async (...args) => {
    try {
      const res = await ledgerHidTransport(...args);
      return res;
    } catch (e) {
      throw deserializeError(e);
    }
  };

  class HIDProxy extends Transport<*> {
    static isSupported = () => Promise.resolve(true);
    static list = () => Promise.resolve([null]);
    static listen = o => {
      let unsubscribed;
      setTimeout(() => {
        if (unsubscribed) return;
        o.next({ type: "add", descriptor: null });
        o.complete();
      }, 0);
      return {
        unsubscribe: () => {
          unsubscribed = true;
        }
      };
    };

    static open = async () => {
      await cmd("open");
      return new HIDProxy();
    };

    setScrambleKey() {}

    close() {
      return cmd("close");
    }

    async exchange(apdu: Buffer): Promise<Buffer> {
      const inputHex = apdu.toString("hex");
      try {
        const outputHex = await cmd("exchange", inputHex);
        return Buffer.from(outputHex, "hex");
      } catch (e) {
        if (
          e instanceof DisconnectedDeviceDuringOperation ||
          e instanceof DisconnectedDevice
        ) {
          this.emit("disconnect", e);
        }
        throw e;
      }
    }
  }

  registerTransportModule({
    id: "hid",

    open: id => {
      if (id.startsWith("hid")) {
        return HIDProxy.open();
      }
      return null;
    },

    disconnect: id => (id.startsWith("hid") ? cmd("close") : null)
  });
}
