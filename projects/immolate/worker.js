let task;
let args;

self.Immolate = {
  onRuntimeInitialized: function () {
    onImmolateInitialized();
  },
};

importScripts("immolate.js", "tasks.js");

function onImmolateInitialized() {
  switch (task) {
    case "perkTribObs(WASM)": {
      const result = self.Immolate.perkTribObs(...args);
      postMessage({
        task,
        result: [result.tries, result.seed, result.voucherAntes, result.time],
      });
      break;
    }
    default: {
      postMessage({ task, result: "Unknown task" });
    }
  }
}

onmessage = async ({ data }) => {
  task = data.task;
  args = data.args;
};
