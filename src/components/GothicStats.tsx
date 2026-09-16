import React from 'react';
import { Package, Layers, CheckCircle2, AlertTriangle, Skull, Flame } from 'lucide-react';
import { InventoryStats, StockStatus } from '../types';
import { playTock } from '../utils/audio';

interface GothicStatsProps {
  stats: InventoryStats;
  currentStockFilter: StockStatus;
  onSelectStockFilter: (status: StockStatus) => void;
}

export const GothicStats: React.FC<GothicStatsProps> = ({
  stats,
  currentStockFilter,
  onSelectStockFilter,
}) => {
  const handleFilterClick = (filter: StockStatus) => {
    playTock();
    onSelectStockFilter(filter);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-4 my-6">
      {/* 1. Total Jenis Barang */}
      <div
        id="stat-card-total"
        onClick={() => handleFilterClick('all')}
        className={`relative cursor-pointer p-4 bg-[#110e1a] border transition-all duration-300 group overflow-hidden ${
          currentStockFilter === 'all'
            ? 'border-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-[#171224]'
            : 'border-[#2d2238] hover:border-[#7c3aed]/50 hover:bg-[#151121]'
        }`}
      >
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#7c3aed]/15 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-cinzel tracking-widest text-[#a89bb2] uppercase">
            Total Relik
          </span>
          <Package className="w-4 h-4 text-[#a855f7]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-cinzel font-bold text-[#f5f1eb]">
            {stats.totalItems}
          </span>
          <span className="text-xs text-[#9f9486] font-playfair italic">
            ({stats.totalQuantity} unit)
          </span>
        </div>
        <div className="mt-2 text-[10px] tracking-wider text-[#93839e]">
          Semua Artefak Vault
        </div>
      </div>

      {/* 2. Total Kategori */}
      <div
        id="stat-card-categories"
        className="relative p-4 bg-[#110e1a] border border-[#2d2238] hover:border-[#6366f1]/40 transition-all duration-300 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-cinzel tracking-widest text-[#a89bb2] uppercase">
            Sektor Kategori
          </span>
          <Layers className="w-4 h-4 text-[#818cf8]" />
        </div>
        <div className="text-2xl md:text-3xl font-cinzel font-bold text-[#f5f1eb]">
          {stats.totalCategories}
        </div>
        <div className="mt-2 text-[10px] tracking-wider text-[#93839e]">
          Altar, Occult, Sastra, dll.
        </div>
      </div>

      {/* 3. Status Stok: Tersedia (> 5) */}
      <div
        id="stat-card-available"
        onClick={() => handleFilterClick('available')}
        className={`relative cursor-pointer p-4 bg-[#110e1a] border transition-all duration-300 overflow-hidden ${
          currentStockFilter === 'available'
            ? 'border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.25)] bg-[#0f1917]'
            : 'border-[#1b2b25] hover:border-[#10b981]/50 hover:bg-[#121c19]'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-cinzel tracking-widest text-[#6ee7b7] uppercase">
            Tersedia
          </span>
          <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
        </div>
        <div className="text-2xl md:text-3xl font-cinzel font-bold text-[#ecfdf5]">
          {stats.availableCount}
        </div>
        <div className="mt-2 text-[10px] tracking-wider text-[#6ee7b7]/80">
          Stok melimpah (&gt; 5)
        </div>
      </div>

      {/* 4. Status Stok: Hampir Habis (1 - 5) */}
      <div
        id="stat-card-low"
        onClick={() => handleFilterClick('low')}
        className={`relative cursor-pointer p-4 bg-[#110e1a] border transition-all duration-300 overflow-hidden ${
          currentStockFilter === 'low'
            ? 'border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.25)] bg-[#1f170b]'
            : 'border-[#332414] hover:border-[#f59e0b]/50 hover:bg-[#19130d]'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-cinzel tracking-widest text-[#fcd34d] uppercase">
            Hampir Habis
          </span>
          <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
        </div>
        <div className="text-2xl md:text-3xl font-cinzel font-bold text-[#fef3c7]">
          {stats.lowStockCount}
        </div>
        <div className="mt-2 text-[10px] tracking-wider text-[#fcd34d]/80">
          Menipis (1 - 5 unit)
        </div>
      </div>

      {/* 5. Status Stok: Habis / Lenyap (0) */}
      <div
        id="stat-card-depleted"
        onClick={() => handleFilterClick('depleted')}
        className={`col-span-2 sm:col-span-1 relative cursor-pointer p-4 bg-[#140b0f] border transition-all duration-300 overflow-hidden ${
          currentStockFilter === 'depleted'
            ? 'border-[#dc2626] shadow-[0_0_25px_rgba(220,38,38,0.4)] bg-[#1e0e14]'
            : 'border-[#45141c] hover:border-[#dc2626]/60 hover:bg-[#1a0c12]'
        }`}
      >
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#b91c1c]/20 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-cinzel tracking-widest text-[#fca5a5] uppercase">
            Habis / Lenyap
          </span>
          <Skull className="w-4 h-4 text-[#ef4444] animate-pulse" />
        </div>
        <div className="text-2xl md:text-3xl font-cinzel font-bold text-[#fee2e2]">
          {stats.depletedCount}
        </div>
        <div className="mt-2 text-[10px] tracking-wider text-[#f87171] font-medium">
          Lenyap ditelan kegelapan
        </div>
      </div>
    </div>
  );
};
