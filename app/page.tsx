"use client"

import { useEffect, useRef, useState } from "react"
import HomeSection from "@/components/home-section"
import RestaurantMenu from "@/components/restaurant-menu"
import ContactSection from "@/components/contact-section"
import CartModal from "@/components/cart-modal"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Upload, Menu, X, ChefHat, Bell } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { getOrders, type Order } from "@/lib/order-storage"

export default function HomePage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isMobile, setIsMobile] = useState(false)
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [lastNotifiedStatus, setLastNotifiedStatus] = useState<{ [key: string]: string }>({})

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
  const handleScroll = () => {
    const scrollPosition = window.scrollY
    const sectionElements = document.querySelectorAll("section[id]")
    sectionElements.forEach((section) => {
      const rect = section.getBoundingClientRect()
      const offsetTop = rect.top + window.scrollY
      const offsetBottom = offsetTop + section.clientHeight

      if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetBottom - 100) {
        // console.log("Currently in section:", section.id)
        setActiveSection(section.id || "home")

      }
    })
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [])

  // Check for order status updates
  useEffect(() => {
    const checkOrderUpdates = () => {
      const allOrders = getOrders()
        console.log("Running checkOrderUpdates", allOrders)
      const recentOrders = allOrders.filter((order) => {
        const orderTime = new Date(order.timestamp).getTime()
        const now = new Date().getTime()
        const timeDiff = now - orderTime
        // Check orders from last 2 hours
        return timeDiff < 2 * 60 * 60 * 1000
      })

      recentOrders.forEach((order) => {
        const lastStatus = lastNotifiedStatus[order.id]

        if (lastStatus !== order.status) {
          // Show notification for status change
          if (order.status === "preparing" && lastStatus !== "preparing") {
            console.log("got pre")
            toast({
              title: "🍳 Order Being Prepared!",
              description: `Order #${order.id.split("-")[1]} is now being prepared by our chef. Estimated time: 15-20 minutes.`,
            })
          } else if (order.status === "ready" && lastStatus !== "ready") {
            console.log("got ready")
            toast({
              title: "🎉 Order Ready!",
              description: `Order #${order.id.split("-")[1]} is ready for pickup! Please collect from the counter.`,
            })

            // Show browser notification if permission granted
            if (Notification.permission === "granted") {
              new Notification("Order Ready! 🎉", {
                body: `Order #${order.id.split("-")[1]} is ready for pickup!`,
                icon: "/logo.png",
              })
            }
          }

          // Update last notified status
          setLastNotifiedStatus((prev) => ({
            ...prev,
            [order.id]: order.status,
          }))
        }
      })

      setUserOrders(recentOrders)
    }

    // Check immediately
    checkOrderUpdates()

    // Check every 10 seconds
    const interval = setInterval(checkOrderUpdates, 10000)

    return () => clearInterval(interval)
  }, [lastNotifiedStatus])

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
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
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const isSectionActive = (section: string) => {
    return activeSection === section
  }

  // Clear cart after successful order
  const handleOrderSuccess = () => {
    setCartItems([])
    toast({
      title: "Cart Cleared",
      description: "Your cart has been cleared after successful order placement.",
    })
  }

  // Get active orders count for notification badge
  const getActiveOrdersCount = () => {
    
    return userOrders.filter((order) => order.status === "preparing" || order.status === "ready").length
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
className={`capitalize px-4 py-2 border-b-2 flex items-center transition-all duration-200 rounded-md text-black 
  ${activeSection === section ? "border-[#fccd3f] bg-[#fff4d0]/40" : "border-transparent hover:border-[#fccd3f] hover:bg-[#fff4d0]/40"}`}
                >
                  {section}
                </button>
              ))}

              <Button
                variant="outline"
                onClick={() => router.push("/upload")}
                className="flex items-center space-x-2 hover:bg-[#fef4ea]"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/orders")}
                className="flex items-center space-x-2 hover:bg-[#fef4ea]"
              >
                <ChefHat className="w-4 h-4" />
                <span>Orders</span>
              </Button>

              {/* Order Status Notification */}
              {getActiveOrdersCount() > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-orange-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getActiveOrdersCount()}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {getActiveOrdersCount() > 0 && (
                <div className="relative mr-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                    {getActiveOrdersCount()}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 mt-2 pt-4 space-y-2 bg-white">
              {["home", "menu", "contact"].map((section) => (
               <button
                  key={section}
                  onClick={() => scrollToSection(section)}
className={`capitalize px-4 py-2 border-b-2 flex items-center transition-all duration-200 rounded-md text-black 
  ${activeSection === section ? "border-[#fccd3f] bg-transparent" : "bg-transparent  hover:border-[#fccd3f] hover:bg-[#fff4d0]/40"}`}
                >
                  {section}
                </button>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/upload")
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-start space-x-2 border-[#fccd3f] hover:bg-[#fef4ea]"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/orders")
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-start space-x-2 border-[#fccd3f] hover:bg-[#fef4ea]"
              >
                <ChefHat className="w-4 h-4" />
                <span>Orders</span>
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
          className="relative w-14 h-14 rounded-full bg-[#fccd3f] text-black hover:bg-[#fcd65e] shadow-lg"
          onClick={() => setShowCart(true)}
        >
          <ShoppingCart className="w-6 h-6 text-black" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        totalPrice={getTotalPrice()}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  )
}
