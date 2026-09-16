import React, { useState } from 'react';
import { X, Copy, Check, Palette, Sparkles, BookOpen, Layers } from 'lucide-react';
import { playTock } from '../utils/audio';

interface GothicDesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GothicDesignSystemModal: React.FC<GothicDesignSystemModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    playTock();
    navigator.clipboard.writeText(text);
    setCopiedHex(label);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const colorPalette = [
    {
      label: 'Background Utama (Abyssal Void)',
      hex: '#09080d',
      desc: 'Latar belakang kanvas hitam gelap bernuansa obsidian dingin.',
    },
    {
      label: 'Permukaan Kartu (Crypt Stone)',
      hex: '#110e19',
      desc: 'Warna latar untuk kartu artefak, kontras lembut dengan aksen runic.',
    },
    {
      label: 'Gothic Crimson (Aksen Utama)',
      hex: '#991b1b',
      desc: 'Warna darah ritual untuk tombol penting, hover, dan status bahaya.',
    },
    {
      label: 'Eerie Violet (Aura Mistis)',
      hex: '#7c3aed',
      desc: 'Warna neon ungu redup untuk border fokus dan highlight sihir.',
    },
    {
      label: 'Teks Utama (Parchment Bone)',
      hex: '#f5eee2',
      desc: 'Warna teks krem merang/tulang kuno dengan kontras tinggi WCAG AA.',
    },
    {
      label: 'Teks Sekunder (Muted Ashes)',
      hex: '#a99ea7',
      desc: 'Warna teks abu perak redup untuk deskripsi dan metadata.',
    },
    {
      label: 'Peringatan / Menipis (Occult Amber)',
      hex: '#f59e0b',
      desc: 'Aksen peringatan stok menipis dan artefak mencurigakan.',
    },
    {
      label: 'Status Lenyap (Blood Annihilate)',
      hex: '#ef4444',
      desc: 'Status stok habis / lenyap ditelan kegelapan malam.',
    },
  ];

  const gothicGlossary = [
    { conventional: 'Add Item / Tambah', gothic: 'Summon Relic / Panggil Artefak' },
    { conventional: 'Delete / Hapus', gothic: 'Exorcise / Banish / Annihilate' },
    { conventional: 'Edit / Ubah', gothic: 'Recast Sigil / Ubah Inskripsi' },
    { conventional: 'Out of Stock / Habis', gothic: 'Lenyap Ditelan Malam / Voided' },
    { conventional: 'Low Stock / Menipis', gothic: 'Aura Menipis / Fading Essence' },
    { conventional: 'Available / Tersedia', gothic: 'Utuh Bersemayam / Abundant' },
    { conventional: 'Search / Cari', gothic: 'Teropong Kegelapan / Seek Omens' },
    { conventional: 'Inventory / Gudang', gothic: 'Kriptus Reliquarium / Crypt Vault' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div
        id="modal-design-system-guide"
        className="relative w-full max-w-3xl bg-[#0e0b16] border border-[#59223e] shadow-[0_0_50px_rgba(124,58,237,0.3)] max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Ancient Gothic Corner Ornaments */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#a855f7] pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#a855f7] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#991b1b] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#991b1b] pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 border-b border-[#2d1b2a] bg-gradient-to-r from-[#170e1c] via-[#110d18] to-[#1c0d16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#21122a] border border-[#6b21a8]">
              <Palette className="w-5 h-5 text-[#c084fc]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-cinzel font-bold text-[#f7eee1] tracking-wide">
                Panduan Desain Dark Gothic Victorian
              </h2>
              <p className="text-xs font-playfair italic text-[#a394a8]">
                Design System, Spesifikasi Warna Hex, Mikro-teks Mistis & Komponen CSS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#25101a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Color Palette */}
          <div>
            <h3 className="text-sm font-cinzel font-bold text-[#fed7aa] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#991b1b] rotate-45 inline-block" />
              1. Kombinasi Warna Spesifik (Hex Palette)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {colorPalette.map((c) => (
                <div
                  key={c.hex}
                  className="p-3 bg-[#130f1e] border border-[#2d1f35] flex items-center justify-between gap-3 group hover:border-[#a855f7]/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 shrink-0 border border-white/20 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-cinzel font-bold text-[#ece4d6] truncate">
                        {c.label}
                      </div>
                      <div className="text-[11px] font-mono text-[#a855f7] tracking-wider">
                        {c.hex}
                      </div>
                      <div className="text-[10px] text-[#86788f] font-playfair italic line-clamp-1">
                        {c.desc}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(c.hex, c.label)}
                    title="Salin Hex Code"
                    className="p-1.5 bg-[#1b1525] border border-[#3b2847] hover:border-[#a855f7] text-[#c4b5cc] hover:text-white transition-all text-xs shrink-0"
                  >
                    {copiedHex === c.label ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Gothic Microcopy Lexicon */}
          <div>
            <h3 className="text-sm font-cinzel font-bold text-[#fed7aa] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#991b1b] rotate-45 inline-block" />
              2. Istilah Pengganti UI Konvensional (Gothic Lexicon)
            </h3>
            <div className="overflow-x-auto border border-[#2d1f35] bg-[#120e1a]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2d1f35] bg-[#1a1224] text-[#bdaebd] font-cinzel tracking-wider uppercase">
                    <th className="p-3">Istilah Standar UI</th>
                    <th className="p-3">Gothic / Victorian Microcopy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23172b]">
                  {gothicGlossary.map((row) => (
                    <tr key={row.conventional} className="hover:bg-[#1a1324] transition-colors">
                      <td className="p-3 text-[#9f92a5] font-mono">{row.conventional}</td>
                      <td className="p-3 font-cinzel font-bold text-[#f5eedf]">
                        {row.gothic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Border & Shadow Recipes */}
          <div>
            <h3 className="text-sm font-cinzel font-bold text-[#fed7aa] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#991b1b] rotate-45 inline-block" />
              3. Gaya Border & Bayangan (Artefak Kuno / Peti Mati)
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-[#140f1f] border border-[#3b2848] text-xs">
                <div className="font-cinzel font-bold text-[#e6ddcf] mb-1">
                  Aura Neon Merah Darah (Crimson Bloom):
                </div>
                <code className="block p-2 bg-[#09070e] text-[#ef4444] font-mono text-[11px] border border-[#3a151e] overflow-x-auto">
                  box-shadow: 0 0 25px rgba(185, 28, 28, 0.35), 0 0 6px rgba(239, 68, 68, 0.2);
                </code>
              </div>

              <div className="p-4 bg-[#140f1f] border border-[#3b2848] text-xs">
                <div className="font-cinzel font-bold text-[#e6ddcf] mb-1">
                  Aura Ungu Kriptus (Violet Twilight):
                </div>
                <code className="block p-2 bg-[#09070e] text-[#c084fc] font-mono text-[11px] border border-[#2b173c] overflow-x-auto">
                  box-shadow: 0 0 25px rgba(147, 51, 234, 0.35), 0 0 6px rgba(168, 85, 247, 0.2);
                </code>
              </div>

              <div className="p-4 bg-[#140f1f] border border-[#3b2848] text-xs">
                <div className="font-cinzel font-bold text-[#e6ddcf] mb-1">
                  Tipografi Khas (Google Fonts):
                </div>
                <div className="text-[#a496ab] font-playfair italic mt-1 leading-relaxed">
                  Headings menggunakan font <strong>'Cinzel'</strong> dengan letter-spacing lebar, body teks menggunakan <strong>'Playfair Display'</strong> italic untuk kesan dokumen kuno abad pertengahan.
                </div>
              </div>

              <div className="p-4 bg-[#140f1f] border border-[#3b2848] text-xs">
                <div className="font-cinzel font-bold text-[#e6ddcf] mb-1">
                  Koleksi Lengkap Busana Fashion Gothic & Instrumen Musik Akustik:
                </div>
                <div className="text-[#a496ab] font-playfair italic mt-1 leading-relaxed">
                  Kategori <strong>Fashion</strong> kini memuat koleksi busana lengkap: Gaun Malam Berkabung Victoria Hitam, Korset Brokat Renda Tulang Baja, Jubah Beludru Bulu Burung Gagak, Kerudung Renda Spanyol & Mahkota Mawar Hitam, Sepatu Boots Platform Demon Spikes, Sarung Tangan Beludru Opera, Cakar Armor Jari Perak Berengsel (Claw Ring), Cincin Rahasia Bat Poison Ring, Overcoat Dandy Wol Hitam, Harness Pentagram, hingga Topeng Dokter Wabah (Plague Doctor). Dilengkapi pemutar <strong>Instrumen Gothic Klasik Katedral Nyata</strong> (Organ Pipa BWV 565 Bach, Danse Macabre Saint-Saëns, & Moonlight Sonata Beethoven).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2d1b2a] bg-[#110c18] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1d1627] hover:bg-[#2b1f3a] border border-[#432d4e] text-[#ede4d8] text-xs font-cinzel tracking-wider transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
