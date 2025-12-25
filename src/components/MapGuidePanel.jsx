import React, { useState } from 'react';
import { Compass, MousePointer2, Radio, Info, X, ChevronRight, ChevronLeft } from 'lucide-react';

const MapGuidePanel = ({ isDarkMode, stationCount = 0 }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            transition: 'all 0.3s ease'
        }}>
            {/* Main Content Panel */}
            <div style={{
                width: isMinimized ? '0' : '320px',
                opacity: isMinimized ? 0 : 1,
                background: isDarkMode ? 'rgba(26, 26, 29, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '24px',
                padding: isMinimized ? '0' : '24px',

                // Theme-aware Edges (Sides)
                borderLeft: isDarkMode
                    ? '4px solid rgba(212, 175, 55, 0.6)'   // Dark Mode: Elegant Gold Accent
                    : '4px solid rgba(220, 220, 225, 0.8)', // Light Mode: Clean Light Gray/Off-White

                borderRight: isDarkMode
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : '1px solid rgba(0, 0, 0, 0.05)',

                borderTop: isDarkMode ? 'none' : '1px solid rgba(255,255,255,0.4)', // Subtle top highlight for light mode
                borderBottom: 'none',

                // Pure Depth Shadow (removed border simulation)
                boxShadow: isDarkMode
                    ? '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    : '0 20px 40px -10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',

                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                transform: isMinimized ? 'translateX(-20px) scale(0.95)' : 'translateX(0) scale(1)',
                pointerEvents: isMinimized ? 'none' : 'auto',
                transformOrigin: 'left center'
            }}>
                {/* Header */}
                <div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: isDarkMode ? '#ffffff' : '#1a1a1f',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <Compass size={28} color="#D4AF37" />
                        Explore Live
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0,0,0,0.6)',
                        lineHeight: '1.5'
                    }}>
                        Navigate the globe and tune in to thousands of live radio stations.
                    </p>
                </div>

                {/* Stats Badge */}
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.03)',
                    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10B981',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1a1a1f' }}>
                        {stationCount > 0 ? stationCount.toLocaleString() : 'Loading...'} Stations Online
                    </span>
                </div>

                {/* Instructions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <MousePointer2 size={20} color="#D4AF37" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#1a1a1f', marginBottom: '4px' }}>
                                Interactive Map
                            </h4>
                            <p style={{ fontSize: '13px', color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0,0,0,0.5)' }}>
                                Drag to pan, scroll to zoom into specific regions or cities.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Radio size={20} color="#D4AF37" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#1a1a1f', marginBottom: '4px' }}>
                                Click to Play
                            </h4>
                            <p style={{ fontSize: '13px', color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0,0,0,0.5)' }}>
                                Tap any marker to instantly start listening to that station.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Hint */}
                <div style={{
                    paddingTop: '16px',
                    borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Info size={14} color={isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0,0,0,0.4)'} />
                    <span style={{ fontSize: '12px', color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0,0,0,0.4)' }}>
                        Clusters expand as you zoom in
                    </span>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: isDarkMode ? 'rgba(26, 26, 29, 0.92)' : 'rgba(255, 255, 255, 0.90)',
                    backdropFilter: 'blur(12px)',
                    // Match panel border logic
                    boxShadow: isDarkMode
                        ? '0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(212, 175, 55, 0.2)'
                        : '0 4px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
                    border: 'none',
                    color: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    marginLeft: '12px',
                    pointerEvents: 'auto',
                    transition: 'all 0.3s ease'
                }}
            >
                {isMinimized ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
        </div>
    );
};

export default MapGuidePanel;
