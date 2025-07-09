"use client"

import { useEffect, useRef, useState } from "react"
import HomeSection from "@/components/home-section"
import RestaurantMenu from "@/components/restaurant-menu"
import ContactSection from "@/components/contact-section"
import CartModal from "@/components/cart-modal"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Upload, Menu, X, ChefHat, Bell, Clock, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getOrders, type Order } from "@/lib/order-storage"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning'
  timestamp: number
  orderId: string
  read: boolean
}

export default function HomePage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isMobile, setIsMobile] = useState(false)
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [lastNotifiedStatus, setLastNotifiedStatus] = useState<{ [key: string]: string }>({})
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  const sectionRefs = {
    home: useRef<HTMLElement | null>(null),
    menu: useRef<HTMLElement | null>(null),
    contact: useRef<HTMLElement | null>(null),
  }

  const notificationModalRef = useRef<HTMLDivElement>(null)

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
          setActiveSection(section.id || "home")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Click outside to close notification modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationModalRef.current && !notificationModalRef.current.contains(event.target as Node)) {
        setShowNotificationModal(false)
      }
    }

    if (showNotificationModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotificationModal])

  // Enhanced notification system
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${notification.orderId}-${Date.now()}`,
      timestamp: Date.now(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep only last 50 notifications
    
    // Show browser notification if permission granted
    if (Notification.permission === "granted") {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/logo.png",
        tag: notification.orderId, // Prevent duplicate notifications
      })
      
      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    }
    
    return newNotification
  }

  // Check for order status updates
  useEffect(() => {
    const checkOrderUpdates = () => {
      const allOrders = getOrders()
      const recentOrders = allOrders.filter((order) => {
        const orderTime = new Date(order.timestamp).getTime()
        const now = new Date().getTime()
        const timeDiff = now - orderTime
        return timeDiff < 2 * 60 * 60 * 1000 // Last 2 hours
      })

      recentOrders.forEach((order) => {
        const lastStatus = lastNotifiedStatus[order.id]

        if (lastStatus !== order.status) {
          if (order.status === "preparing" && lastStatus !== "preparing") {
            addNotification({
              title: "Order Being Prepared",
              message: `Order #${order.id.split("-")[1]} is now being prepared by our chef. Estimated time: 15-20 minutes.`,
              type: 'info',
              orderId: order.id
            })

          } else if (order.status === "ready" && lastStatus !== "ready") {
            addNotification({
              title: "Order Ready for Pickup",
              message: `Order #${order.id.split("-")[1]} is ready for pickup! Please collect from the counter.`,
              type: 'success',
              orderId: order.id
            })
          }

          setLastNotifiedStatus(prev => ({
            ...prev,
            [order.id]: order.status,
          }))
        }
      })

      setUserOrders(recentOrders)
    }

    checkOrderUpdates()
    const interval = setInterval(checkOrderUpdates, 15000) // Check every 15 seconds
    return () => clearInterval(interval)
  }, [lastNotifiedStatus])

  // Request notification permission
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
        return updated
      }
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

  const handleOrderSuccess = () => {
    setCartItems([])
  }

  const getActiveOrdersCount = () => {
    return userOrders.filter((order) => order.status === "preparing" || order.status === "ready").length
  }

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info': return <Clock className="w-5 h-5 text-blue-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const handleNotificationClick = () => {
    setShowNotificationModal(true)
    // Mark all notifications as read when opening modal
    markAllNotificationsAsRead()
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

              {/* Notification Bell - Click to open modal */}
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 hover:bg-[#fef4ea] rounded-full transition-colors"
                >
                  <Bell className="w-6 h-6 text-orange-600" />
                  {getUnreadNotificationsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {getUnreadNotificationsCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Notification Bell */}
              <button
                onClick={handleNotificationClick}
                className="relative p-2"
              >
                <Bell className="w-5 h-5 text-orange-600" />
                {getUnreadNotificationsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                    {getUnreadNotificationsCount()}
                  </span>
                )}
              </button>

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
                    ${activeSection === section ? "border-[#fccd3f] bg-transparent" : "bg-transparent hover:border-[#fccd3f] hover:bg-[#fff4d0]/40"}`}
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

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={notificationModalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No notifications yet</p>
                  <p className="text-sm">Order updates will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600 p-1 ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  {notifications.length > 0 
                    ? `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`
                    : 'No notifications'
                  }
                </span>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Floating Cart Button */}
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