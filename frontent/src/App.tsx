import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Profile from './pages/Profile'
import RedirectPage from './pages/RedirectPage'
function App() {

  return (
    <Routes>
      <Route path='/' element={<HomePage />}/>
      <Route path='/profile' element={<Profile />}/>
      <Route path='/oauth2/idpresponse' element={<RedirectPage />}/>
    </Routes>
  )
}

export default App
