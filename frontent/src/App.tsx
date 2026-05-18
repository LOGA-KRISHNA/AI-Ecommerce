import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Profile from './pages/Profile'
import RedirectPage from './pages/RedirectPage'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toast '
import { store } from './store'
import { Provider } from 'react-redux'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/products/:id' element={<ProductDetail />}/>
          <Route path='/oauth2/idpresponse' element={<RedirectPage />}/>
          
          <Route element={ <ProtectedRoute/> }>
            <Route path='/profile' element={<Profile />}/>
            <Route path='/cart' element={<CartPage />}/>
            <Route path='/orders' element={<OrdersPage />}/>
          </Route>
        </Routes>
        
        <Toast/>
      </BrowserRouter>
    </Provider>
  )
}

export default App
