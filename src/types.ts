export type StockStatus = 'all' | 'available' | 'low' | 'depleted';

export type DangerLevel = 'Aman' | 'Mencurigakan' | 'Terkutuk' | 'Mematikan';

export interface GothicItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  condition: string;
  description: string;
  dangerLevel: DangerLevel;
  dateAdded: string;
  location?: string;
  imageUrl?: string;
  isEasterEgg?: boolean;
}

export interface InventoryStats {
  totalItems: number;
  totalCategories: number;
  availableCount: number;
  lowStockCount: number;
  depletedCount: number;
  totalQuantity: number;
}
