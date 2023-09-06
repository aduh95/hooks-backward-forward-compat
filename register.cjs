"use strict";
const Module = require("node:module");
const { pathToFileURL } = require("node:url");
const { MessageChannel } = require("node:worker_threads");

const messageHandler = (msg) => {
  console.log("received from loader", msg);
};

// --- Here is where the main thread preparation work is done ---
// …
globalThis.mainThreadPreparationWorkIsDone = true;
// …
// ---

if (Module.register) {
  const { port1, port2 } = new MessageChannel();

  port1.on("message", messageHandler);

  Module.register("./loader.mjs", `${pathToFileURL(__filename)}`, {
    data: { port: port2 },
    transferList: [port2],
  });
} else {
  // On Node.js <20.6, we need to get the port from the globalPreload hook.
  globalThis.getPortFromLoader = (port) => {
    port.on("message", messageHandler);
    delete globalThis.getPortFromLoader;
  };
}
