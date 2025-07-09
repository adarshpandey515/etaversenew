"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import UploadSection from "@/components/upload-section"

export default function UploadPage() {
  const router = useRouter()

  return (
    <div className=" bg-gradient-to-br from-white via-[#fff9c4] to-[#ffe0b2]">
      {/* Header */}
      <header className="backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
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
              <div className="w-[200px] h-[50px] rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="backdrop-blur-md" />
              </div>
            </div>
            <div className="w-[120px]"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <UploadSection />
      </main>
    </div>
  )
}
