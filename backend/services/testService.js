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

    const k6 = spawn("k6", ["run", scriptPath, "--summary-export", resultPath]);

    k6.on("close", () => {
      try {
        const rawData = fs.readFileSync(resultPath, "utf-8");
        const parsed = JSON.parse(rawData);
        const metrics = parsed.metrics;

        const durationMetrics =
          metrics["http_req_duration"] ||
          metrics["http_req_duration{expected_response:true}"];

        const values = durationMetrics || {};

        // 🔥 CORE METRICS
        const avgResponseTime = values.avg || 0;
        const maxResponseTime = values.max || 0;
        const minResponseTime = values.min || 0;
        const p90ResponseTime = values["p(90)"] || 0;
        const p95ResponseTime = values["p(95)"] || 0;

        // 🔥 REQUEST INFO
        const totalRequests = metrics.http_reqs?.count || 0;

        const failedRequests = metrics.http_req_failed?.fails || 0;
        const successRequests = totalRequests - failedRequests;

        const failureRate =
          totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;

        // 🔥 DATA TRANSFER
        const dataReceived = metrics.data_received?.count || 0;
        const dataSent = metrics.data_sent?.count || 0;

        // 🔥 TIMINGS BREAKDOWN
        const waitingTime = metrics.http_req_waiting?.avg || 0;
        const sendingTime = metrics.http_req_sending?.avg || 0;
        const receivingTime = metrics.http_req_receiving?.avg || 0;
        const blockedTime = metrics.http_req_blocked?.avg || 0;
        const connectingTime = metrics.http_req_connecting?.avg || 0;
        const tlsTime = metrics.http_req_tls_handshaking?.avg || 0;

        // 🔥 HEALTH
        const healthStatus = getHealthStatus({
          avgResponseTime,
          failureRate,
        });

        resolve({
          avgResponseTime,
          maxResponseTime,
          minResponseTime,
          p90ResponseTime,
          p95ResponseTime,

          totalRequests,
          successRequests,
          failedRequests,
          failureRate,

          dataReceived,
          dataSent,

          waitingTime,
          sendingTime,
          receivingTime,
          blockedTime,
          connectingTime,
          tlsTime,

          healthStatus,
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
  runTestService,
};
