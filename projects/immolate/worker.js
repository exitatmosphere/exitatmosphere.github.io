let task;
let args;

self.Immolate = {
  onRuntimeInitialized: function () {
    onImmolateInitialized();
  },
};

importScripts("immolate.js");

function onImmolateInitialized() {
  switch (task) {
    case "perkTribVouchers": {
      const vouchersVec = new self.Immolate.VectorStr();
      args[2].forEach((voucher) => vouchersVec.push_back(voucher));
      args[2] = vouchersVec;

      const result = self.Immolate.perkTribVouchers(...args);
      const voucherAntesVec = result.voucherAntes;
      const voucherAntesArray = [];
      for (let i = 0; i < voucherAntesVec.size(); i++) {
        voucherAntesArray.push(voucherAntesVec.get(i));
      }
      postMessage({
        task,
        result: [
          result.tries,
          result.seed,
          result.legendariesPacks,
          voucherAntesArray,
          result.time,
        ],
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
