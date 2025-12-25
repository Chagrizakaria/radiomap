import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const RadioPlayer = ({ station, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (station) {
            audioRef.current.src = station.streamUrl;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Playback failed", e));
        }
        return () => {
            audioRef.current.pause();
            audioRef.current.src = "";
        };
    }, [station]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    if (!station) return null;

    return (
        <div className="w-full h-full flex flex-col items-center p-6 text-center relative">
            {/* Close Button (Top Right of Sidebar) */}
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-colors z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Station Info */}
            <div className="flex flex-col items-center gap-4 mt-8 mb-8 w-full">
                <div className={`w-32 h-32 rounded-2xl overflow-hidden border-4 border-secondary ${isPlaying ? 'shadow-xl shadow-secondary/30 animate-pulse-slow' : ''} flex-shrink-0 flex items-center justify-center bg-white`}>
                    <img
                        src={station.logo}
                        alt={station.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#006270" stroke-width="2"><circle cx="12" cy="12" r="2"></circle></svg>';
                        }}
                    />
                </div>
                <div className="w-full overflow-hidden">
                    <h3 className="font-heading text-2xl font-bold text-primary dark:text-white truncate">{station.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider mt-1">{station.frequency}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{station.city}, {station.country}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 w-full mt-auto mb-8">

                {/* Play/Pause Button */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all shadow-xl hover:scale-105"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-3 w-full px-2">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            setIsMuted(false);
                        }}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                    />
                </div>

                {isPlaying && (
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-bold uppercase tracking-widest">Live</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RadioPlayer;
