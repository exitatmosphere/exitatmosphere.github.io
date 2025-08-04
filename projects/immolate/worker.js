let task;

self.Immolate = {
  onRuntimeInitialized: function () {
    onImmolateInitialized();
  },
};

importScripts("immolate.js", "tasks.js");

function onImmolateInitialized() {
  switch (task) {
    case "perkTribObs": {
      const result = perkTribObs();
      postMessage({ task, result });
      break;
    }
    default: {
      postMessage({ task, result: "Unknown task" });
    }
  }
}

onmessage = async ({ data }) => {
  task = data.task;
};
