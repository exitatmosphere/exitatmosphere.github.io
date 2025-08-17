class Deferred {
  promise;
  resolve = () => {};
  reject = () => {};
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

function runTaskWithWorkers(task, args, numThreads) {
  const threads = numThreads || window.navigator.hardwareConcurrency;
  const workers = [];
  const dfd = new Deferred();

  for (let i = 0; i < threads; i++) {
    const newWorker = new Worker("worker.js");
    workers.push(newWorker);

    newWorker.onmessage = (msg) => {
      const msgData = msg.data;
      const msgTask = msgData.task;
      const msgResult = msgData.result;
      console.log(`Task: ${msgData.task}`);
      console.log(`Result:`);
      console.log(`-------------------------`);
      for (const resultEntry of Object.entries(msgResult)) {
        console.log(`${resultEntry[0]}: ${resultEntry[1]}`);
      }
      console.log(`-------------------------`);

      for (const worker of workers) {
        worker.terminate();
      }
      console.log("Terminated all workers");

      dfd.resolve();
    };
  }

  const timestampNow = Math.floor(Date.now() / 1000);
  for (let i = 0; i < workers.length; i++) {
    workers[i].postMessage({
      task,
      args: [timestampNow + i, ...args],
    });
  }

  return dfd.promise;
}
