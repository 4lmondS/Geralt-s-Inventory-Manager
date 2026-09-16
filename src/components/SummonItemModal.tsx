import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Minus, Skull, Flame, Image as ImageIcon } from 'lucide-react';
import { GothicItem, DangerLevel } from '../types';
import { CONDITIONS, DANGER_LEVELS, GOTHIC_PRESET_IMAGES } from '../data/initialData';
import { playThunder, playGothicBell, playTock } from '../utils/audio';

interface SummonItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<GothicItem, 'id' | 'dateAdded'>, editId?: string) => void;
  editItem: GothicItem | null;
  existingCategories: string[];
}

export const SummonItemModal: React.FC<SummonItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
  existingCategories,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Altar');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [stock, setStock] = useState<number>(1);
  const [condition, setCondition] = useState('Sempurna');
  const [dangerLevel, setDangerLevel] = useState<DangerLevel>('Aman');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  const availableCategories = existingCategories.filter((c) => c !== 'Semua');

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      if (availableCategories.includes(editItem.category)) {
        setCategory(editItem.category);
        setIsCustomCat(false);
        setCustomCategory('');
      } else {
        setIsCustomCat(true);
        setCustomCategory(editItem.category);
      }
      setStock(editItem.stock);
      setCondition(editItem.condition);
      setDangerLevel(editItem.dangerLevel || 'Aman');
      setDescription(editItem.description);
      setLocation(editItem.location || '');
      setImageUrl(editItem.imageUrl || '');
    } else {
      setName('');
      setCategory(availableCategories[0] || 'Altar');
      setIsCustomCat(false);
      setCustomCategory('');
      setStock(1);
      setCondition('Sempurna');
      setDangerLevel('Aman');
      setDescription('');
      setLocation('Kriptus Utama');
      setImageUrl(GOTHIC_PRESET_IMAGES[0]?.url || '');
    }
    setErrorMsg('');
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama artefak mistis wajib diisi sebelum pemanggilan.');
      return;
    }

    const finalCategory = isCustomCat ? customCategory.trim() : category;
    if (!finalCategory) {
      setErrorMsg('Tentukan sektor kategori artefak.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Tuliskan sedikit inskripsi atau deskripsi mistis mengenai artefak.');
      return;
    }

    if (editItem) {
      playGothicBell();
    } else {
      playThunder();
    }

    onSave(
      {
        name: name.trim(),
        category: finalCategory,
        stock: Math.max(0, stock),
        condition,
        dangerLevel,
        description: description.trim(),
        location: location.trim() || 'Ruang Kriptus',
        imageUrl: imageUrl.trim() || undefined,
      },
      editItem?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div
        id="modal-summon-relic"
        className="relative w-full max-w-xl bg-[#0f0c16] border border-[#521c32] shadow-[0_0_50px_rgba(185,28,28,0.35)] overflow-hidden"
      >
        {/* Ancient Gothic Corner Ornaments */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#b91c1c] pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#b91c1c] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#7c3aed] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#7c3aed] pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-5 border-b border-[#2d1b28] bg-gradient-to-r from-[#1c0f18] via-[#120d18] to-[#1a1024] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2d0e19] border border-[#781e35]">
              {editItem ? (
                <Sparkles className="w-5 h-5 text-[#f87171]" />
              ) : (
                <Flame className="w-5 h-5 text-[#ef4444] animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-cinzel font-bold text-[#f7eee1] tracking-wide">
                {editItem ? 'Ubah Inskripsi Artefak' : 'Ritual Pemanggilan Artefak'}
              </h2>
              <p className="text-xs font-playfair italic text-[#9e8f9b]">
                {editItem
                  ? 'Perbaharui catatan dan aura mistis perbendaharaan'
                  : 'Catat artefak baru ke dalam Grimoire Kriptus'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-summon-modal"
            onClick={onClose}
            className="p-1.5 text-[#9e8e9b] hover:text-[#f87171] hover:bg-[#25101a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-[#2b0c14] border border-[#b91c1c] text-xs font-cinzel text-[#fca5a5] flex items-center gap-2">
              <Skull className="w-4 h-4 text-[#ef4444] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Nama Barang */}
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
              Nama Artefak / Barang <span className="text-[#ef4444]">*</span>
            </label>
            <input
              id="input-relic-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Lilin Ritual Hitam, Cermin Obsidian..."
              className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]/40 text-sm text-[#f5eedf] px-3.5 py-2.5 outline-none font-cinzel placeholder-[#6e6377]"
              required
            />
          </div>

          {/* 2. Kategori & Custom Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
                Kategori Artefak
              </label>
              <select
                id="select-relic-category"
                value={isCustomCat ? 'custom' : category}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomCat(true);
                  } else {
                    setIsCustomCat(false);
                    setCategory(e.target.value);
                  }
                }}
                className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#a855f7] text-xs font-cinzel text-[#ede4d8] px-3 py-2.5 outline-none"
              >
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="custom">+ Kategori Baru...</option>
              </select>
            </div>

            {/* Custom Category Input if selected */}
            {isCustomCat ? (
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
                  Nama Kategori Baru
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Kategori mistis baru..."
                  className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#a855f7] text-xs font-cinzel text-[#ede4d8] px-3 py-2.5 outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
                  Kondisi / Kualitas
                </label>
                <select
                  id="select-relic-condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#a855f7] text-xs font-cinzel text-[#ede4d8] px-3 py-2.5 outline-none"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Condition (if custom category active) */}
          {isCustomCat && (
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
                Kondisi / Kualitas
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#a855f7] text-xs font-cinzel text-[#ede4d8] px-3 py-2.5 outline-none"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Jumlah Stok & Tingkat Bahaya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stock Stepper */}
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
                Jumlah Persediaan Stok
              </label>
              <div className="flex items-center border border-[#3c2a47] bg-[#161220]">
                <button
                  type="button"
                  onClick={() => {
                    playTock();
                    setStock((prev) => Math.max(0, prev - 1));
                  }}
                  className="px-3.5 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-[#25101a] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  id="input-relic-stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center bg-transparent border-x border-[#3c2a47] text-sm font-cinzel font-bold text-[#f5eedf] py-2 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    playTock();
                    setStock((prev) => prev + 1);
                  }}
                  className="px-3.5 py-2.5 text-zinc-400 hover:text-emerald-400 hover:bg-[#102419] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Danger Level */}
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
                Aura Tingkat Bahaya
              </label>
              <select
                id="select-danger-level"
                value={dangerLevel}
                onChange={(e) => setDangerLevel(e.target.value as DangerLevel)}
                className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#a855f7] text-xs font-cinzel text-[#ede4d8] px-3 py-2.5 outline-none"
              >
                {DANGER_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Lokasi Penyimpanan Kriptus */}
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
              Lokasi Penyimpanan di Vault / Kriptus
            </label>
            <input
              id="input-relic-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Peti Besi Ruang Perjamuan, Altar Barat..."
              className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#a855f7] text-xs font-cinzel text-[#ede4d8] px-3.5 py-2 outline-none"
            />
          </div>

          {/* 5. Gambar Artefak Gothic (Preset / Custom URL) */}
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#a855f7]" />
              Ilustrasi Gambar Artefak Gothic
            </label>

            {/* Presets Grid */}
            <div className="grid grid-cols-5 gap-2 mb-2.5">
              {GOTHIC_PRESET_IMAGES.map((preset) => {
                const isSelected = imageUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      playTock();
                      setImageUrl(preset.url);
                    }}
                    className={`relative aspect-square border overflow-hidden transition-all ${
                      isSelected
                        ? 'border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-[#ef4444]'
                        : 'border-[#3c2a47] hover:border-[#a855f7] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] font-cinzel text-[#f5eedf] text-center py-0.5 truncate px-1">
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom URL or Clear */}
            <div className="flex items-center gap-2">
              <input
                id="input-relic-image"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Atau masukkan URL gambar custom..."
                className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#a855f7] text-xs font-mono text-[#ded5c7] px-3 py-1.5 outline-none placeholder-[#6e6377]"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="px-2.5 py-1.5 bg-[#20101b] border border-[#481c2d] text-[10px] font-cinzel text-[#f87171] hover:bg-[#3b1223] shrink-0"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>

          {/* 6. Deskripsi Mistis */}
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-[#d4c8db] uppercase mb-1.5">
              Inskripsi / Deskripsi Mistis <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              id="input-relic-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan kutukan, aroma, sejarah, atau mantra perlindungan barang..."
              className="w-full bg-[#161220] border border-[#3c2a47] focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]/40 text-xs md:text-sm font-playfair italic text-[#e3dad0] p-3 outline-none resize-none leading-relaxed placeholder-[#6e6377]"
              required
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-[#2a1b28] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#17131e] border border-[#3b283d] text-[#a497ab] hover:text-[#ede4d8] text-xs font-cinzel tracking-wider transition-colors"
            >
              Batal Ritual
            </button>

            <button
              id="btn-submit-summon"
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#581c1c] hover:brightness-110 border border-[#b91c1c] text-[#fbf7f1] text-xs font-cinzel font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(185,28,28,0.4)] active:scale-98 transition-all"
            >
              {editItem ? 'Simpan Perubahan' : 'Panggil ke Vault (Summon)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
