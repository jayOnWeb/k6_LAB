import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const runTest = async (data) => {
  const response = await API.post("/run-test", data);
  return response.data;
};