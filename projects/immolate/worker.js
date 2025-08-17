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
    case "findSeed": {
      const srandSeed = args[0];

      const jokersToFindOneOf = new self.Immolate.VectorStr();
      args[1].forEach((joker) => jokersToFindOneOf.push_back(joker));
      const jokerToFindNegative = args[2];
      const jokerToFindAnkh = args[3];

      const legendariesToFind = new self.Immolate.VectorStr();
      args[4].forEach((legendary) => legendariesToFind.push_back(legendary));
      const legendariesToFindNegatives = args[5];
      const legendariesToFindMaxAnte = args[6];

      const vouchersToFind = new self.Immolate.VectorStr();
      args[7].forEach((voucher) => vouchersToFind.push_back(voucher));
      const vouchersToFindMaxAnte = args[8];

      const result = self.Immolate.findSeed(
        srandSeed,
        jokersToFindOneOf,
        jokerToFindNegative,
        jokerToFindAnkh,
        legendariesToFind,
        legendariesToFindNegatives,
        legendariesToFindMaxAnte,
        vouchersToFind,
        vouchersToFindMaxAnte
      );

      const legendariesPacksVec = result.legendariesPacks;
      const legendariesPacksArray = [];
      for (let i = 0; i < legendariesPacksVec.size(); i++) {
        legendariesPacksArray.push(legendariesPacksVec.get(i));
      }

      const voucherAntesVec = result.voucherAntes;
      const voucherAntesArray = [];
      for (let i = 0; i < voucherAntesVec.size(); i++) {
        voucherAntesArray.push(voucherAntesVec.get(i));
      }

      postMessage({
        task,
        result: {
          tries: result.tries,
          seed: result.seed,
          legendariesPacks: legendariesPacksArray,
          voucherAntes: voucherAntesArray,
          time: result.time,
        },
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
