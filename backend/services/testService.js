const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { getHealthStatus } = require("../utils/healthChecker");

const runTestService = (data) => {
  return new Promise((resolve, reject) => {
    const { url, method, vus, duration } = data;

    const timestamp = Date.now();

    const scriptName = `test-${timestamp}.js`;
    const resultName = `result-${timestamp}.json`;

    const scriptPath = path.join(__dirname, "../temp", scriptName);
    const resultPath = path.join(__dirname, "../results", resultName);

    const script = `
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: ${vus},
  duration: '${duration}',
};

export default function () {
  http.${method.toLowerCase()}('${url}');
  sleep(1);
}
`;

    fs.writeFileSync(scriptPath, script);

    const k6 = spawn("k6", [
      "run",
      scriptPath,
      "--summary-export",
      resultPath
    ]);

    k6.on("close", (code) => {
      try {
        const rawData = fs.readFileSync(resultPath, "utf-8");
        const parsed = JSON.parse(rawData);

        const metrics = parsed.metrics;

        const httpDuration =
          metrics["http_req_duration"] ||
          metrics["http_req_duration{expected_response:true}"];

        const avgResponseTime = httpDuration?.avg || 0;
        const maxResponseTime = httpDuration?.max || 0;

        const failureRate = metrics["http_req_failed"]?.rate || 0;

        // 🔥 ADD THIS
        const healthStatus = getHealthStatus({
          avgResponseTime,
          failureRate
        });

        resolve({
          avgResponseTime,
          maxResponseTime,
          failureRate,
          healthStatus
        });

      } catch (err) {
        reject("Error parsing results");
      }
    });

    k6.stderr.on("data", (data) => {
      console.error(`k6 error: ${data}`);
    });
  });
};

module.exports = {
  runTestService
};