"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import apiClient, { API_BASE_URL } from "@/lib/api";

export default function ApiExplorerPage() {
  const [endpoints, setEndpoints] = useState<string[]>([]);
  const baseUrl: string = API_BASE_URL;
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/openapi.json")
      .then((r) => r.json())
      .then((spec) => {
        const paths = Object.keys(spec.paths || {});
        setEndpoints(paths);
      })
      .catch(() => setEndpoints([]));
  }, []);

  async function tryGet(path: string) {
    setLoading(true);
    setResult("");
    try {
      const res = await apiClient.get(path);
      setResult(JSON.stringify(res.data, null, 2));
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        const payload = e.response?.data ?? { message: e.message };
        setResult(JSON.stringify(payload, null, 2));
      } else {
        setResult(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">API Explorer</h1>
      <div className="text-sm text-gray-600">Base URL: {baseUrl}</div>
      <div className="space-y-2">
        <h2 className="font-semibold">Detected endpoints</h2>
        <ul className="max-h-64 overflow-auto border rounded p-2 space-y-1">
          {endpoints.map((e) => (
            <li key={e} className="flex items-center justify-between gap-2">
              <code className="text-xs bg-gray-100 rounded px-2 py-1">{e}</code>
              <button
                className="text-xs px-2 py-1 rounded bg-black text-white disabled:opacity-50"
                onClick={() => tryGet(e)}
                disabled={loading}
              >
                GET
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">Result</h2>
        <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-auto max-h-96 text-xs">
{result || (loading ? "Loading..." : "Click GET on any endpoint above.")}
        </pre>
      </div>
    </div>
  );
}
