import React from 'react';
import { Skull, Flame, AlertOctagon, X } from 'lucide-react';
import { GothicItem } from '../types';
import { playBanishSound, playTock } from '../utils/audio';

interface BanishModalProps {
  item: GothicItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBanish: (id: string) => void;
}

export const BanishModal: React.FC<BanishModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmBanish,
}) => {
  if (!isOpen || !item) return null;

  const handleBanish = () => {
    playBanishSound();
    onConfirmBanish(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div
        id="modal-banish-relic"
        className="relative w-full max-w-md bg-[#120a10] border border-[#7f1d1d] shadow-[0_0_50px_rgba(220,38,38,0.4)] p-6 overflow-hidden"
      >
        {/* Ancient Gothic Ornaments */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ef4444]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ef4444]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ef4444]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ef4444]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-4">
          <div className="mx-auto w-14 h-14 bg-[#260912] border border-[#ef4444]/60 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <Skull className="w-7 h-7 text-[#ef4444] animate-bounce" />
          </div>
          <h3 className="text-lg font-cinzel font-bold text-[#fef2f2] tracking-wider uppercase">
            Upacara Pengusiran (Exorcise / Banish)
          </h3>
          <p className="text-xs font-playfair italic text-[#e0a6b1] mt-1">
            Menghapus keberadaan artefak dari dunia nyata ke jurang kekosongan.
          </p>
        </div>

        {/* Item preview */}
        <div className="p-3.5 bg-[#1a0c14] border border-[#4a1622] mb-5 flex items-center gap-3.5 text-left">
          {item.imageUrl && (
            <div className="w-16 h-16 shrink-0 border border-[#7f1d1d] overflow-hidden bg-black">
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[10px] font-cinzel text-[#a855f7] uppercase tracking-widest block mb-0.5">
              {item.category}
            </span>
            <div className="text-base font-cinzel font-bold text-[#fee2e2] truncate">
              "{item.name}"
            </div>
            <div className="text-xs text-[#9f858f] font-playfair italic mt-0.5 line-clamp-2">
              "{item.description}"
            </div>
          </div>
        </div>

        <p className="text-xs text-[#d1b0b7] font-playfair italic text-center mb-6 leading-relaxed">
          Peringatan: Artefak yang telah diusir (banished) akan lenyap seketika dari catatan vault. Ritual ini tidak dapat dibatalkan.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              playTock();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-[#1b1522] border border-[#3b2842] text-[#c4b5cd] hover:text-[#f5f1eb] text-xs font-cinzel tracking-wider transition-colors"
          >
            Pertahankan
          </button>

          <button
            id="btn-confirm-banish"
            onClick={handleBanish}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#7f1d1d] via-[#dc2626] to-[#7f1d1d] text-[#ffffff] border border-[#ef4444] text-xs font-cinzel font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Exorcise Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
