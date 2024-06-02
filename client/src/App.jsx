import { useContext, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from "@/components/theme-provider.jsx"
import { LoginForm } from './components/LoginForm'
import { SignupForm } from './components/SignupForm'
import { AuthContext, AuthContextProvider, useAuth } from './components/AuthContext'
// import Dashboard from './components/Dashboard'
import Dashboard from './components/dashboard/page'
import Callback from './components/Callback'
import AuthenticationPage from './components/authentication/page'

// const Home = () => {  
//   const { loggedIn } = useContext(AuthContext)  
//   if (loggedIn === true) return <Dashboard AuthContext={AuthContext} />
//   if (loggedIn === false) return <LoginForm />
//   return <></>
// }
function App() {
  // const [count, setCount] = useState(0)
  // const {loggedIn, checkLoginState, user} = useContext(AuthContext);
  return (
    <>
      <AuthContextProvider >
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className=''>
            <Router>
              <Routes>
                <Route path="/auth/google/callback" element={<Callback />} />
                {/* <Route path="/" element={<Dashboard />} /> */}
                <Route path="/" element={ <ProtectedRoute element={<Dashboard/>}/>} />
                {/* <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} /> */}
                <Route path="/login" element={<AuthenticationPage type={'login'} />} />
                <Route path="/signup" element={<AuthenticationPage type={'signup'} />} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/contact" element={<h1>Contact</h1>} />
              </Routes>
            </Router>
          </div>
        </ThemeProvider>
      </AuthContextProvider>
    </>
  )
}

const ProtectedRoute = ({ element }) => {
  const { loggedIn } = useAuth()
  return loggedIn ? element : <Navigate to="/login" />
  
}

export default App
