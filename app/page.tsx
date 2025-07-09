"use client"

import { useEffect, useRef, useState } from "react"
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
  const [activeSection, setActiveSection] = useState("home")
  const [isMobile, setIsMobile] = useState(false)

  const sectionRefs = {
    home: useRef<HTMLElement | null>(null),
    menu: useRef<HTMLElement | null>(null),
    contact: useRef<HTMLElement | null>(null),
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current)
      })
    }
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setMobileMenuOpen(false)
    }
  }

  const addToCart = (item: any) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        const updated = prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
        toast({ title: "Item Updated", description: `${item.name} quantity increased in cart` })
        return updated
      }
      toast({ title: "Added to Cart", description: `${item.name} has been added to your cart` })
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
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const isSectionActive = (section: string) => {
    if (section === "home") {
      return isMobile ? activeSection === "home" : true
    }
    return activeSection === section
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fff9c4] to-[#ffe0b2] scroll-smooth">
      {/* Header */}
      <header className="backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-[200px] h-[50px] rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="backdrop-blur-md" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {["home", "menu", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize px-4 py-2 border-b-2 transition-all duration-200 ${
                    isSectionActive(section)
                      ? "border-[#fccd3f] text-[#d49900]"
                      : "border-transparent"
                  } hover:border-[#fccd3f] hover:bg-[#fff4d0]/40 rounded-md`}
                >
                  {section}
                </button>
              ))}

              <Button
                variant="outline"
                onClick={() => setShowUpload(true)}
                className="flex items-center space-x-2 hover:bg-[#fef4ea]"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 mt-2 pt-4 space-y-2">
              {["home", "menu", "contact"].map((section) => (
                <Button
                  key={section}
                  variant="ghost"
                  onClick={() => scrollToSection(section)}
                  className={`w-full capitalize justify-start ${
                    isSectionActive(section) ? "text-[#d49900] font-medium" : ""
                  }`}
                >
                  {section}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setShowUpload(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-start space-x-2 border-[#fccd3f] hover:bg-[#fef4ea]"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Sections */}
      <main className="relative z-10">
        <section id="home" ref={sectionRefs.home}>
          <HomeSection />
        </section>
        <section id="menu" ref={sectionRefs.menu}>
          <RestaurantMenu onAddToCart={addToCart} />
        </section>
        <section id="contact" ref={sectionRefs.contact}>
          <ContactSection />
        </section>
      </main>

      {/* Floating Cart Button with Spacing */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="default"
          className="relative bg-[#fccd3f] text-white hover:bg-[#fcd65e]"
          onClick={() => setShowCart(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </div>

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
