"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Leaf, Drumstick, Star, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import FoodItem3D from "@/components/food-item-3d"
import { getMenuItems } from "@/lib/menu-storage"

interface RestaurantMenuProps {
  onAddToCart: (item: any) => void
}

export default function RestaurantMenu({ onAddToCart }: RestaurantMenuProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [overflowingCategories, setOverflowingCategories] = useState<{ [key: string]: boolean }>({})

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    setMenuItems(getMenuItems().slice(1))
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((item) => item.category)))
    return cats
  }, [menuItems])

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ingredients.some((ing: string) => ing.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = selectedType === "all" || item.type === selectedType
      return matchesSearch && matchesType
    })
  }, [searchTerm, selectedType, menuItems])

  const getItemsByCategory = (category: string) => {
    return filteredItems.filter((item) => item.category === category)
  }

  const scrollCategory = (category: string, direction: "left" | "right") => {
    const container = scrollRefs.current[category]
    if (!container) return

    const itemWidth = 320 // Width of one item (w-80 = 320px) plus gap
    const scrollAmount = itemWidth+10 // Adding gap space
    const newScroll =
      direction === "left" ? Math.max(0, container.scrollLeft - scrollAmount) : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScroll,
      behavior: "smooth",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "veg":
      case "vegan":
        return <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
      case "non-veg":
        return <Drumstick className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
      default:
        return null
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

  useEffect(() => {
  const checkOverflow = () => {
    const updated: { [key: string]: boolean } = {}

    categories.forEach((category) => {
      const container = scrollRefs.current[category]
      if (container) {
        updated[category] = container.scrollWidth > container.clientWidth
      }
    })

    setOverflowingCategories(updated)
  }

  checkOverflow()

  window.addEventListener("resize", checkOverflow)
  return () => window.removeEventListener("resize", checkOverflow)
}, [categories])


  return (
    <div  className="relative py-2 sm:py-4 lg:py-4 bg-transparent">
      {/* Animated BG */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#fbdc7c] to-[#ffffff] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#e8dc6f] to-[#edf095] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-br from-[#fcdbb1b1] to-[#efb661a7] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {/* End Animated BG */}

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 space-y-6 sm:space-y-8 lg:space-y-2">
        {/* Search and Filters */}
        <h1 className="text-center text-gray-700 text-4xl mb-10">Our 3d Menu </h1>

        <div className="bg-transparent rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mx-2 sm:mx-0">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 outeline-none ring-0" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base focus:outline-none focus:ring-0"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                size="sm"
                className={selectedType === "all" ? "bg-[#fbb63d] text-xs sm:text-sm" : "text-xs sm:text-sm"}
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                All
              </Button>
              <Button
                variant={selectedType === "veg" ? "default" : "outline"}
                onClick={() => setSelectedType("veg")}
                size="sm"
                className={
                  selectedType === "veg"
                    ? "bg-green-500 hover:bg-green-600 text-xs sm:text-sm"
                    : "text-green-600 border-green-200 hover:bg-green-50 text-xs sm:text-sm"
                }
              >
                <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Veg
              </Button>
              <Button
                variant={selectedType === "non-veg" ? "default" : "outline"}
                onClick={() => setSelectedType("non-veg")}
                size="sm"
                className={
                  selectedType === "non-veg"
                    ? "bg-red-500 hover:bg-red-600 text-xs sm:text-sm"
                    : "text-red-600 border-red-200 hover:bg-red-50 text-xs sm:text-sm"
                }
              >
                <Drumstick className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Non-Veg
              </Button>
              <Button
                variant={selectedType === "vegan" ? "default" : "outline"}
                onClick={() => setSelectedType("vegan")}
                size="sm"
                className={
                  selectedType === "vegan"
                    ? "bg-green-500 hover:bg-green-600 text-xs sm:text-sm"
                    : "text-green-600 border-green-200 hover:bg-green-50 text-xs sm:text-sm"
                }
              >
                <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Vegan
              </Button>
            </div>
          </div>
        </div>

        {/* Category Sections */}
        {categories.map((category) => {
          const categoryItems = getItemsByCategory(category)
          if (categoryItems.length === 0) return null

          return (
            <div key={category} className="space-y-3 sm:space-y-4 lg:space-y-6 mb-4">
              {/* Category Header */}
              <div className="flex items-center justify-between px-2 sm:px-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{category}</h3>
              </div>

              {/* Scrollable Items Container with Side Navigation */}
              <div className="relative group">
                {/* Left Navigation Arrow */}
                {overflowingCategories[category] && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => scrollCategory(category, "left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 rounded-full bg-white/50  border-gray-200 shadow-lg "
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </Button>
                )}
                {/* Right Navigation Arrow */}
                {overflowingCategories[category] && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => scrollCategory(category, "right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 rounded-full bg-white/50 hover:bg-white border-gray-200 shadow-lg "
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </Button>
                )}
                {/* Scrollable Container */}
                <div
  ref={(el) => {
    scrollRefs.current[category] = el
  }}
  className="overflow-x-auto pb-4 scrollbar-hide"
>
  <div
    className="flex space-x-3 sm:space-x-4 lg:space-x-6 px-2 scroll-smooth"
    style={{ width: "max-content" }}
  >
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="glare-card backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex-shrink-0 w-80 sm:w-80 lg:w-96"
                      >
                        {/* 3D Model - Increased height */}
                        <div className="h-80 sm:h-64 lg:h-80 bg-transparent relative">
                          <FoodItem3D modelUrl={item.modelUrl} itemId={item.id} />
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          </div>
                        </div>

                        {/* Item Details - Reduced padding */}
                        <div className="p-2 sm:p-3 lg:p-4">
                          <div className="flex items-start justify-between mb-1 sm:mb-2">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              {getTypeIcon(item.type)}
                              <h4 className="font-bold text-sm sm:text-base lg:text-lg hover:text-yellow-500 line-clamp-1">
                                {item.name}
                              </h4>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm sm:text-sm sm:line-clamp-2">{item.description}</p>
                          <div className="mb-2 mt-1">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              Ingredients : {item.ingredients.join(", ")}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-yellow-600 bg-clip-text text-transparent">
                              ₹{item.price}
                            </span>
                            <Button
                              onClick={() => onAddToCart(item)}
                              variant="outline"
                              className="border-gray-600 bg-transparent text-gray-600 hover:bg-yellow-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Why Choose Our 3D Menu Section */}
        <section  className="py-8 sm:py-12 lg:py-20 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl mx-2 sm:mx-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                Why Choose Our 3D Menu?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionary dining experience with cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow glare-card bg-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                  Interactive 3D Models
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  Explore every dish in stunning 3D detail. Rotate, zoom, and examine your food before ordering.
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow glare-card bg-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                  AR Experience
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  View dishes in augmented reality on your table before ordering. See exactly how it looks!
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1 bg-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                  Quick & Easy
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  Fast loading, intuitive interface, and seamless ordering process for the best user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base sm:text-lg lg:text-xl">No items found matching your criteria.</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .glare-card {
          position: relative;
          overflow: hidden;
        }
        .glare-card::before {
          content: "";
          position: absolute;
          top: -60%;
          left: -60%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(252, 205, 63, 0.25) 100%
          );
          transform: rotate(8deg);
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: lighten;
        }
        .glare-card > * {
          position: relative;
          z-index: 2;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
