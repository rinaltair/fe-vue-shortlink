import { asyncRoutes } from '@/router/routes/asyncRoutes'
import { menuDataToRouter } from '@/router/utils/menuToRouter'
import { AppRouteRecord } from '@/types/router'

interface MenuResponse {
  menuList: AppRouteRecord[]
}

// Menu API
export const menuService = {
  async getMenuList(delay = 300): Promise<MenuResponse> {
    try {
      // Simulate API response menu data
      const menuData = asyncRoutes
      // Process menu data
      const menuList = menuData.map((route) => menuDataToRouter(route))
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, delay))

      return { menuList }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch menu')
    }
  }
}
