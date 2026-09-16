import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Plus,
  BookOpen,
  Skull,
  Music,
  Play,
  Pause,
  Info,
  Bell,
  Zap,
  Disc,
} from 'lucide-react';
import {
  GOTHIC_TRACKS,
  GothicTrack,
  subscribeAudioState,
  startAmbientMusic,
  stopAmbientMusic,
  toggleAmbientMusic,
  seekTrack,
  setAmbientVolume,
  setAudioMuted,
  playGothicBell,
  playThunder,
  playTock,
} from '../utils/audio';

interface GothicHeaderProps {
  onOpenSummonModal: () => void;
  onOpenDesignSystem: () => void;
  onResetData: () => void;
}

export const GothicHeader: React.FC<GothicHeaderProps> = ({
  onOpenSummonModal,
  onOpenDesignSystem,
  onResetData,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<GothicTrack>(GOTHIC_TRACKS[0]);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTrackList, setShowTrackList] = useState(false);
  const [gothicTime, setGothicTime] = useState('');

  useEffect(() => {
    // Subscribe to reactive audio engine updates
    const unsubscribe = subscribeAudioState((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.track);
      setVolume(Math.round(state.volume * 100));
      setMuted(state.muted);
      setCurrentTime(state.currentTime);
      setDuration(state.duration);
    });

    // Vault clock
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setGothicTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleTogglePlay = () => {
    playTock();
    toggleAmbientMusic();
  };

  const handleToggleMute = () => {
    playTock();
    setAudioMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setAmbientVolume(val / 100);
    if (val > 0 && muted) {
      setAudioMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seekTrack(val);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <header className="relative border-b border-[#2d1b28] bg-[#0c0a12]/95 backdrop-blur-md px-4 py-5 md:px-8">
      {/* Decorative top crimson hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#991b1b] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Brand & Crest */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="relative w-14 h-14 rounded-none bg-[#171221] border border-[#581c3f] flex items-center justify-center shadow-[0_0_15px_rgba(153,27,27,0.3)] group transition-all duration-500 hover:border-[#991b1b]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a1226]/30 to-transparent" />
            <Skull className="w-7 h-7 text-[#d8b4b8] group-hover:text-[#ef4444] transition-colors duration-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#991b1b] rotate-45" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#991b1b] rotate-45" />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#a855f7] font-semibold">
                Sanctum Reliquarium
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-[11px] font-mono tracking-wider text-[#9f9486]">
                Kriptus {gothicTime}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-[#f2ebe0] tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              GOTHIC INVENTORY VAULT
            </h1>
            <p className="text-xs md:text-sm text-[#9c9384] font-playfair italic">
              Pengelola Artefak, Busana Fashion Gothic & Musik Instrumental Katedral Kuno
            </p>
          </div>
        </div>

        {/* Authentic Gothic Instrumental Music Player Console */}
        <div className="flex items-center flex-wrap justify-center lg:justify-end gap-3">
          {/* Instrumental Audio Player Box */}
          <div className="relative flex items-center gap-2 px-3 py-2 bg-[#120d1c] border border-[#482845] shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            {/* Play/Pause Button */}
            <button
              id="btn-toggle-ambient-music"
              onClick={handleTogglePlay}
              title={isPlaying ? 'Jeda Danse Macabre' : 'Putar Danse Macabre, Op. 40'}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-cinzel tracking-wider transition-all duration-300 ${
                isPlaying
                  ? 'bg-[#3e1335] text-[#fbcfe8] border border-[#c084fc] shadow-[0_0_12px_rgba(192,132,252,0.4)]'
                  : 'bg-[#1a1226] text-[#c9bfcb] hover:text-[#f3ede2] border border-[#3b233a] hover:border-[#a855f7]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span className="text-[11px] font-semibold">Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span className="text-[11px] font-semibold">Putar Musik</span>
                </>
              )}
            </button>

            {/* Track Info & Popover Trigger */}
            <div className="relative">
              <button
                id="btn-track-info-popover"
                onClick={() => {
                  playTock();
                  setShowTrackList(!showTrackList);
                }}
                className="flex items-center gap-2 px-2.5 py-1 bg-[#1a1329] border border-[#3f2746] hover:border-[#a855f7] text-left transition-colors group"
                title="Informasi Mahakarya Gothic: Danse Macabre, Op. 40"
              >
                <Disc className={`w-3.5 h-3.5 text-[#ec4899] ${isPlaying ? 'animate-spin' : ''}`} />
                <div className="max-w-[150px] sm:max-w-[190px] truncate">
                  <div className="text-[10px] text-[#c084fc] font-mono tracking-wide flex items-center gap-1">
                    <span className="truncate">{currentTrack.badge}</span>
                  </div>
                  <div className="text-[11px] font-cinzel font-bold text-[#f3ede2] truncate">
                    {currentTrack.title}
                  </div>
                </div>
                <Info className="w-3 h-3 text-[#a496ab] group-hover:text-[#ec4899] transition-colors" />
              </button>

              {/* Danse Macabre Detail Popover */}
              {showTrackList && (
                <div
                  id="menu-gothic-track-detail"
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0f0b17] border border-[#58264d] shadow-[0_10px_30px_rgba(0,0,0,0.95)] z-50 p-4"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2b182d]">
                    <div className="flex items-center gap-2 text-xs font-cinzel text-[#f3ede2] font-bold">
                      <Music className="w-4 h-4 text-[#ec4899]" />
                      <span>Mahakarya Musik Katedral</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a855f7]">
                      {currentTrack.era}
                    </span>
                  </div>

                  <div className="bg-[#1a1226] border border-[#442340] p-3 text-left">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 bg-[#401639] text-[#f5d0fe] border border-[#78286a] font-mono uppercase">
                        {currentTrack.badge}
                      </span>
                      <span className="text-[10px] text-[#fed7aa] font-mono">
                        Eksklusif Vault
                      </span>
                    </div>
                    <h4 className="text-sm font-cinzel font-bold text-[#f5ede2] mt-1">
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs text-[#c084fc] font-playfair italic mt-0.5">
                      Komponis: {currentTrack.composer}
                    </p>
                    <p className="text-[11px] text-[#a99ea7] font-playfair italic leading-relaxed mt-2 border-t border-[#301c34] pt-2">
                      {currentTrack.description}
                    </p>
                  </div>

                  <div className="mt-2.5 text-[10px] text-[#817288] font-playfair italic text-center">
                    Rekaman orkestra simfoni akustik asli — petikan harpa, gesekan biola mistis tengah malam, dan genta lonceng pekuburan.
                  </div>
                </div>
              )}
            </div>

            {/* Volume slider & quick Mute */}
            <div className="hidden sm:flex items-center gap-2 border-l border-[#2e1d33] pl-2">
              <button
                id="btn-toggle-sound-mute"
                onClick={handleToggleMute}
                title={muted ? 'Batal Bisukan Suara' : 'Bisukan Suara'}
                className="text-[#9e92a4] hover:text-[#f3ede2] transition-colors"
              >
                {muted ? (
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#a855f7]" />
                )}
              </button>
              <input
                id="slider-ambient-volume"
                type="range"
                min="0"
                max="100"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                title={`Volume Suara: ${volume}%`}
                className="w-16 h-1 bg-[#251833] accent-[#a855f7] cursor-pointer"
              />
            </div>

            {/* Atmospheric Sound SFX Test Buttons */}
            <div className="hidden md:flex items-center gap-1 border-l border-[#2e1d33] pl-2">
              <button
                id="btn-play-bell-sfx"
                onClick={() => playGothicBell()}
                title="Bunyikan Genta Katedral"
                className="p-1 text-[#8f8296] hover:text-[#e9d5ff] hover:bg-[#20142e] transition-colors"
              >
                <Bell className="w-3 h-3 text-[#c084fc]" />
              </button>
              <button
                id="btn-play-thunder-sfx"
                onClick={() => playThunder()}
                title="Gemuruh Petir Malam"
                className="p-1 text-[#8f8296] hover:text-[#fed7aa] hover:bg-[#20142e] transition-colors"
              >
                <Zap className="w-3 h-3 text-[#f59e0b]" />
              </button>
            </div>
          </div>

          {/* Design System Guide Modal trigger */}
          <button
            id="btn-design-guide"
            onClick={onOpenDesignSystem}
            className="flex items-center gap-2 px-3 py-2 bg-[#16121f] border border-[#482845] hover:border-[#a855f7] text-[#c9bfcb] hover:text-[#f3ede2] text-xs font-cinzel tracking-wider transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.15)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#c084fc]" />
            <span className="hidden sm:inline">Panduan Desain UI</span>
          </button>

          {/* Reset to initial data */}
          <button
            id="btn-reset-data"
            onClick={onResetData}
            title="Pulihkan data artefak ke kondisi mula"
            className="px-3 py-2 bg-[#120d18] border border-[#2b1e2e] text-[#8c8291] hover:text-[#d4af37] hover:border-[#d4af37]/40 text-xs font-cinzel tracking-wider transition-all duration-300"
          >
            Reset
          </button>

          {/* Summon / Add Item Button */}
          <button
            id="btn-summon-relic"
            onClick={onOpenSummonModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#581c1c] text-[#fbf7f1] font-cinzel font-semibold text-xs md:text-sm tracking-widest uppercase border border-[#b91c1c] shadow-[0_0_18px_rgba(185,28,28,0.45)] hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:brightness-110 active:scale-98 transition-all duration-300"
          >
            <Plus className="w-4 h-4 text-[#fed7aa]" />
            <span>Panggil Barang</span>
          </button>
        </div>
      </div>

      {/* Track Player Bar Details (Timeline, Scrubber & Instrument Meta) */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-[#231526]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#9d8ea4]">
        <div className="flex items-center flex-wrap gap-2 font-mono">
          <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-[#ec4899] animate-pulse' : 'text-[#786481]'}`} />
          <span className="text-[#817288]">Instrumen Aktif:</span>
          <span className="text-[#f5d0fe] font-cinzel font-bold">
            {currentTrack.title}
          </span>
          <span className="text-[#c084fc] font-playfair italic">
            — {currentTrack.instrument}
          </span>
        </div>

        {/* Scrubber & Time Stamp */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#9a8d9f]">
          <span>{formatTime(currentTime)}</span>
          <input
            id="slider-track-progress"
            type="range"
            min="0"
            max={duration > 0 ? duration : 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-28 sm:w-44 h-1 bg-[#251833] accent-[#ec4899] cursor-pointer"
            title="Navigasi Durasi Lagu"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </header>
  );
};
