import api from "./api";

// Run Test
export const runTest = async (data) => {
  const response = await api.post("/run-test", data);
  return response.data;
};

// Get All Results
export const getAllTests = async () => {
  const response = await api.get("/test/results");
  return response.data;
};

// Get Single Test
export const getTestById = async (id) => {
  const response = await api.get(`/test/${id}`);
  return response.data;
};

// Delete Test
export const deleteTest = async (id) => {
  const response = await api.delete(`/test/${id}`);
  return response.data;
};