import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlowProvider } from '@xyflow/react'
import 'blue-ether/tokens.css'
import './index.css'
import App from './App'

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </StrictMode>,
  )
}
