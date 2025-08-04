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

function runTaskWithWorkers(task) {
  const threads = window.navigator.hardwareConcurrency;
  const workers = [];
  const dfd = new Deferred();

  for (let i = 0; i < threads; i++) {
    const newWorker = new Worker("worker.js");
    workers.push(newWorker);

    newWorker.onmessage = (msg) => {
      const msgData = msg.data;
      console.log(`Task: ${msgData.task}\nResult: ${msgData.result}`);

      for (const worker of workers) {
        worker.terminate();
      }
      console.log("Terminated all workers");

      dfd.resolve();
    };
  }

  for (const worker of workers) {
    worker.postMessage({ task });
  }

  return dfd.promise;
}
