import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Sell from './Pages/Sell.jsx'
import Home from './Pages/Home.jsx'
import Layout from './Layout.jsx'
import ContextProvider from './Context/ContextProvider.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<Layout />}>
      <Route path = "" element = {<Home />} />
      <Route path = "list_nfts" element = {<Sell />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <React.StrictMode>
      <RouterProvider router= {router}/>
    </React.StrictMode>,
  </ContextProvider>
)
