import React, { useState } from "react";
import "./App.css";

function StatusBadge({ status }) {
  const key = status.replace(/[^a-zA-Z]/g, "");

  const Icon = () => {
    if (key === "Loading") return (
      <svg className="spinner" viewBox="0 0 50 50" width="16" height="16" aria-hidden>
        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    );

    if (key === "Success") return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path fill="currentColor" d="M9.2 16.2L4.9 12l-1.4 1.4L9.2 19 21 7.2 19.6 5.8z" />
      </svg>
    );

    if (key === "Error") return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3 13.6L13.6 15 12 13.4 10.4 15 9 13.6 10.6 12 9 10.4 10.4 9 12 10.6 13.6 9 15 10.4 13.4 12 15 13.6z" />
      </svg>
    );

    // Idle
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    );
  };

  return (
    <div className={`status status-${key}`} title={status} aria-live="polite">
      <Icon />
      <span className="statusText">{status}</span>
    </div>
  );
}

function App() {
  const [status, setStatus] = useState("Idle");
  const [response, setResponse] = useState(null);
  const [count, setCount] = useState(0);

  const sendRequest = async () => {
    setCount(prev => prev + 1);
    setStatus("Loading...");
    setResponse(null);

    const start = Date.now();

    try {
      const res = await fetch("http://localhost:5000");
      const text = await res.text();
      const duration = Date.now() - start;

      let parsed;
      try { parsed = JSON.parse(text); } catch (_) { parsed = text; }

      setResponse({ body: parsed, status: res.status, duration });
      setStatus("Success");
    } catch (err) {
      const duration = Date.now() - start;
      setResponse({ body: err.message || "Unknown error", status: null, duration });
      setStatus("Error");
    }
  };

  const renderResponse = () => {
    if (!response) return <div className="placeholder">No response yet.</div>;

    return (
      <div className="responseGrid">
        <div className="responseMeta">
          <div><strong>HTTP:</strong> {response.status ?? "-"}</div>
          <div><strong>Latency:</strong> {response.duration} ms</div>
        </div>
        <pre className="responseText">{typeof response.body === 'string' ? response.body : JSON.stringify(response.body, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="app-root dark">
      <div className="card glass">
        <h1 className="title">CI/CD Network Dashboard</h1>

        <div className="grid">
          <div className="left">
            <div className="controls">
              <button className="primary" onClick={sendRequest} disabled={status === "Loading..."}>
                Send Request
              </button>
              <div className="meta">
                <StatusBadge status={status} />
                <div className="calls"><strong>Calls:</strong> {count}</div>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="response">
              <h2 className="responseTitle">API Response</h2>
              {status === "Loading..." ? <div className="loadingRow"><div className="spinnerLarge" aria-hidden></div><div className="loadingText">Loading…</div></div> : renderResponse()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;