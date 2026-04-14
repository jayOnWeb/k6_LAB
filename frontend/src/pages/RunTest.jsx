import { useState } from "react";
import { runTest } from "../services/testService";
import Card from "../components/Card";

const RunTest = () => {
  const [formData, setFormData] = useState({
    url: "",
    method: "GET",
    vus: 1,
    duration: "10s",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await runTest(formData);
      setResult(res.data); // 👈 important
    } catch (error) {
      console.error("Error running test:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Run Load Test</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="url"
          placeholder="Enter API URL"
          value={formData.url}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <input
          type="number"
          name="vus"
          placeholder="Virtual Users"
          value={formData.vus}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 10s, 1m)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Running Test..." : "Run Test"}
        </button>
      </form>
      {result && (
        <div className="mt-8 space-y-6">
          {/* 🔥 HEALTH STATUS */}
          <div className="p-4 rounded bg-black text-white">
            <h2 className="text-xl font-bold">
              Health Status: {result.healthStatus}
            </h2>
          </div>

          {/* 🔥 CORE METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card
              title="Avg Response"
              value={`${result.avgResponseTime.toFixed(2)} ms`}
            />
            <Card
              title="P95 Response"
              value={`${result.p95ResponseTime.toFixed(2)} ms`}
            />
            <Card title="Max Response" value={`${result.maxResponseTime} ms`} />
            <Card title="Min Response" value={`${result.minResponseTime} ms`} />
            <Card title="P90 Response" value={`${result.p90ResponseTime} ms`} />
            <Card title="Failure Rate" value={`${result.failureRate}%`} />
          </div>

          {/* 🔥 REQUEST STATS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card title="Total Requests" value={result.totalRequests} />
            <Card title="Success" value={result.successRequests} />
            <Card title="Failed" value={result.failedRequests} />
          </div>

          {/* 🔥 DATA TRANSFER */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <Card title="Data Received" value={result.dataReceived} />
            <Card title="Data Sent" value={result.dataSent} />
          </div>

          {/* 🔥 TIMINGS BREAKDOWN */}
          <div>
            <h3 className="text-lg font-bold mb-2">Timings Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card title="Waiting" value={result.waitingTime.toFixed(2)} />
              <Card title="Sending" value={result.sendingTime.toFixed(2)} />
              <Card title="Receiving" value={result.receivingTime.toFixed(2)} />
              <Card title="Blocked" value={result.blockedTime.toFixed(2)} />
              <Card
                title="Connecting"
                value={result.connectingTime.toFixed(2)}
              />
              <Card title="TLS" value={result.tlsTime.toFixed(2)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunTest;
