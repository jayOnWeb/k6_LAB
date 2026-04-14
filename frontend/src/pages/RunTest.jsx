import { useState } from "react";
import { runTest } from "../services/testService";

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
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* Card */}
          <div className="p-4 bg-white shadow rounded">
            <p className="text-gray-500">Avg Response</p>
            <h3 className="text-xl font-bold">
              {result.avgResponseTime.toFixed(2)} ms
            </h3>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <p className="text-gray-500">Max Response</p>
            <h3 className="text-xl font-bold">{result.maxResponseTime} ms</h3>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <p className="text-gray-500">Failure Rate</p>
            <h3 className="text-xl font-bold">{result.failureRate}</h3>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <p className="text-gray-500">Health</p>
            <h3 className="text-xl font-bold">{result.healthStatus}</h3>
          </div>

          <div className="col-span-2 p-4 bg-gray-100 rounded">
            <p>
              <strong>URL:</strong> {result.url}
            </p>
            <p>
              <strong>Method:</strong> {result.method}
            </p>
            <p>
              <strong>VUs:</strong> {result.vus}
            </p>
            <p>
              <strong>Duration:</strong> {result.duration}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunTest;
