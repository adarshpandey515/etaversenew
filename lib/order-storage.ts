// Order management utilities
export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  type: string
  category: string
  modelUrl: string
  description: string
}

export interface Order {
  id: string
  tableNo: string
  items: OrderItem[]
  totalPrice: number
  totalAmount: number
  status: "pending" | "preparing" | "ready" | "completed"
  timestamp: Date
  estimatedTime?: number
  customerNotified?: boolean
}

// Get all orders from localStorage
export function getOrders(): Order[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const stored = localStorage.getItem("orders")
    if (stored) {
      const orders = JSON.parse(stored)
      // Convert timestamp strings back to Date objects
      return orders.map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp),
      }))
    }
    return []
  } catch (error) {
    console.error("Error loading orders:", error)
    return []
  }
}

// Add a new order
export function addOrder(order: Omit<Order, "id" | "timestamp">): string {
  if (typeof window === "undefined") {
    return ""
  }

  try {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newOrder: Order = {
      ...order,
      id: orderId,
      timestamp: new Date(),
      status: "pending",
      customerNotified: false,
    }

    const currentOrders = getOrders()
    const updatedOrders = [newOrder, ...currentOrders]
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Trigger storage event for real-time updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "orders",
        newValue: JSON.stringify(updatedOrders),
      }),
    )

    return orderId
  } catch (error) {
    console.error("Error saving order:", error)
    return ""
  }
}

// Update order status
export function updateOrderStatus(orderId: string, status: Order["status"], estimatedTime?: number) {
  if (typeof window === "undefined") {
    return
  }

  try {
    const orders = getOrders()
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status,
            ...(estimatedTime && { estimatedTime }),
            customerNotified: false, // Reset notification flag when status changes
          }
        : order,
    )
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Trigger storage event for real-time updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "orders",
        newValue: JSON.stringify(updatedOrders),
      }),
    )
  } catch (error) {
    console.error("Error updating order status:", error)
  }
}

// Mark order as notified
export function markOrderAsNotified(orderId: string) {
  if (typeof window === "undefined") {
    return
  }

  try {
    const orders = getOrders()
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, customerNotified: true } : order))
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  } catch (error) {
    console.error("Error marking order as notified:", error)
  }
}

// Remove completed order
export function removeOrder(orderId: string) {
  if (typeof window === "undefined") {
    return
  }

  try {
    const orders = getOrders()
    const updatedOrders = orders.filter((order) => order.id !== orderId)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Trigger storage event for real-time updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "orders",
        newValue: JSON.stringify(updatedOrders),
      }),
    )
  } catch (error) {
    console.error("Error removing order:", error)
  }
}

// Get order statistics
export function getOrderStats() {
  const orders = getOrders()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = orders.filter((order) => order.timestamp >= today)

  return {
    total: orders.length,
    today: todayOrders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    ready: orders.filter((order) => order.status === "ready").length,
    todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
  }
}

// Get user's recent orders (for notifications)
export function getUserRecentOrders(hoursBack = 2): Order[] {
  const orders = getOrders()
  const cutoffTime = new Date()
  cutoffTime.setHours(cutoffTime.getHours() - hoursBack)

  return orders.filter((order) => order.timestamp >= cutoffTime)
}
