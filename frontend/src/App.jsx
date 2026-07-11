import { useState } from 'react'
import { Routes } from 'react-router-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home/Home'
import ShopPage from './pages/Shop/ShopPage'
import ShopCategoryPage from './pages/ShopCategory/ShopCategoryPage'
import SpacePage from './pages/Space/SpacePage'
import SpaceDetailPage from './pages/Space/SpaceDetailPage'
import CollectionPage from './pages/Collection/CollectionPage'
import CollectionDetailPage from './pages/Collection/CollectionDetailPage'
import AboutPage from './pages/About/AboutPage'
import ContactPage from './pages/Contact/ContactPage'
import ProductDetailPage from './pages/Product/ProductDetailPage'
import WishlistPage from './pages/Wishlist/WishlistPage'
import CartPage from './pages/Cart/CartPage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage'
import ProfilePage from './pages/Profile/ProfilePage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccess/OrderSuccessPage'
import OrderDetailPage from './pages/Order/OrderDetailPage'
import CartDrawer from './components/cart/CartDrawer'
import AdminPage from './pages/Admin/AdminPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import GlobalAIAssistant from './components/shop/GlobalAIAssistant'

function App() {
  return (
    <Routes>
      {/* Fullscreen Admin Route (No Navbar or Footer) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Main consumer application layout wrapper */}
      <Route
        path="/*"
        element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <CartDrawer />
            <GlobalAIAssistant />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:categoryId" element={<ShopCategoryPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/spaces" element={<SpacePage />} />
                <Route path="/spaces/:spaceId" element={<SpaceDetailPage />} />
                <Route path="/collections" element={<CollectionPage />} />
                <Route path="/collections/:collectionId" element={<CollectionDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderSuccessPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>

    
  
  )
}

export default App
