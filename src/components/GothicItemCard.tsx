import React, { useState } from 'react';
import { Minus, Plus, Flame, Edit3, Skull, ShieldAlert, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';
import { GothicItem } from '../types';
import { playTock, playDarinaChime } from '../utils/audio';

interface GothicItemCardProps {
  item: GothicItem;
  onUpdateStock: (id: string, delta: number) => void;
  onEdit: (item: GothicItem) => void;
  onBanish: (item: GothicItem) => void;
}

export const GothicItemCard: React.FC<GothicItemCardProps> = ({
  item,
  onUpdateStock,
  onEdit,
  onBanish,
}) => {
  const [darinaLoved, setDarinaLoved] = useState(false);
  const isDepleted = item.stock === 0;
  const isLow = item.stock > 0 && item.stock <= 5;
  const isEasterEgg = item.isEasterEgg || item.id.includes('darina');

  const handleDarinaInteract = (e: React.MouseEvent) => {
    e.stopPropagation();
    playDarinaChime();
    setDarinaLoved(true);
    setTimeout(() => setDarinaLoved(false), 3200);
  };

  const getStatusBadge = () => {
    if (isDepleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-cinzel font-semibold tracking-wider bg-[#260b13] text-[#ef4444] border border-[#ef4444]/60 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse">
          <Skull className="w-3 h-3" />
          Lenyap / Habis
        </span>
      );
    }
    if (isLow) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-cinzel font-semibold tracking-wider bg-[#2a1b0a] text-[#fbbf24] border border-[#f59e0b]/50 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
          <ShieldAlert className="w-3 h-3" />
          Hampir Habis
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-cinzel font-semibold tracking-wider bg-[#0c1f19] text-[#34d399] border border-[#10b981]/40">
        <Sparkles className="w-3 h-3 text-[#10b981]" />
        Tersedia
      </span>
    );
  };

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'Mematikan':
        return 'text-[#f87171] border-[#b91c1c]/50 bg-[#2b0c14]';
      case 'Terkutuk':
        return 'text-[#c084fc] border-[#7c3aed]/50 bg-[#1c0f2b]';
      case 'Mencurigakan':
        return 'text-[#fbbf24] border-[#d97706]/50 bg-[#21160a]';
      default:
        return 'text-[#9ca3af] border-[#4b5563]/50 bg-[#13141a]';
    }
  };

  return (
    <div
      id={`relic-card-${item.id}`}
      className={`relative group bg-[#110e19] border transition-all duration-500 flex flex-col justify-between overflow-hidden ${
        isEasterEgg
          ? 'border-[#e11d48]/70 hover:border-[#fb7185] shadow-[0_0_25px_rgba(225,29,72,0.25)] hover:shadow-[0_0_35px_rgba(251,113,133,0.4)]'
          : isDepleted
          ? 'border-[#4a1622] hover:border-[#dc2626] hover:shadow-[0_0_25px_rgba(220,38,38,0.35)]'
          : 'border-[#2a1d33] hover:border-[#9333ea]/70 hover:shadow-[0_0_25px_rgba(147,51,234,0.3)]'
      }`}
    >
      {/* Ancient Gothic Corner Ornaments */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 pointer-events-none ${isEasterEgg ? 'border-[#fb7185]' : 'border-[#8b233a]'}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 pointer-events-none ${isEasterEgg ? 'border-[#fb7185]' : 'border-[#8b233a]'}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 pointer-events-none ${isEasterEgg ? 'border-[#f43f5e]' : 'border-[#4c1d38]'}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 pointer-events-none ${isEasterEgg ? 'border-[#f43f5e]' : 'border-[#4c1d38]'}`} />

      {/* Card Visual Banner / Image */}
      {item.imageUrl ? (
        <div
          className="relative h-44 w-full overflow-hidden bg-[#0c0a13] border-b border-[#2a1d33] cursor-pointer"
          onClick={isEasterEgg ? handleDarinaInteract : undefined}
          title={isEasterEgg ? 'Klik untuk membunyikan kotak musik Darina' : undefined}
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-90 group-hover:brightness-100"
          />
          {/* Gothic Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#110e19] via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />

          {/* Category Pill over image */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
            <span className="text-[10px] font-cinzel font-semibold tracking-widest text-[#f5eedf] uppercase bg-black/70 backdrop-blur-md px-2.5 py-1 border border-[#a855f7]/40 shadow-sm">
              {item.category}
            </span>
          </div>

          {/* Status Badges over image */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {getStatusBadge()}
          </div>

          {/* Darina Interactive Notification Overlay */}
          {darinaLoved && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center z-20 animate-in fade-in zoom-in-95 duration-300">
              <Sparkles className="w-6 h-6 text-[#fb7185] mb-1 animate-spin" />
              <div className="text-sm font-cinzel font-bold text-[#fecdd3] tracking-wider">
                Kotak Musik Gothic Darina
              </div>
              <div className="text-[11px] font-playfair italic text-[#fda4af] mt-1">
                Alunan nada melankolis D-Minor berdenting mistis...
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-5 pb-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-cinzel tracking-widest text-[#a855f7] uppercase border-b border-[#a855f7]/30 pb-0.5">
              {item.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {getStatusBadge()}
          </div>
        </div>
      )}

      {/* Card Header & Content */}
      <div className="p-5 pb-3">
        {/* Danger Level & ID */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`text-[9px] font-cinzel uppercase px-2 py-0.5 border ${
              isEasterEgg
                ? 'text-[#f43f5e] border-[#f43f5e]/50 bg-[#290916]'
                : getDangerColor(item.dangerLevel)
            }`}
          >
            {isEasterEgg ? 'Boneka Bernyawa' : `Aura ${item.dangerLevel}`}
          </span>
          {!item.imageUrl && getStatusBadge()}
        </div>

        {/* Item Name */}
        <h3 className="text-lg font-cinzel font-bold text-[#f5eee2] tracking-wide group-hover:text-[#f87171] transition-colors duration-300">
          {item.name}
        </h3>

        {/* Condition label */}
        <div className="flex items-center gap-2 mt-1 mb-3">
          <span className="text-[11px] text-[#786c82] font-cinzel">Kondisi:</span>
          <span className="text-xs font-playfair italic text-[#d4af37]">
            {item.condition}
          </span>
        </div>

        {/* Mystic Description */}
        <p className="text-xs text-[#a99ea7] font-playfair italic line-clamp-3 leading-relaxed border-l-2 border-[#3e1f32] pl-2.5 py-0.5 bg-[#171221]/40">
          "{item.description}"
        </p>

        {/* Vault Location / Date */}
        {item.location && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#71647a] font-mono">
            <MapPin className="w-3 h-3 text-[#a855f7]/80 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}
      </div>

      {/* Stock Management & Footer Actions */}
      <div className="p-4 pt-2 bg-[#0e0a15] border-t border-[#23182b] mt-3">
        {/* Stock Stepper */}
        <div className="flex items-center justify-between py-2 px-3 bg-[#15101f] border border-[#2d1e38] mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-cinzel tracking-wider text-[#887893] uppercase">
              Persediaan Stok
            </span>
            <span
              className={`text-xl font-cinzel font-bold ${
                isDepleted
                  ? 'text-[#ef4444]'
                  : isLow
                  ? 'text-[#f59e0b]'
                  : 'text-[#e9d5ff]'
              }`}
            >
              {item.stock} <span className="text-xs font-normal text-zinc-500">unit</span>
            </span>
          </div>

          {/* Minus & Plus Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id={`btn-stock-minus-${item.id}`}
              onClick={() => {
                playTock();
                onUpdateStock(item.id, -1);
              }}
              disabled={item.stock <= 0}
              title="Kurangi 1 stok"
              className="w-8 h-8 rounded-none bg-[#1d1628] hover:bg-[#341b31] disabled:opacity-30 disabled:cursor-not-allowed border border-[#3b2745] hover:border-[#ef4444] text-[#d6cbdc] hover:text-[#ef4444] flex items-center justify-center transition-all duration-200"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <button
              id={`btn-stock-plus-${item.id}`}
              onClick={() => {
                playTock();
                onUpdateStock(item.id, 1);
              }}
              title="Tambah 1 stok"
              className="w-8 h-8 rounded-none bg-[#1d1628] hover:bg-[#1a2f26] border border-[#3b2745] hover:border-[#10b981] text-[#d6cbdc] hover:text-[#34d399] flex items-center justify-center transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Easter Egg Special Interaction Button */}
        {isEasterEgg && (
          <button
            id={`btn-darina-chime-${item.id}`}
            onClick={handleDarinaInteract}
            className="w-full mb-2.5 py-1.5 px-3 bg-[#2d0f1c] hover:bg-[#48142b] border border-[#fb7185]/60 hover:border-[#fb7185] text-[#ffe4e6] text-xs font-cinzel tracking-wider flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fb7185]" />
            <span>Dengarkan Kotak Musik Darina</span>
          </button>
        )}

        {/* Action Buttons: Edit and Banish/Exorcise */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`btn-edit-${item.id}`}
            onClick={() => onEdit(item)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#171322] hover:bg-[#261d36] text-[#b8adbf] hover:text-[#f3ede2] border border-[#33233f] text-xs font-cinzel tracking-wider transition-colors duration-200"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>Ubah Prasasti</span>
          </button>

          <button
            id={`btn-banish-${item.id}`}
            onClick={() => onBanish(item)}
            title="Usir dan musnahkan artefak ke jurang kegelapan"
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#1c0f16] hover:bg-[#3b121d] text-[#e0a6b1] hover:text-[#fee2e2] border border-[#521c27] hover:border-[#dc2626] text-xs font-cinzel tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_0_12px_rgba(220,38,38,0.4)]"
          >
            <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>Banish / Usir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
