"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export default function HomeSection() {
  const modelViewerRef = useRef<any>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if model-viewer is already loaded
    if (window.customElements && window.customElements.get("model-viewer")) {
      setIsScriptLoaded(true)
      return
    }

    // Load model-viewer script
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"

    script.onload = () => {
      console.log("Model viewer script loaded for hero section")
      setIsScriptLoaded(true)
    }

    script.onerror = () => {
      console.error("Failed to load model viewer script for hero section")
      setModelError(true)
    }

    document.head.appendChild(script)

    return () => {
      // Don't remove script as it might be used by other components
    }
  }, [])

  const handleViewInAR = () => {
    try {
      if (modelViewerRef.current && typeof modelViewerRef.current.activateAR === "function") {
        modelViewerRef.current.activateAR()
      } else {
        console.warn("AR not available for hero model")
      }
    } catch (error) {
      console.error("Error activating AR for hero model:", error)
    }
  }

  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu-section")
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleModelLoad = () => {
    console.log("Hero model loaded successfully")
    setModelLoaded(true)
    setModelError(false)
  }

  const handleModelError = (event: any) => {
    console.error("Hero model loading error:", event)
    setModelError(true)
    setModelLoaded(false)
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    etaverse
                  </span>
                  <br />
                  <span className="text-gray-800 text-3xl sm:text-4xl lg:text-5xl">Restaurant</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                  Experience dining like never before with our interactive 3D menu. Explore every dish in stunning
                  detail and even view them in AR!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={scrollToMenu}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  Explore Menu
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleViewInAR}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 px-6 sm:px-8 py-3 text-base sm:text-lg"
                  disabled={!modelLoaded}
                >
                  View in AR
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 lg:pt-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Dishes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">4.9</div>
                  <div className="text-xs sm:text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">1000+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Model */}
            <div className="relative order-1 lg:order-2">
              <div className="relative w-full h-64 sm:h-80 lg:h-[500px] bg-white/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                {!modelLoaded && !modelError && !isScriptLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-200 rounded-full animate-pulse mx-auto mb-4"></div>
                      <p className="text-gray-500 text-lg">Loading 3D Viewer...</p>
                    </div>
                  </div>
                )}

                {!modelLoaded && !modelError && isScriptLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-200 rounded-full animate-pulse mx-auto mb-4"></div>
                      <p className="text-gray-500 text-lg">Loading 3D Model...</p>
                    </div>
                  </div>
                )}

                {modelError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 text-2xl">🍽️</span>
                      </div>
                      <p className="text-gray-500 text-lg">3D Model Unavailable</p>
                    </div>
                  </div>
                )}

                {isScriptLoaded && (
                  <model-viewer
                    ref={modelViewerRef}
                    src="https://raw.githubusercontent.com/adarshpandey515/3dmodels/main/risotto.glb"
                    ios-src="https://raw.githubusercontent.com/adarshpandey515/3dmodels/main/risotto.glb"
                    alt="Today's Special - Risotto"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    loading="lazy"
                    reveal="interaction"
                    interaction-prompt="none"
                    style={{ width: "100%", height: "100%" }}
                    onLoad={handleModelLoad}
                    onError={handleModelError}
                    className="rounded-3xl"
                  />
                )}

                {modelLoaded && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-orange-100">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800">Today's Special</h3>
                    <p className="text-gray-600 text-sm">Creamy Italian Risotto</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl sm:text-2xl font-bold text-orange-600">₹599</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
