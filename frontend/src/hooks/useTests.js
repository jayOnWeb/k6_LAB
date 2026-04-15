import { useState, useEffect } from "react";
import {
  getAllTests,
  runTest as runTestAPI,
  deleteTest as deleteTestAPI,
} from "../services/testService";

const useTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tests
  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await getAllTests();
      setTests(res.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run test
  const runTest = async (payload) => {
    try {
      setLoading(true);
      const result = await runTestAPI(payload);
      await fetchTests(); // refresh list
      return result;
    } catch (error) {
      console.error("Error running test:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete test
  const deleteTest = async (id) => {
    try {
      await deleteTestAPI(id);
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return {
    tests,
    loading,
    runTest,
    deleteTest,
    fetchTests,
  };
};

export default useTests;