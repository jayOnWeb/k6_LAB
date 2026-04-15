import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const getResults = async () => {
  const response = await API.get("/test/results");
  return response.data;
};

export const runTest = async (data) => {
  const response = await API.post("/run-test", data);
  return response.data;
};