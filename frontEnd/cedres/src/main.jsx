import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";


const panel = ReactDOM.createRoot(document.getElementById('root'))
const client = new QueryClient();

panel.render(
  <React.StrictMode>
      <QueryClientProvider client={client}>
          <BrowserRouter>
              <App />
              <ReactQueryDevtools initialIsOpen={false}/>
          </BrowserRouter>
      </QueryClientProvider>
  </React.StrictMode>,
)
