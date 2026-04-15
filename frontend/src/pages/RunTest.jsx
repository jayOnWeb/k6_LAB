import { useState } from "react";
import { runTest } from "../services/testService";
import { getResults } from "../services/testService";
import Card from "../components/Card";
import { useEffect } from "react";

const RunTest = () => {
  const [formData, setFormData] = useState({
    url: "",
    method: "GET",
    vus: 1,
    duration: "10s",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await getResults();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const getHealthColor = (status) => {
    if (status.includes("Healthy")) return "bg-green-500";
    if (status.includes("Slow")) return "bg-yellow-500";
    if (status.includes("Unstable")) return "bg-orange-500";
    if (status.includes("Critical")) return "bg-red-500";
    return "bg-gray-500";
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
          <div
            className={`p-4 rounded text-white ${getHealthColor(result.healthStatus)}`}
          >
            <h2 className="text-xl font-bold">{result.healthStatus}</h2>
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
      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Test History</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">URL</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Avg</th>
                  <th className="p-2">P95</th>
                  <th className="p-2">Fail %</th>
                  <th className="p-2">Health</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item._id} className="text-center border-t">
                    <td className="p-2 truncate max-w-[150px]">{item.url}</td>
                    <td className="p-2">{item.method}</td>
                    <td className="p-2">{item.avgResponseTime?.toFixed(1)}</td>
                    <td className="p-2">{item.p95ResponseTime?.toFixed(1)}</td>
                    <td className="p-2">{item.failureRate?.toFixed(1)}%</td>
                    <td className="p-2">{item.healthStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunTest;
