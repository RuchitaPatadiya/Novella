import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="406149259822-ro7n6nfnjd0k6bopqdthf1m4pbokjkfj.apps.googleusercontent.com">
        <AuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
