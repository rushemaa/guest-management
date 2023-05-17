import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from './routes/Index'
import './index.css'
import { setAuthToken } from './utils/setAuthToken'
import { useNavigate } from 'react-router'


if (sessionStorage?.AUTH) {
  const { token } = JSON.parse(sessionStorage.AUTH);
  if (token) {
    setAuthToken(token);
  }
}

function App() {

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
