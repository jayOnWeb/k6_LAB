import useTests from "../hooks/useTests";

const History = () => {
  const { tests, loading, deleteTest } = useTests();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Test History</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">URL</th>
            <th className="border p-2">Method</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test) => (
            <tr key={test._id}>
              <td className="border p-2">{test.url}</td>
              <td className="border p-2">{test.method}</td>
              <td className="border p-2">{test.healthStatus}</td>

              <td className="border p-2">
                <button
                  onClick={() => deleteTest(test._id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;