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
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (modelViewerRef.current) {
      observer.observe(modelViewerRef.current)
    }

    return () => observer.disconnect()
  }, [shouldLoad])

  const handleViewInAR = () => {
    const modelViewer = document.getElementById(`model-${itemId}`)
    if (modelViewer && (modelViewer as any).activateAR) {
      ;(modelViewer as any).activateAR()
    }
  }

  return (
    <div ref={modelViewerRef} className="w-full h-full relative">
      {shouldLoad ? (
        <>
          <model-viewer
            id={`model-${itemId}`}
            src={modelUrl}
            alt="3D Food Model"
            ar
            ar-modes="scene-viewer quick-look"
            auto-rotate
            camera-controls
            shadow-intensity="1"
            style={{ width: "100%", height: "100%" }}
            onLoad={() => setIsLoaded(true)}
            className="rounded-t-2xl"
          />
          <Button
            onClick={handleViewInAR}
            size="sm"
            className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow-lg"
          >
            View in AR
          </Button>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-2xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading 3D Model...</p>
          </div>
        </div>
      )}
    </div>
  )
}