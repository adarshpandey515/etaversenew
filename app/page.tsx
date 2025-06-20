"use client"

import { useState } from "react"
import HomeSection from "@/components/home-section"
import RestaurantMenu from "@/components/restaurant-menu"
import ContactSection from "@/components/contact-section"
import UploadSection from "@/components/upload-section"
import CartModal from "@/components/cart-modal"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Upload, Menu, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function HomePage() {
  const [showUpload, setShowUpload] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const addToCart = (item: any) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        const updated = prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
        toast({
          title: "Item Updated",
          description: `${item.name} quantity increased in cart`,
        })
        return updated
      }
      toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart`,
      })
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef4ea] via-white to-[#fccd3f]">
      {/* Animated Fixed Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#fccd3f] to-[#fef4ea] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#fef4ea] to-[#fccd3f] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-br from-[#fccd3f] to-[#fef4ea] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-[200px] h-[50px] rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowUpload(true)}
                className="flex items-center space-x-2 border-[#fccd3f] hover:bg-[#fef4ea]"
              >
                <Upload className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                className="relative border-[#fccd3f] hover:bg-[#fef4ea]"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#fccd3f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(true)}
                className="relative border-[#fccd3f] hover:bg-[#fef4ea]"
              >
                <ShoppingCart className="w-4 h-4" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#fccd3f] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 mt-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUpload(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-center space-x-2 border-[#fccd3f] hover:bg-[#fef4ea]"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Home Section */}
        <HomeSection />

        {/* Menu Section */}
        <RestaurantMenu onAddToCart={addToCart} />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#fccd3f] to-[#fef4ea] bg-clip-text text-transparent">
                Upload 3D Models
              </h2>
              <Button variant="ghost" onClick={() => setShowUpload(false)} className="p-2">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 sm:p-6">
              <UploadSection />
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        totalPrice={getTotalPrice()}
      />
    </div>
  )
}