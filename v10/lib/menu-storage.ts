  const defaultMenuItems = [
    {
      id: 1,
      name: "Rustic Italian Salad",
      price: 499,
      type: "veg",
      category: "Starters",
      ingredients: ["Mixed greens", "Cherry tomatoes", "Mozzarella", "Olives", "Balsamic dressing"],
      modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb",
      description: "Fresh mixed greens with authentic Italian flavors",
    },
    {
      id: 2,
      name: "Hot Pot - Meal",
      price: 700,
      type: "non-veg",
      category: "Main Course",
      ingredients: ["Sichuan Chicken", "Egg Fried Rice", "Noodles", "Stir Fried Veggies", "Crab Lollipop"],
      modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb",
      description: "Spicy Sichuan-style hot pot with premium ingredients",
    },
    {
      id: 3,
      name: "Vegan Buddha Bowl",
      price: 550,
      type: "vegan",
      category: "Main Course",
      ingredients: ["Quinoa", "Roasted vegetables", "Avocado", "Tahini dressing", "Pumpkin seeds"],
      modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb",
      description: "Nutritious plant-based bowl with superfoods",
    },
    {
      id: 4,
      name: "Chocolate Lava Cake",
      price: 350,
      type: "veg",
      category: "Desserts",
      ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Vanilla ice cream"],
      modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb",
      description: "Warm chocolate cake with molten center",
    },
  ]

  // Get menu items from localStorage or return default items
  export function getMenuItems() {
    if (typeof window === "undefined") {
      return defaultMenuItems
    }

    try {
      const stored = localStorage.getItem("menuItems")
      if (stored) {
        return JSON.parse(stored)
      }
      // Initialize with default items if nothing stored
      localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems))
      return defaultMenuItems
    } catch (error) {
      console.error("Error loading menu items:", error)
      return defaultMenuItems
    }
  }

  // Add a new menu item
  export function addMenuItem(item: any) {
    if (typeof window === "undefined") {
      return
    }

    try {
      const currentItems = getMenuItems()
      const newItems = [...currentItems, item]
      localStorage.setItem("menuItems", JSON.stringify(newItems))
    } catch (error) {
      console.error("Error saving menu item:", error)
    }
  }

  // Update menu items
  export function updateMenuItems(items: any[]) {
    if (typeof window === "undefined") {
      return
    }

    try {
      localStorage.setItem("menuItems", JSON.stringify(items))
    } catch (error) {
      console.error("Error updating menu items:", error)
    }
  }
