/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { GothicItem, StockStatus, InventoryStats } from './types';
import { INITIAL_GOTHIC_ITEMS, CATEGORIES } from './data/initialData';
import gothicCryptBg from './assets/images/gothic_crypt_bg_1789576506844.jpg';
import { GothicHeader } from './components/GothicHeader';
import { GothicStats } from './components/GothicStats';
import { GothicFilters } from './components/GothicFilters';
import { GothicItemCard } from './components/GothicItemCard';
import { GothicItemTable } from './components/GothicItemTable';
import { SummonItemModal } from './components/SummonItemModal';
import { BanishModal } from './components/BanishModal';
import { GothicDesignSystemModal } from './components/GothicDesignSystemModal';
import { Skull, Plus, Flame, RefreshCw, Sparkles, Feather } from 'lucide-react';
import { playTock } from './utils/audio';

const STORAGE_KEY = 'gothic_vault_inventory_v6';

export default function App() {
  // Inventory items with local storage fallback and image hydration
  const [items, setItems] = useState<GothicItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Hydrate images and ensure new items (like gothic fashion) are included
            const hydrated = parsed.map((item: GothicItem) => {
              if (!item.imageUrl) {
                const matched = INITIAL_GOTHIC_ITEMS.find(
                  (init) => init.id === item.id || init.name === item.name
                );
                if (matched?.imageUrl) {
                  return { ...item, imageUrl: matched.imageUrl };
                }
              }
              return item;
            });

            // Merge any newly introduced items (e.g. gothic fashion additions)
            const existingIds = new Set(hydrated.map((it: GothicItem) => it.id));
            const newDefaults = INITIAL_GOTHIC_ITEMS.filter((init) => !existingIds.has(init.id));
            return [...hydrated, ...newDefaults];
          }
        }
      } catch (e) {
        console.error('Error loading inventory from storage:', e);
      }
    }
    return INITIAL_GOTHIC_ITEMS;
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [stockFilter, setStockFilter] = useState<StockStatus>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isSummonModalOpen, setIsSummonModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GothicItem | null>(null);
  const [banishingItem, setBanishingItem] = useState<GothicItem | null>(null);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  // Status notification message (Gothic microcopy)
  const [notification, setNotification] = useState<string | null>(null);

  // Persist items to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save inventory:', e);
    }
  }, [items]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Derive unique categories from active items
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    CATEGORIES.forEach((c) => set.add(c));
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  // Derive item count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Semua: items.length,
    };
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Compute Dashboard Stats
  const stats: InventoryStats = useMemo(() => {
    const totalItems = items.length;
    const catSet = new Set(items.map((i) => i.category));
    let availableCount = 0;
    let lowStockCount = 0;
    let depletedCount = 0;
    let totalQuantity = 0;

    items.forEach((item) => {
      totalQuantity += item.stock;
      if (item.stock === 0) {
        depletedCount++;
      } else if (item.stock <= 5) {
        lowStockCount++;
      } else {
        availableCount++;
      }
    });

    return {
      totalItems,
      totalCategories: catSet.size,
      availableCount,
      lowStockCount,
      depletedCount,
      totalQuantity,
    };
  }, [items]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.condition.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'Semua') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Stock status filter
    if (stockFilter === 'available') {
      result = result.filter((item) => item.stock > 5);
    } else if (stockFilter === 'low') {
      result = result.filter((item) => item.stock > 0 && item.stock <= 5);
    } else if (stockFilter === 'depleted') {
      result = result.filter((item) => item.stock === 0);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      // default newest:
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });

    return result;
  }, [items, searchQuery, selectedCategory, stockFilter, sortBy]);

  // Stock Stepper (+ / -)
  const handleUpdateStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  // Add / Edit Item
  const handleSaveItem = (
    itemData: Omit<GothicItem, 'id' | 'dateAdded'>,
    editId?: string
  ) => {
    if (editId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, ...itemData }
            : item
        )
      );
      showNotification(`Prasasti "${itemData.name}" berhasil diperbaharui dalam Grimoire.`);
    } else {
      const newItem: GothicItem = {
        ...itemData,
        id: `relic-${Date.now()}`,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setItems((prev) => [newItem, ...prev]);
      showNotification(`Artefak "${itemData.name}" berhasil dipanggil ke dalam Vault.`);
    }
  };

  // Banish / Exorcise Item
  const handleConfirmBanish = (id: string) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (target) {
      showNotification(`Artefak "${target.name}" telah diusir dan dimusnahkan ke dalam jurang kekosongan.`);
    }
  };

  // Reset to initial mock items
  const handleResetData = () => {
    playTock();
    if (window.confirm('Pulihkan perbendaharaan artefak ke kondisi awal peninggalan kuno?')) {
      setItems(INITIAL_GOTHIC_ITEMS);
      showNotification('Perbendaharaan artefak telah dipulihkan ke wujud mula.');
    }
  };

  const handleOpenSummon = () => {
    playTock();
    setEditingItem(null);
    setIsSummonModalOpen(true);
  };

  const handleEditItem = (item: GothicItem) => {
    playTock();
    setEditingItem(item);
    setIsSummonModalOpen(true);
  };

  const handleOpenBanish = (item: GothicItem) => {
    playTock();
    setBanishingItem(item);
  };

  return (
    <div className="min-h-screen bg-[#09080d] text-[#e6ded0] flex flex-col font-sans selection:bg-[#7f1d1d] selection:text-[#fff5f5] relative overflow-x-hidden">
      {/* Gothic Atmospheric Cathedral Crypt Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={gothicCryptBg}
          alt="Gothic Crypt Interior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 filter contrast-125 brightness-75 scale-105"
        />
        {/* Dark Obsidian & Crimson Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09080d]/85 via-[#09080d]/90 to-[#09080d]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(76,29,149,0.22)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(185,28,28,0.18)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(15,10,25,0.7)_0%,transparent_80%)]" />
      </div>

      {/* Main Header */}
      <GothicHeader
        onOpenSummonModal={handleOpenSummon}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Floating Notification */}
        {notification && (
          <div className="mb-5 p-3.5 bg-[#1f0f18] border border-[#7f1d1d] text-[#fecaca] text-xs font-cinzel flex items-center justify-between shadow-[0_0_20px_rgba(185,28,28,0.35)] animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-[#ef4444] animate-pulse shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-zinc-400 hover:text-white text-xs px-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Dashboard Stats */}
        <GothicStats
          stats={stats}
          currentStockFilter={stockFilter}
          onSelectStockFilter={(f) => setStockFilter(f)}
        />

        {/* Filter and Search Bar */}
        <GothicFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={allCategories}
          categoryCounts={categoryCounts}
          stockFilter={stockFilter}
          onSelectStockFilter={setStockFilter}
          sortBy={sortBy}
          onSelectSortBy={setSortBy}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* Inventory Item List or Empty State */}
        {filteredItems.length === 0 ? (
          <div
            id="empty-state-relics"
            className="text-center py-16 px-4 bg-[#110e19] border border-[#2b1f33] shadow-[0_0_30px_rgba(0,0,0,0.7)] my-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-[#1c1224] border border-[#581c3f] flex items-center justify-center shadow-[0_0_15px_rgba(185,28,28,0.2)]">
              <Skull className="w-8 h-8 text-[#a855f7]" />
            </div>
            <h3 className="text-xl font-cinzel font-bold text-[#f5eedf] tracking-wider mb-2">
              Barang Telah Lenyap Ditelan Kegelapan Malam...
            </h3>
            <p className="text-sm font-playfair italic text-[#9c8e9f] max-w-md mx-auto mb-6 leading-relaxed">
              Tidak ada artefak atau relik yang beresonansi dengan pencarian atau filter saat ini.
            </p>
            <div className="flex items-center justify-center gap-3">
              {(searchQuery || selectedCategory !== 'Semua' || stockFilter !== 'all') && (
                <button
                  onClick={() => {
                    playTock();
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                    setStockFilter('all');
                  }}
                  className="px-4 py-2 bg-[#1b1525] border border-[#3b2847] text-[#c4b5cd] hover:text-white text-xs font-cinzel tracking-wider transition-colors"
                >
                  Buka Tirai Filter
                </button>
              )}
              <button
                onClick={handleOpenSummon}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] border border-[#b91c1c] text-[#fbf7f1] text-xs font-cinzel font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(185,28,28,0.4)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Panggil Artefak Baru</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <GothicItemCard
                key={item.id}
                item={item}
                onUpdateStock={handleUpdateStock}
                onEdit={handleEditItem}
                onBanish={handleOpenBanish}
              />
            ))}
          </div>
        ) : (
          <GothicItemTable
            items={filteredItems}
            onUpdateStock={handleUpdateStock}
            onEdit={handleEditItem}
            onBanish={handleOpenBanish}
          />
        )}
      </main>

      {/* Atmospheric Footer */}
      <footer className="mt-12 border-t border-[#241727] bg-[#0a0810] py-6 px-4 text-center text-xs text-[#796d7e] font-cinzel">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#991b1b] rotate-45" />
            <span>Sanctum Reliquarium • Pengelola Barang Gothic Dark</span>
          </div>

          <div className="text-[11px] font-playfair italic text-[#95879a]">
            "Mementō morī • Diabadikan dalam inskripsi kuno abad pertengahan"
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDesignSystemOpen(true)}
              className="text-[#a855f7] hover:text-[#d8b4fe] transition-colors underline underline-offset-4"
            >
              Panduan Desain UI
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="hover:text-[#e4dad2] transition-colors"
            >
              Pulihkan Artefak Awal
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SummonItemModal
        isOpen={isSummonModalOpen}
        onClose={() => setIsSummonModalOpen(false)}
        onSave={handleSaveItem}
        editItem={editingItem}
        existingCategories={allCategories}
      />

      <BanishModal
        isOpen={!!banishingItem}
        item={banishingItem}
        onClose={() => setBanishingItem(null)}
        onConfirmBanish={handleConfirmBanish}
      />

      <GothicDesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />
    </div>
  );
}
