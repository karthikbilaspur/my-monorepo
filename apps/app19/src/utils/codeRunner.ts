// Runs JS code in a Web Worker for safety
export function runJavaScript(code: string, input: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const workerCode = `
      self.onmessage = function(e) {
        const { code, input } = e.data;
        try {
          const fn = new Function('return ' + code)();
          const start = performance.now();
          const result = fn(...input);
          const runtime = performance.now() - start;
          self.postMessage({ success: true, result, runtime });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      }
    `
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const worker = new Worker(URL.createObjectURL(blob))

    const timeout = setTimeout(() => {
      worker.terminate()
      reject(new Error('Time Limit Exceeded'))
    }, 3000)

    worker.onmessage = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      if (e.data.success) {
        resolve(e.data)
      } else {
        reject(new Error(e.data.error))
      }
    }

    worker.postMessage({ code, input })
  })
}