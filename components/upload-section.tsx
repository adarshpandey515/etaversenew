"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Eye, Link, FileUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ModelPreview from "@/components/model-preview"
import { addMenuItem } from "@/lib/menu-storage"
import { toast } from "@/hooks/use-toast"

interface FormData {
  name: string
  description: string
  ingredients: string
  type: "veg" | "non-veg" | "vegan" | ""
  category: string
  price: string
}

const predefinedCategories = ["Starters", "Main Course", "Desserts", "Beverages", "Snacks", "Soups"]

export default function UploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [modelUrl, setModelUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    ingredients: "",
    type: "",
    category: "",
    price: "",
  })
  const [customCategory, setCustomCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setShowPreview(false)
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid 3D model file (.glb or .gltf)",
        variant: "destructive",
      })
    }
  }

  const handleUrlSubmit = () => {
    if (modelUrl && (modelUrl.endsWith(".glb") || modelUrl.endsWith(".gltf"))) {
      setPreviewUrl(modelUrl)
      setShowPreview(false)
    } else {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid 3D model URL (.glb or .gltf)",
        variant: "destructive",
      })
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setModelUrl("")
    if (previewUrl && uploadMethod === "file") {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if ((!selectedFile && !modelUrl) || !formData.name || !formData.type || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and provide a 3D model",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newItem = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        ingredients: formData.ingredients.split(",").map((ing) => ing.trim()),
        type: formData.type,
        category: formData.category || customCategory,
        price: Number.parseInt(formData.price),
        modelUrl:
          previewUrl ||
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb",
      }

      addMenuItem(newItem)

      toast({
        title: "Success!",
        description: "Model uploaded successfully and added to menu",
      })

      // Reset form
      setSelectedFile(null)
      setModelUrl("")
      setPreviewUrl(null)
      setShowPreview(false)
      setFormData({
        name: "",
        description: "",
        ingredients: "",
        type: "",
        category: "",
        price: "",
      })
      setCustomCategory("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Upload 3D Food Models
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Add new items to your restaurant menu with interactive 3D models and AR support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Upload 3D Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as "file" | "url")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file" className="flex items-center space-x-2">
                  <FileUp className="w-4 h-4" />
                  <span>Upload File</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center space-x-2">
                  <Link className="w-4 h-4" />
                  <span>Use URL</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                {!selectedFile ? (
                  <div
                    className="border-2 border-dashed border-orange-300 rounded-xl p-12 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gradient-to-br from-orange-50 to-red-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-700 mb-2">Upload 3D Model</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Drag and drop your .glb or .gltf file here, or click to browse
                    </p>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      Choose File
                    </Button>
                  </div>
                ) : (
                  <div className="border border-orange-200 rounded-xl p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Upload className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelUrl">3D Model URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="modelUrl"
                        value={modelUrl}
                        onChange={(e) => setModelUrl(e.target.value)}
                        placeholder="https://example.com/model.glb"
                        className="border-orange-200 focus:border-orange-400"
                      />
                      <Button onClick={handleUrlSubmit} className="bg-gradient-to-r from-orange-500 to-red-500">
                        Load
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Enter a direct URL to a .glb or .gltf 3D model file</p>
                </div>
              </TabsContent>
            </Tabs>

            {previewUrl && (
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full border-orange-200 hover:bg-orange-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide Preview" : "Preview Model"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Model Preview */}
        {showPreview && previewUrl && (
          <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Model Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                <ModelPreview modelUrl={previewUrl} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Section */}
      {previewUrl && (
        <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Margherita Pizza"
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., 299"
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the item..."
                  rows={3}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange("ingredients", e.target.value)}
                  placeholder="List ingredients separated by commas..."
                  rows={2}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Food Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.type && <Badge className={getTypeColor(formData.type)}>{formData.type}</Badge>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <SelectValue placeholder="Select or create category" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Create New Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.category === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customCategory">New Category Name</Label>
                  <Input
                    id="customCategory"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter new category name"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleRemoveFile}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isSubmitting ? "Uploading..." : "Upload Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
