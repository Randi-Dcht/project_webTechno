import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const panel = ReactDOM.createRoot(document.getElementById('root'))
const client = new QueryClient();

panel.render(
  <React.StrictMode>
      <QueryClientProvider client={client}>
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </QueryClientProvider>
  </React.StrictMode>,
)
