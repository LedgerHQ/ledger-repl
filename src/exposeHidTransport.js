// @flow
import invariant from "invariant";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-noevents";
import { serializeError } from "@ledgerhq/errors";

let transport = null;

export default (app: *) => {
  app.exposeFunction("ledgerHidTransport", async (cmd, ...args) => {
    try {
      switch (cmd) {
        case "open":
          invariant(!transport, "HID is already opened");
          transport = await TransportNodeHid.open("");
          transport.on("disconnect", () => {
            transport = null;
          });
          return;

        case "close":
          invariant(transport, "HID was not opened");
          try {
            await transport.close();
          } finally {
            transport = null;
          }
          return true;

        case "exchange":
          invariant(transport, "HID was not opened");
          const [hex] = args;
          const response = await transport.exchange(Buffer.from(hex, "hex"));
          return response.toString("hex");
      }
    } catch (e) {
      throw serializeError(e);
    }
  });
};
