import React from 'react';
import { Play, Heart } from 'lucide-react';
import CountryFlag from './CountryFlag';
import StaticLogo from './StaticLogo';

const StationCard = ({ station, onStationClick, onToggleFavorite, isFavorite, isDarkMode }) => {
    // State to handle image error
    const [imgError, setImgError] = React.useState(false);

    return (
        <div
            style={{
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '24px',
                border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: isDarkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.border = '1px solid rgba(212, 175, 55, 0.5)';
                e.currentTarget.style.boxShadow = isDarkMode ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.3)' : '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(212, 175, 55, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.border = isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.05)';
                e.currentTarget.style.boxShadow = isDarkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.05)';
            }}
            onClick={() => onStationClick(station)}
        >
            {/* Favorite Toggle Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(station);
                }}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0,0,0,0.3)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1,
                    transition: 'all 0.2s ease',
                    color: isFavorite ? '#EF4444' : '#ffffff'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <Heart size={20} fill={isFavorite ? '#EF4444' : 'none'} />
            </button>

            <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 16px',
                borderRadius: '20px',
                padding: '4px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #b8941f 100%)',
                boxShadow: isDarkMode ? '0 0 30px rgba(212, 175, 55, 0.4)' : '0 10px 20px rgba(212, 175, 55, 0.2)'
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#ffffff',
                    position: 'relative'
                }}>
                    {!imgError && station.logo ? (
                        <img
                            src={station.logo}
                            alt={station.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <StaticLogo name={station.name} size={112} />
                    )}
                </div>
            </div>

            <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: isDarkMode ? '#ffffff' : '#1a1a1f',
                marginBottom: '8px',
                textAlign: 'center',
                flexGrow: 1
            }}>
                {station.name}
            </h3>
            <div style={{
                fontSize: '14px',
                color: '#D4AF37',
                marginBottom: '56px', // Make space for the absolute play button
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
            }}>
                <CountryFlag countryCode={station.countryCode} countryName={station.country} size={18} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {station.city}, {station.country}
                </span>
            </div>

            <button
                style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #b8941f 100%)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.5)',
                    transition: 'all 0.3s ease'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onStationClick(station);
                }}
            >
                <Play size={20} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '2px' }} />
            </button>
        </div>
    );
};

export default React.memo(StationCard);
