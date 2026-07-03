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
import ProfilePage from './pages/Profile/ProfilePage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import CartDrawer from './components/cart/CartDrawer'
import AdminPage from './pages/Admin/AdminPage'

function App() {

  return (
    <div>
      <Navbar />
      <CartDrawer />
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
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
      <Footer />
    </div>

    
  
  )
}

export default App
