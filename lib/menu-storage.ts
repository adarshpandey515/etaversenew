import defaultMenuItems from '../public/menulist.json';

// Now you can use defaultMenuItems as an array
console.log(defaultMenuItems[0].name); // "Zinger Burger Deluxe"

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
