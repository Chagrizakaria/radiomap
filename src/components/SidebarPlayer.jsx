import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Volume2, VolumeX } from 'lucide-react';
import StaticLogo from './StaticLogo';

const SidebarPlayer = ({ station, isPlaying, onTogglePlay, volume, setVolume, isMuted, setIsMuted, onClose, isDarkMode }) => {
    const [imageError, setImageError] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        // Handle ESC key to close
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    useEffect(() => {
        setImageError(false);
    }, [station]);

    if (!station) return null;

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: window.innerWidth < 768 ? '24px' : '32px',
                position: 'relative',
                background: isDarkMode ? 'rgba(26, 26, 29, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                color: isDarkMode ? '#ffffff' : '#1a1a1f',
                boxShadow: '-10px 0 50px rgba(0,0,0,0.5)',
            }}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: window.innerWidth < 768 ? '16px' : '24px',
                    right: window.innerWidth < 768 ? '16px' : '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    color: '#D4AF37',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                }}
            >
                <X size={20} strokeWidth={2.5} />
            </button>

            {/* Content Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: window.innerWidth < 768 ? '16px' : '24px'
            }}>

                {/* Radio Logo */}
                <div style={{
                    width: window.innerWidth < 768 ? '120px' : '150px',
                    height: window.innerWidth < 768 ? '120px' : '150px',
                    borderRadius: '24px',
                    padding: '4px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #b8941f 100%)',
                    boxShadow: isPlaying
                        ? '0 0 60px rgba(212, 175, 55, 0.6), 0 20px 40px rgba(0, 0, 0, 0.4)'
                        : '0 0 40px rgba(212, 175, 55, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: '#ffffff'
                    }}>
                        {!imageError && station.logo ? (
                            <img
                                src={station.logo}
                                alt={station.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <StaticLogo name={station.name} size={window.innerWidth < 768 ? 112 : 142} />
                        )}
                    </div>
                </div>

                {/* Station Name */}
                <h2 style={{
                    fontSize: window.innerWidth < 768 ? '22px' : '28px',
                    fontWeight: '700',
                    color: isDarkMode ? '#ffffff' : '#1a1a1f',
                    textAlign: 'center',
                    margin: 0,
                    padding: '0 20px'
                }}>
                    {station.name}
                </h2>

                {/* Location */}
                <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#D4AF37',
                    margin: 0
                }}>
                    {station.city}, {station.country}
                </p>

                {/* Play/Pause Button */}
                <button
                    onClick={onTogglePlay}
                    style={{
                        width: window.innerWidth < 768 ? '70px' : '80px',
                        height: window.innerWidth < 768 ? '70px' : '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #D4AF37 0%, #b8941f 100%)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginTop: '8px',
                        boxShadow: '0 10px 40px rgba(212, 175, 55, 0.5)'
                    }}
                >
                    {isPlaying ? (
                        <Pause size={30} fill="white" color="white" strokeWidth={0} />
                    ) : (
                        <Play size={30} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '4px' }} />
                    )}
                </button>

                {/* Volume Slider */}
                <div style={{ width: '100%', maxWidth: '300px', padding: '0 16px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer' }}
                        >
                            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
                            style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(212, 175, 55, 0.2)', accentColor: '#D4AF37' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarPlayer;
