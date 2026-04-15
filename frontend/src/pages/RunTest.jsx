import { useState } from "react";
import { runTest } from "../services/testService";
import { formatNumber } from "../utils/format";

const RunTest = () => {
  const [form, setForm] = useState({
    url: "",
    method: "GET",
    vus: 1,
    duration: "10s",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await runTest(form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error running test");
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status) => {
    if (!status) return "text-gray-400";
    const s = status.toLowerCase();
    if (s.includes("good") || s.includes("healthy") || s.includes("ok")) return "text-emerald-600 dark:text-emerald-400";
    if (s.includes("warn") || s.includes("degraded")) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getHealthBg = (status) => {
    if (!status) return "bg-gray-50 border-gray-200 dark:bg-gray-800/40 dark:border-gray-700";
    const s = status.toLowerCase();
    if (s.includes("good") || s.includes("healthy") || s.includes("ok"))
      return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800";
    if (s.includes("warn") || s.includes("degraded"))
      return "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800";
    return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
  };

  const MetricCard = ({ label, value, unit = "", accent = false }) => (
    <div
      className={`rounded-xl border p-3.5 flex flex-col gap-1.5 ${
        accent
          ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
          : "bg-gray-50 border-gray-200 dark:bg-gray-800/40 dark:border-gray-700"
      }`}
    >
      <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`text-xl font-semibold font-mono tracking-tight ${
          accent ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-gray-100"
        }`}
      >
        {value}
        <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-1">{unit}</span>
      </span>
    </div>
  );

  const StatRow = ({ label, value, highlight = false }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`text-xs font-mono font-medium ${
          highlight ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-none">
              Load test runner
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Configure and fire HTTP performance tests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* FORM PANEL */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sticky top-6">
              <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
                Test configuration
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Target URL
                  </label>
                  <input
                    name="url"
                    placeholder="https://api.example.com/endpoint"
                    value={form.url}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-mono"
                  />
                </div>

                {/* METHOD */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    HTTP method
                  </label>
                  <div className="flex gap-2">
                    {["GET", "POST"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setForm({ ...form, method: m })}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all border ${
                          form.method === m
                            ? m === "GET"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-700 dark:text-emerald-400"
                              : "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-400"
                            : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* VUs + DURATION */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Virtual users
                    </label>
                    <input
                      name="vus"
                      type="number"
                      value={form.vus}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Duration
                    </label>
                    <input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Running test…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" />
                      </svg>
                      Run test
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="lg:col-span-3 space-y-4">

            {!result && !loading && (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No results yet</p>
                <p className="text-xs text-gray-300 dark:text-gray-600">Configure your test and hit Run</p>
              </div>
            )}

            {loading && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Executing test…</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Sending requests to {form.url || "target"}
                  </p>
                </div>
              </div>
            )}

            {result && (
              <>
                {/* HEALTH BANNER */}
                <div className={`rounded-2xl border p-4 flex items-center justify-between ${getHealthBg(result.healthStatus)}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getHealthColor(result.healthStatus).replace("text-", "bg-")}`} />
                    <div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">Target</p>
                      <p className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200">{result.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">Status</p>
                    <p className={`text-sm font-semibold ${getHealthColor(result.healthStatus)}`}>{result.healthStatus}</p>
                  </div>
                </div>

                {/* RESPONSE TIME METRICS */}
                <div>
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Response times
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <MetricCard label="Avg" value={formatNumber(result.avgResponseTime)} unit="ms" accent />
                    <MetricCard label="P90" value={formatNumber(result.p90ResponseTime)} unit="ms" />
                    <MetricCard label="P95" value={formatNumber(result.p95ResponseTime)} unit="ms" />
                    <MetricCard label="Min" value={formatNumber(result.minResponseTime)} unit="ms" />
                    <MetricCard label="Max" value={formatNumber(result.maxResponseTime)} unit="ms" />
                  </div>
                </div>

                {/* REQUESTS + NETWORK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                      Requests
                    </p>
                    <StatRow label="Total" value={result.totalRequests} />
                    <StatRow label="Successful" value={result.successRequests} highlight />
                    <StatRow label="Failed" value={result.failedRequests} />
                    <StatRow label="Failure rate" value={`${formatNumber(result.failureRate)}%`} />
                  </div>

                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                      Network
                    </p>
                    <StatRow label="Data received" value={result.dataReceived} />
                    <StatRow label="Data sent" value={result.dataSent} />
                    <StatRow label="VUs" value={result.vus} />
                    <StatRow label="Duration" value={result.duration} />
                  </div>
                </div>

                {/* TIMINGS */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Connection timings
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3">
                    {[
                      { label: "Waiting",    value: result.waitingTime },
                      { label: "Sending",    value: result.sendingTime },
                      { label: "Receiving",  value: result.receivingTime },
                      { label: "Blocked",    value: result.blockedTime },
                      { label: "Connecting", value: result.connectingTime },
                      { label: "TLS",        value: result.tlsTime },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800/80 last:border-0 px-1"
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                        <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {formatNumber(value)} ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* META */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-mono">ID</span>
                    <span className="text-[11px] font-mono text-gray-600 dark:text-gray-400">{result._id}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    {result.createdAt ? new Date(result.createdAt).toLocaleString() : "—"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunTest;