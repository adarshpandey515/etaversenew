"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import React, { useState } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  type: string
  category: string
}

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  totalPrice: number
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
}: CartModalProps) {
  const [tableNo, setTableNo] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handlePlaceOrder = () => {
    if (tableNo.trim() === "") {
      setError("Please provide a table number or write 'NA' if you don't know.");
      return;
    } else {
      setError(""); // Clear any previous error
    }

    toast({
      title: "Order Placed!",
      description: `Your order of ₹${totalPrice + Math.round(totalPrice * 0.1)} has been placed successfully. We'll prepare it shortly!`,
    });

    // Calculate total amount (including taxes)
    const totalAmount = totalPrice + Math.round(totalPrice * 0.1);

    // Create the UPI payment URL dynamically
    const upiUrl = `upi://pay?pa=pandeyadarsh515@oksbi&pn=AdarshPandey&cu=INR&am=${totalAmount}`;

    // Redirect to the UPI payment URL
    window.location.href = upiUrl;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "veg":
        return "bg-green-100 text-green-800 border-green-200"
      case "vegan":
        return "bg-green-100 text-green-800 border-green-200"
      case "non-veg":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-600" />
            Your Cart ({cartItems.length} items)
          </DialogTitle>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg sm:text-xl text-gray-500 mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm sm:text-base">Add some delicious items to get started!</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Cart Items */}
            <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{item.name}</h3>
                      <Badge className={`${getTypeColor(item.type)} text-xs`}>{item.type}</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{item.category}</p>
                    <p className="text-base sm:text-lg font-bold text-orange-600">₹{item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-semibold text-sm sm:text-lg w-6 sm:w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Table Number Input */}
            <div className="w-max-300px">
              <label htmlFor="tableNo" className="block text-sm font-medium text-gray-700 mb-2">
                Table No:
              </label>
              <input
                type="text"
                id="tableNo"
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your table number"
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 sm:pt-6">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 sm:p-6">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-base sm:text-lg font-semibold text-gray-800">Subtotal:</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-800">₹{totalPrice}</span>
                </div>

                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-sm text-gray-600">Taxes & Fees:</span>
                  <span className="text-sm text-gray-600">₹{Math.round(totalPrice * 0.1)}</span>
                </div>

                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <span className="text-lg sm:text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      ₹{totalPrice + Math.round(totalPrice * 0.1)}
                    </span>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 sm:py-3 text-sm sm:text-lg font-semibold"
                  >
                    Proceed for Payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
// Note: Ensure you have the necessary styles and components imported for this code to work correctly.