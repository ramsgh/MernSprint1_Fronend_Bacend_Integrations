import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function App() {
  const [apiKey, setApiKey] = useState('secret123')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(null)

  async function callApi(endpoint, protectedRoute = false) {
    setLoading(endpoint)
    setResult(null)

    try {
      const response = await fetch(endpoint, {
        headers: protectedRoute ? { 'x-api-key': apiKey } : {},
      })
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({
        status: 'Network',
        data: { success: false, message: error.message },
      })
    } finally {
      setLoading(null)
    }
  }

  const isSuccess = result?.status >= 200 && result?.status < 300

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <div className="eyebrow"><span /> Express.js middleware lab</div>
          <h1>Request pipeline<br /><em>playground.</em></h1>
          <p>Send requests through a real Express middleware chain and inspect every response.</p>
        </div>
        <div className="pipeline" aria-label="Middleware pipeline">
          <span>Request</span><i>→</i><span>CORS</span><i>→</i><span>Logger</span><i>→</i><span>Route</span>
        </div>
      </section>

      <section className="workspace">
        <div className="request-panel">
          <div className="panel-heading">
            <div><span className="step">01</span><h2>Send a request</h2></div>
            <span className="live"><b /> Server live</span>
          </div>

          <button
            className="api-card"
            onClick={() => callApi('/api/public')}
            disabled={loading === '/api/public'}
          >
            <div className="api-meta"><span className="method get">GET</span><code>/api/public</code></div>
            <div><strong>Public route</strong><small>No authentication required</small></div>
            <span className="arrow">↗</span>
          </button>

          <div className="key-field">
            <label htmlFor="api-key">API key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </div>

          <button
            className="api-card"
            onClick={() => callApi('/api/protected', true)}
            disabled={loading === '/api/protected'}
          >
            <div className="api-meta"><span className="method get">GET</span><code>/api/protected</code></div>
            <div><strong>Protected route</strong><small>Sends <code>x-api-key</code> header</small></div>
            <span className="arrow">↗</span>
          </button>

          <button
            className="api-card danger-card"
            onClick={() => callApi('/api/error-test')}
            disabled={loading === '/api/error-test'}
          >
            <div className="api-meta"><span className="method get">GET</span><code>/api/error-test</code></div>
            <div><strong>Error handler</strong><small>Trigger global error middleware</small></div>
            <span className="arrow">↗</span>
          </button>
        </div>

        <div className="response-panel">
          <div className="panel-heading">
            <div><span className="step">02</span><h2>Inspect response</h2></div>
            {result && <span className={isSuccess ? 'status success' : 'status error'}>{result.status}</span>}
          </div>
          <div className="response-box">
            {loading ? (
              <div className="empty"><div className="spinner" /><p>Waiting for server…</p></div>
            ) : result ? (
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            ) : (
              <div className="empty"><div className="brackets">{'{ }'}</div><p>Select an endpoint to begin</p></div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
