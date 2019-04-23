import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-noevents";

let transport = null;

export default app => {
  app.exposeFunction("ledgerHidTransport", async (cmd, ...args) => {
    if (cmd === "open") {
      transport = await TransportNodeHid.create();
    }
    if (cmd === "close") {
      await transport.close();
      transport = null;
    }
    if (cmd === "send") {
      return transport.send(...args);
    }
  });
};
