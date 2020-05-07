const worker = new Worker("/lib/worker.js");

worker.onmessage = e => {
    const message = e.data;
    console.log(`[From Worker]: ${message}`);
};

worker.postMessage("Macro");