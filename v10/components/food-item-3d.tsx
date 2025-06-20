"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface FoodItem3DProps {
  modelUrl: string
  itemId: number
}

export default function FoodItem3D({ modelUrl, itemId }: FoodItem3DProps) {
  const modelViewerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if model-viewer is already loaded
    if (window.customElements && window.customElements.get("model-viewer")) {
      setIsScriptLoaded(true)
      return
    }

    // Load model-viewer script if not already loaded
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"

      script.onload = () => {
        console.log("Model viewer script loaded successfully")
        setIsScriptLoaded(true)
      }

      script.onerror = () => {
        console.error("Failed to load model viewer script")
        setHasError(true)
      }

      document.head.appendChild(script)
    } else {
      setIsScriptLoaded(true)
    }
  }, [])

  const handleViewInAR = () => {
    try {
      const modelViewer = modelViewerRef.current
      if (modelViewer && typeof modelViewer.activateAR === "function") {
        modelViewer.activateAR()
      } else {
        console.warn("AR not available for this model")
      }
    } catch (error) {
      console.error("Error activating AR:", error)
    }
  }

  const handleModelLoad = () => {
    console.log(`Model loaded successfully: ${modelUrl}`)
    setIsLoaded(true)
    setHasError(false)
  }

  const handleModelError = (event: any) => {
    console.error("Model loading error:", event, "URL:", modelUrl)
    setHasError(true)
    setIsLoaded(false)
  }

  // Show loading state while script is loading
  if (!isScriptLoaded && !hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center rounded-t-2xl">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-orange-300 rounded-full animate-pulse mx-auto mb-2"></div>
          <p className="text-orange-600 text-sm">Loading 3D Viewer...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-2xl">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-gray-500 text-xl">🍽️</span>
          </div>
          <p className="text-gray-500 text-sm">3D Model Unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center rounded-t-2xl z-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-300 rounded-full animate-pulse mx-auto mb-2"></div>
            <p className="text-orange-600 text-sm">Loading 3D Model...</p>
          </div>
        </div>
      )}

      {isScriptLoaded && (
        <model-viewer
          ref={modelViewerRef}
          id={`model-${itemId}`}
          src={modelUrl}
          alt="3D Food Model"
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
          className="rounded-t-2xl"
        />
      )}

      {isLoaded && (
        <Button
          onClick={handleViewInAR}
          size="sm"
          className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 sm:px-3 py-1 rounded-lg shadow-lg"
        >
          View in AR
        </Button>
      )}
    </div>
  )
}
