import './App.css'
import AppRoutes from './routes/Index'
import './index.css'
import { setAuthToken } from './utils/setAuthToken'


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
