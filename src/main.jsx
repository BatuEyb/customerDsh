import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Add_customer from './add_customer.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import CustomerList from "./CustomerList.jsx";
import Dashboard from "./Dashboard.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dashboard/>
  </StrictMode>,
)
