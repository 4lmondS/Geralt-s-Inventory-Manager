import React from 'react';
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { StockStatus } from '../types';
import { playTock } from '../utils/audio';

interface GothicFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  categoryCounts?: Record<string, number>;
  stockFilter: StockStatus;
  onSelectStockFilter: (status: StockStatus) => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
  viewMode: 'grid' | 'table';
  onToggleViewMode: (mode: 'grid' | 'table') => void;
}

export const GothicFilters: React.FC<GothicFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  categoryCounts,
  stockFilter,
  onSelectStockFilter,
  sortBy,
  onSelectSortBy,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <div className="bg-[#100d17] border border-[#2b1f33] p-4 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Top row: Search input + View Mode Switch */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between mb-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7a96]" />
          <input
            id="input-search-relics"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari artefak dalam kegelapan (nama, kutukan, deskripsi)..."
            className="w-full bg-[#161220] border border-[#3b2a47] focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]/50 text-xs md:text-sm text-[#ece5d8] placeholder-[#796d85] pl-9 pr-9 py-2.5 outline-none transition-all duration-300 font-cinzel"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: Sorting & View Mode */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-cinzel text-[#8f8299] hidden sm:inline">Urutan:</span>
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value)}
              className="bg-[#161220] border border-[#3b2a47] focus:border-[#a855f7] text-[#ded5c7] text-xs font-cinzel px-2.5 py-2 outline-none cursor-pointer"
            >
              <option value="newest">Terbaru Masuk</option>
              <option value="stock-desc">Stok Melimpah (Tertinggi)</option>
              <option value="stock-asc">Stok Kritis (Terendah)</option>
              <option value="name-asc">Nama Artefak (A - Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-[#3b2a47] bg-[#161220] p-0.5">
            <button
              id="btn-view-grid"
              onClick={() => {
                playTock();
                onToggleViewMode('grid');
              }}
              title="Tampilan Peti Relik (Grid)"
              className={`p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#2e1d3d] text-[#e9d5ff] shadow-sm'
                  : 'text-[#82748f] hover:text-[#ded5c7]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="btn-view-table"
              onClick={() => {
                playTock();
                onToggleViewMode('table');
              }}
              title="Tampilan Grimoire Register (Tabel)"
              className={`p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#2e1d3d] text-[#e9d5ff] shadow-sm'
                  : 'text-[#82748f] hover:text-[#ded5c7]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        <span className="text-[11px] font-cinzel text-[#7f7389] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" />
          Kategori:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts ? categoryCounts[cat] : undefined;
          return (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => {
                playTock();
                onSelectCategory(cat);
              }}
              className={`shrink-0 text-xs font-cinzel tracking-wider px-3 py-1.5 border transition-all duration-300 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#4c1d38] to-[#2d1223] text-[#fed7aa] border-[#b91c1c] shadow-[0_0_10px_rgba(185,28,28,0.3)]'
                  : 'bg-[#15111d] text-[#9c8e9f] border-[#291e30] hover:border-[#63486a] hover:text-[#e4dad2]'
              }`}
            >
              <span>{cat}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-none border ${
                    isSelected
                      ? 'bg-[#7f1d1d]/60 text-[#fed7aa] border-[#991b1b]'
                      : 'bg-[#1c1424] text-[#8e8194] border-[#372442]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stock Filter Indicators */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#23182b]">
        <span className="text-[10px] font-cinzel text-[#776c80] uppercase tracking-widest mr-1">
          Filter Stok:
        </span>

        {[
          { key: 'all', label: 'Semua Status' },
          { key: 'available', label: 'Tersedia (> 5)' },
          { key: 'low', label: 'Hampir Habis (1-5)' },
          { key: 'depleted', label: 'Habis / Lenyap (0)' },
        ].map((item) => (
          <button
            key={item.key}
            id={`filter-stock-${item.key}`}
            onClick={() => {
              playTock();
              onSelectStockFilter(item.key as StockStatus);
            }}
            className={`text-[11px] font-cinzel px-2.5 py-1 border transition-all ${
              stockFilter === item.key
                ? 'bg-[#221730] border-[#a855f7] text-[#e9d5ff] shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                : 'bg-transparent border-transparent text-[#7d7087] hover:text-[#c4b5cd]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
