import { useState } from "react";
import { runTest } from "../services/testService";

const RunTest = () => {
  const [formData, setFormData] = useState({
    url: "",
    method: "GET",
    vus: 1,
    duration: "10s",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await runTest(formData);
      console.log("Test Result:", result);
    } catch (error) {
      console.error("Error running test:", error);
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
          className="w-full bg-black text-white p-2 rounded"
        >
          Run Test
        </button>
      </form>
    </div>
  );
};

export default RunTest;
