import React from 'react';
import { Minus, Plus, Flame, Edit3, Skull, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { GothicItem } from '../types';
import { playTock, playDarinaChime } from '../utils/audio';

interface GothicItemTableProps {
  items: GothicItem[];
  onUpdateStock: (id: string, delta: number) => void;
  onEdit: (item: GothicItem) => void;
  onBanish: (item: GothicItem) => void;
}

export const GothicItemTable: React.FC<GothicItemTableProps> = ({
  items,
  onUpdateStock,
  onEdit,
  onBanish,
}) => {
  return (
    <div className="w-full overflow-x-auto bg-[#100d17] border border-[#2b1f33] shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-[#3b2a47] bg-[#151021] text-[#bcaec4] font-cinzel text-xs tracking-wider uppercase">
            <th className="p-3.5 pl-4">Artefak / Relik</th>
            <th className="p-3.5">Kategori</th>
            <th className="p-3.5">Kondisi</th>
            <th className="p-3.5">Aura Bahaya</th>
            <th className="p-3.5 text-center">Jumlah Stok</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 pr-4 text-right">Tindakan Ritual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#22172b]">
          {items.map((item) => {
            const isDepleted = item.stock === 0;
            const isLow = item.stock > 0 && item.stock <= 5;
            const isEasterEgg = item.isEasterEgg || item.id.includes('darina');

            return (
              <tr
                key={item.id}
                id={`table-row-${item.id}`}
                className={`transition-colors duration-200 group ${
                  isEasterEgg
                    ? 'bg-[#1e0a16]/40 hover:bg-[#2e1022]/70 border-l-2 border-l-[#f43f5e]'
                    : 'hover:bg-[#181324]'
                }`}
              >
                {/* Item Name & Mystic Description */}
                <td className="p-3.5 pl-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <div
                        className={`w-11 h-11 shrink-0 overflow-hidden border bg-[#0c0a13] shadow-inner ${
                          isEasterEgg
                            ? 'border-[#fb7185] cursor-pointer hover:shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                            : 'border-[#3b2a47]'
                        }`}
                        onClick={isEasterEgg ? () => playDarinaChime() : undefined}
                        title={isEasterEgg ? 'Klik untuk mendengarkan kotak musik Darina' : undefined}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-[#3b2a47] bg-[#161122] text-[#8c8094]">
                        <Skull className="w-5 h-5 text-[#a855f7]" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-cinzel font-bold text-sm transition-colors ${
                            isEasterEgg
                              ? 'text-[#ffe4e6] group-hover:text-[#fb7185] cursor-pointer flex items-center gap-1.5'
                              : 'text-[#f3ede2] group-hover:text-[#f87171]'
                          }`}
                          onClick={isEasterEgg ? () => playDarinaChime() : undefined}
                          title={isEasterEgg ? 'Klik untuk mendengarkan kotak musik gothic Darina' : undefined}
                        >
                          {item.name}
                        </div>
                      </div>
                      <div className="text-xs text-[#8c8094] font-playfair italic max-w-xs truncate">
                        {item.description}
                      </div>
                      {item.location && (
                        <div className="text-[10px] text-[#695d70] font-mono mt-0.5">
                          {item.location}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="p-3.5">
                  <span className="text-xs font-cinzel text-[#c084fc] bg-[#221633] px-2 py-0.5 border border-[#4a245a]">
                    {item.category}
                  </span>
                </td>

                {/* Condition */}
                <td className="p-3.5 text-xs font-playfair italic text-[#d4af37]">
                  {item.condition}
                </td>

                {/* Danger Level */}
                <td className="p-3.5">
                  <span
                    className={`text-[10px] font-cinzel uppercase px-2 py-0.5 border ${
                      item.dangerLevel === 'Mematikan'
                        ? 'text-[#f87171] border-[#b91c1c]/50 bg-[#2b0c14]'
                        : item.dangerLevel === 'Terkutuk'
                        ? 'text-[#c084fc] border-[#7c3aed]/50 bg-[#1c0f2b]'
                        : item.dangerLevel === 'Mencurigakan'
                        ? 'text-[#fbbf24] border-[#d97706]/50 bg-[#21160a]'
                        : 'text-[#9ca3af] border-[#4b5563]/50 bg-[#13141a]'
                    }`}
                  >
                    {item.dangerLevel}
                  </span>
                </td>

                {/* Stock Controls */}
                <td className="p-3.5 text-center">
                  <div className="inline-flex items-center gap-2 bg-[#161122] border border-[#30213d] px-2 py-1">
                    <button
                      id={`table-minus-${item.id}`}
                      onClick={() => {
                        playTock();
                        onUpdateStock(item.id, -1);
                      }}
                      disabled={item.stock <= 0}
                      title="Kurangi stok"
                      className="w-6 h-6 bg-[#211830] hover:bg-[#3d182e] hover:text-[#ef4444] disabled:opacity-30 disabled:cursor-not-allowed text-xs flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span
                      className={`font-cinzel font-bold text-sm min-w-[28px] text-center ${
                        isDepleted
                          ? 'text-[#ef4444]'
                          : isLow
                          ? 'text-[#f59e0b]'
                          : 'text-[#e9d5ff]'
                      }`}
                    >
                      {item.stock}
                    </span>

                    <button
                      id={`table-plus-${item.id}`}
                      onClick={() => {
                        playTock();
                        onUpdateStock(item.id, 1);
                      }}
                      title="Tambah stok"
                      className="w-6 h-6 bg-[#211830] hover:bg-[#1a3326] hover:text-[#34d399] text-xs flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="p-3.5">
                  {isDepleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-cinzel text-[#ef4444] bg-[#290a12] border border-[#ef4444]/40 px-2 py-0.5 animate-pulse">
                      <Skull className="w-3 h-3" />
                      Lenyap
                    </span>
                  ) : isLow ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-cinzel text-[#fbbf24] bg-[#2a1a09] border border-[#f59e0b]/40 px-2 py-0.5">
                      <ShieldAlert className="w-3 h-3" />
                      Menipis
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-cinzel text-[#34d399] bg-[#0c1f19] border border-[#10b981]/30 px-2 py-0.5">
                      <Sparkles className="w-3 h-3" />
                      Tersedia
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      id={`table-edit-${item.id}`}
                      onClick={() => onEdit(item)}
                      title="Ubah Prasasti"
                      className="p-1.5 bg-[#171322] hover:bg-[#2c1d3b] text-[#b8adbf] hover:text-[#f3ede2] border border-[#33233f] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#a855f7]" />
                    </button>

                    <button
                      id={`table-banish-${item.id}`}
                      onClick={() => onBanish(item)}
                      title="Banish / Usir ke Kegelapan"
                      className="p-1.5 bg-[#1f0d14] hover:bg-[#3d131d] text-[#e0a6b1] hover:text-[#fee2e2] border border-[#521c27] hover:border-[#dc2626] transition-colors"
                    >
                      <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
