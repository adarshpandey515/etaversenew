"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Clock, Users, DollarSign, ChefHat, Eye, CheckCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getOrders, updateOrderStatus, removeOrder, getOrderStats, type Order } from "@/lib/order-storage"
import ModelPreview from "@/components/model-preview"
import { toast } from "@/hooks/use-toast"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    todayRevenue: 0,
  })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewModelItem, setViewModelItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadOrders = () => {
    const allOrders = getOrders()
    const orderStats = getOrderStats()
    setOrders(allOrders)
    setStats(orderStats)
  }

  const handleStatusUpdate = (orderId: string, status: Order["status"], estimatedTime?: number) => {
    updateOrderStatus(orderId, status, estimatedTime)
    loadOrders()

    const statusMessages:any = {
      preparing: "Order moved to preparing",
      ready: "Order marked as ready",
      completed: "Order completed",
    }

    toast({
      title: "Status Updated",
      description: statusMessages[status] || "Order status updated",
    })
  }

  const handleRemoveOrder = (orderId: string) => {
    removeOrder(orderId)
    loadOrders()
    toast({
      title: "Order Removed",
      description: "Order has been removed from the system",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "veg":
      case "vegan":
        return "bg-green-100 text-green-800 border-green-200"
      case "non-veg":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status === activeTab
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fff9c4] to-[#ffe0b2]">
      {/* Header */}
      <header className="backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 hover:bg-[#fff4d0]/40"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Menu</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Chef Dashboard</h1>
                <p className="text-sm text-gray-600">Order Management</p>
              </div>
            </div>
            <div className="w-[120px]"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              <p className="text-sm text-gray-600">Today's Orders</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <ChefHat className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
              <p className="text-sm text-gray-600">Preparing</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
              <p className="text-sm text-gray-600">Ready</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">₹{stats.todayRevenue}</p>
              <p className="text-sm text-gray-600">Today's Revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="preparing">Preparing</TabsTrigger>
                <TabsTrigger value="ready">Ready</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No orders found</p>
                    <p className="text-gray-400">Orders will appear here when customers place them</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-orange-400">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Order Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">Order #{order.id.split("-")[1]}</h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-gray-500">Table: {order.tableNo}</span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span>{formatTime(order.timestamp)}</span>
                                <span>•</span>
                                <span>{getTimeAgo(order.timestamp)}</span>
                                <span>•</span>
                                <span>{order.items.length} items</span>
                                <span>•</span>
                                <span className="font-semibold text-green-600">₹{order.totalAmount}</span>
                              </div>

                              {/* Items Preview */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                                    <Badge className={getTypeColor(item.type)} variant="outline">
                                      {item.type}
                                    </Badge>
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-sm text-gray-500">x{item.quantity}</span>
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <span className="text-sm text-gray-500 px-3 py-1">
                                    +{order.items.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Button>

                              {order.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, "preparing", 15)}
                                  className="bg-blue-500 hover:bg-blue-600"
                                >
                                  Start Preparing
                                </Button>
                              )}

                              {order.status === "preparing" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, "ready")}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Mark Ready
                                </Button>
                              )}

                              {order.status === "ready" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.id, "completed")}
                                  className="bg-gray-500 hover:bg-gray-600"
                                >
                                  Complete
                                </Button>
                              )}

                              {order.status === "completed" && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveOrder(order.id)}
                                  className="flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Order #{selectedOrder.id.split("-")[1]} Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Table Number</p>
                  <p className="font-semibold">{selectedOrder.tableNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Time</p>
                  <p className="font-semibold">{formatTime(selectedOrder.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-green-600">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                          <Button variant="ghost" size="sm" onClick={() => setViewModelItem(item)} className="p-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Badge className={getTypeColor(item.type)} variant="outline">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-sm text-gray-500">Category: {item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{item.price} x {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Taxes & Fees:</span>
                  <span>₹{selectedOrder.totalAmount - selectedOrder.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 3D Model Viewer Modal */}
      {viewModelItem && (
        <Dialog open={!!viewModelItem} onOpenChange={() => setViewModelItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewModelItem.name} - 3D Model</DialogTitle>
            </DialogHeader>
            <div className="h-96 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <ModelPreview modelUrl={viewModelItem.modelUrl} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
