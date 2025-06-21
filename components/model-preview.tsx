"use client"

import { useEffect, useRef, useState } from "react"

interface ModelPreviewProps {
  modelUrl: string
}

export default function ModelPreview({ modelUrl }: ModelPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const modelViewerRef = useRef<any>(null)

  useEffect(() => {
    if (window.customElements && window.customElements.get("model-viewer")) {
      setIsScriptLoaded(true)
      return
    }
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"
      script.onload = () => setIsScriptLoaded(true)
      script.onerror = () => setHasError(true)
      document.head.appendChild(script)
    } else {
      setIsScriptLoaded(true)
    }
  }, [])

  useEffect(() => {
    const node = modelViewerRef.current
    if (!node) return

    function handleLoad() {
      setIsLoaded(true)
      setHasError(false)
    }
    function handleError(event: any) {
      setHasError(true)
      setIsLoaded(false)
    }
    node.addEventListener("load", handleLoad)
    node.addEventListener("error", handleError)
    return () => {
      node.removeEventListener("load", handleLoad)
      node.removeEventListener("error", handleError)
    }
  }, [isScriptLoaded, modelUrl])

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-2xl">🍽️</span>
          </div>
          <p className="text-gray-500">Model Preview Unavailable</p>
        </div>
      </div>
    )
  }

  if (!isScriptLoaded) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#fef4ea] to-[#fccd3f] flex items-center justify-center rounded-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#fccd3f] rounded-full animate-pulse mx-auto mb-2"></div>
          <p className="text-[#fccd3f] text-sm">Loading 3D Viewer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef4ea] to-[#fccd3f] flex items-center justify-center rounded-xl z-10 pointer-events-none">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full animate-pulse mx-auto mb-2"></div>
            <p className="text-[#fccd3f] text-sm">Loading Preview...</p>
          </div>
        </div>
      )}

      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt="3D Model Preview"
        ar
        ar-modes="webxr scene-viewer quick-look"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        loading="lazy"
        reveal="interaction"
        interaction-prompt="none"
        style={{ width: "100%", height: "100%" }}
        className="rounded-xl"
      />
    </div>
  )
}