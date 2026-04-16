import { useState } from 'react'
import './App.css'

const BACKEND_URL = 'http://localhost:3000/enviar'

function App() {
  const [tipo, setTipo] = useState('urgente')
  const [canal, setCanal] = useState('sms')
  const [destino, setDestino] = useState('+573135653795')
  const [mensaje, setMensaje] = useState('Notificacion de Prueba APP')
  const [estado, setEstado] = useState(null)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleEnviar = async (event) => {
    event.preventDefault()
    setEstado(null)
    setError(null)
    setCargando(true)

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, canal, destino, mensaje })
      })

      const text = await response.text()
      let data = null

      try {
        data = JSON.parse(text)
      } catch {
        data = null
      }

      if (!response.ok) {
        if (data && data.error) {
          setError(data.error)
        } else {
          setError(text || 'Error al enviar la notificación')
        }
      } else {
        if (data && data.resultado) {
          setEstado(data.resultado)
        } else {
          setEstado('Notificación enviada correctamente')
        }
      }
    } catch (err) {
      setError('No se pudo conectar con el backend. Revisa que esté corriendo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Bridge Pattern Demo</p>
          <h1>Enviar notificación</h1>
          <p className="subtitle">
            Elige tipo, canal y destino. Este formulario se conecta con el backend
            para enviar la solicitud a <code>/enviar</code>.
          </p>
        </div>
        <div className="status-chip">
          <span className={cargando ? 'pulse' : ''} />
          {cargando ? 'Enviando...' : 'Listo para enviar'}
        </div>
      </header>

      <main className="card-grid">
        <section className="card form-card">
          <h2>Configurar notificación</h2>
          <form onSubmit={handleEnviar}>
            <div className="field-group">
              <label>Tipo</label>
              <div className="button-group">
                <button
                  type="button"
                  className={tipo === 'basica' ? 'active' : ''}
                  onClick={() => setTipo('basica')}
                >
                  Básica
                </button>
                <button
                  type="button"
                  className={tipo === 'urgente' ? 'active' : ''}
                  onClick={() => setTipo('urgente')}
                >
                  Urgente
                </button>
              </div>
            </div>

            <div className="field-group">
              <label>Canal</label>
              <div className="button-group">
                <button
                  type="button"
                  className={canal === 'email' ? 'active' : ''}
                  onClick={() => setCanal('email')}
                >
                  Email
                </button>
                <button
                  type="button"
                  className={canal === 'sms' ? 'active' : ''}
                  onClick={() => setCanal('sms')}
                >
                  SMS
                </button>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="destino">Destino</label>
              <input
                id="destino"
                type="text"
                value={destino}
                onChange={(event) => setDestino(event.target.value)}
                placeholder="+573135653795"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                value={mensaje}
                onChange={(event) => setMensaje(event.target.value)}
                rows="5"
                placeholder="Escribe el mensaje de notificación"
                required
              />
            </div>

            <button className="submit-button" type="submit" disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar notificación'}
            </button>
          </form>

          {estado && <div className="alert success">{estado}</div>}
          {error && <div className="alert error">{error}</div>}
        </section>

        <section className="card preview-card">
          <h2>Resumen</h2>
          <div className="summary-item">
            <span>Tipo:</span>
            <strong>{tipo}</strong>
          </div>
          <div className="summary-item">
            <span>Canal:</span>
            <strong>{canal}</strong>
          </div>
          <div className="summary-item">
            <span>Destino:</span>
            <strong>{destino}</strong>
          </div>
          <div className="summary-item message-preview">
            <span>Mensaje:</span>
            <p>{mensaje}</p>
          </div>
          <div className="code-sample">
            <pre>{JSON.stringify({ tipo, canal, destino, mensaje }, null, 2)}</pre>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
