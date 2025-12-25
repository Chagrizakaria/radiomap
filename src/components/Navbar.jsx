import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Home, Grid, Map, Menu, X, Moon, Sun, Search, Radio } from 'lucide-react';
import Logo from './Logo';
import CountryFlag from './CountryFlag';

const Navbar = ({ isDarkMode, onViewChange, currentView, onMenuToggle, isMenuOpen, toggleTheme, stations = [], onStationSelect, onFlyToStation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    // Filter stations based on search query
    const filteredStations = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase().trim();
        return stations.filter(s =>
            s.name.toLowerCase().includes(query) ||
            (s.city && s.city.toLowerCase().includes(query)) ||
            (s.country && s.country.toLowerCase().includes(query))
        ).slice(0, 10); // Limit to 10 results for performance and UI
    }, [stations, searchQuery]);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStationClick = (station) => {
        if (currentView === 'map') {
            onFlyToStation(station);
        } else {
            onStationSelect(station, false);
        }
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const activeStyle = {
        padding: '8px 20px',
        borderRadius: '20px',
        background: 'rgba(212, 175, 55, 0.15)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(10px)',
        color: isDarkMode ? '#ffffff' : '#b8941f',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'default',
        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
        transition: 'all 0.3s ease'
    };

    const inactiveStyle = {
        padding: '8px 20px',
        borderRadius: '20px',
        background: 'transparent',
        border: '1px solid transparent',
        color: isDarkMode ? '#ffffff' : '#1a1a1f',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav
                className="desktop-only"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2000,
                    height: '80px',
                    background: isDarkMode ? 'rgba(26, 26, 29, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    borderBottom: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '0 0 20px 20px',
                    boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 24px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Logo */}
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                        onClick={() => onViewChange('home')}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                filter: 'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.3))'
                            }}
                        >
                            <Logo size={48} />
                        </div>
                        <div>
                            <h1
                                style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: isDarkMode ? '#ffffff' : '#1a1a1f',
                                    lineHeight: '1',
                                    letterSpacing: '-0.02em',
                                    margin: 0,
                                    textShadow: isDarkMode ? '0 2px 20px rgba(0, 0, 0, 0.5)' : 'none'
                                }}
                            >
                                RadioMap
                            </h1>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: isDarkMode ? '#D4AF37' : '#b8941f',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)'
                                }}
                            >
                                Worldwide
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => onViewChange('home')}
                            style={currentView === 'home' ? activeStyle : inactiveStyle}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => onViewChange('grid')}
                            style={currentView === 'grid' ? activeStyle : inactiveStyle}
                        >
                            Stations
                        </button>
                        <button
                            onClick={() => onViewChange('map')}
                            style={currentView === 'map' ? activeStyle : inactiveStyle}
                        >
                            Map
                        </button>
                    </div>

                    {/* Right Actions: Search, Theme, Live */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }} ref={searchRef}>
                        {/* Search Feature - Only visible in Map View */}
                        {currentView === 'map' && (
                            <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                                    borderRadius: '12px',
                                    padding: '0 12px',
                                    width: isSearchOpen ? '280px' : '44px',
                                    height: '44px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <Search
                                        size={20}
                                        style={{
                                            minWidth: '20px',
                                            color: isSearchOpen ? '#D4AF37' : (isDarkMode ? '#ffffff' : '#1a1a1f'),
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search radio, city, country..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchOpen(true)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: isDarkMode ? '#ffffff' : '#1a1a1f',
                                            fontSize: '14px',
                                            padding: '8px 0',
                                            width: '100%',
                                            outline: 'none',
                                            opacity: isSearchOpen ? 1 : 0,
                                            transition: 'opacity 0.3s ease'
                                        }}
                                    />
                                </div>

                                {/* Search Results Dropdown */}
                                {isSearchOpen && filteredStations.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '55px',
                                        right: 0,
                                        width: '320px',
                                        background: isDarkMode ? '#1a1a1d' : '#ffffff',
                                        borderRadius: '16px',
                                        border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                                        boxShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.12)',
                                        overflow: 'hidden',
                                        zIndex: 2100
                                    }}>
                                        {filteredStations.map((station) => (
                                            <div
                                                key={station.id}
                                                onClick={() => handleStationClick(station)}
                                                style={{
                                                    padding: '12px 16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s ease',
                                                    borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? 'rgba(212, 175, 55, 0.1)' : '#f8f9fa'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {station.logo ? (
                                                        <img src={station.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                    ) : (
                                                        <Radio size={20} color="#D4AF37" />
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#1a1a1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {station.name}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <CountryFlag countryCode={station.countryCode} size={12} />
                                                        {station.city}, {station.country}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            onClick={toggleTheme}
                            style={{
                                padding: '10px',
                                borderRadius: '12px',
                                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                                color: isDarkMode ? '#D4AF37' : '#1a1a1f',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button
                            onClick={() => onViewChange('grid')}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #b8941f 100%)',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#E74C3C',
                                animation: 'pulse 2s ease-in-out infinite'
                            }} />
                            Live Radios
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Top Bar */}
            <div className="mobile-only" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                zIndex: 2000,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isDarkMode ? 'rgba(26, 26, 29, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Logo size={32} />
                    <span style={{ fontSize: '18px', fontWeight: '800', color: isDarkMode ? '#fff' : '#1a1a1f' }}>RadioMap</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Live Button (Mobile) */}
                    <button
                        onClick={() => onViewChange('grid')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #b8941f 100%)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                        }}
                    >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff4d4d', animation: 'pulse 1.5s infinite' }} />
                        Live
                    </button>

                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: isSearchOpen ? 'rgba(212, 175, 55, 0.1)' : 'none',
                            border: 'none',
                            color: isSearchOpen ? '#D4AF37' : (isDarkMode ? '#fff' : '#1a1a1f'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Search size={22} />
                    </button>

                    <button
                        onClick={toggleTheme}
                        style={{ background: 'none', border: 'none', color: isDarkMode ? '#fff' : '#1a1a1f' }}
                    >
                        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="mobile-only" style={{
                    position: 'fixed',
                    top: '60px',
                    left: 0,
                    right: 0,
                    padding: '16px',
                    background: isDarkMode ? '#1a1a1d' : '#ffffff',
                    zIndex: 1999,
                    borderBottom: '1px solid rgba(128,128,128,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f0f0f0',
                        padding: '12px',
                        borderRadius: '12px'
                    }}>
                        <Search size={18} color="#888" />
                        <input
                            autoFocus
                            placeholder="Search stations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: isDarkMode ? '#fff' : '#000',
                                width: '100%',
                                fontSize: '16px'
                            }}
                        />
                        {searchQuery && (
                            <X size={18} onClick={() => setSearchQuery('')} />
                        )}
                    </div>
                    {/* Mobile Results */}
                    {filteredStations.length > 0 && (
                        <div style={{ maxHeight: '60vh', overflowY: 'auto', marginTop: '12px' }}>
                            {filteredStations.map(station => (
                                <div
                                    key={station.id}
                                    onClick={() => handleStationClick(station)}
                                    style={{ padding: '12px 0', borderBottom: '1px solid rgba(128,128,128,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}
                                >
                                    <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {station.logo ? <img src={station.logo} width="100%" height="100%" style={{ borderRadius: 6 }} /> : <Radio size={16} color="#333" />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: isDarkMode ? '#fff' : '#000' }}>{station.name}</div>
                                        <div style={{ fontSize: '12px', color: '#888' }}>{station.city}, {station.country}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-only mobile-bottom-nav">
                <button
                    className={`nav-item-mobile ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => onViewChange('home')}
                >
                    <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
                    <span>Home</span>
                </button>
                <button
                    className={`nav-item-mobile ${currentView === 'grid' ? 'active' : ''}`}
                    onClick={() => onViewChange('grid')}
                >
                    <Grid size={24} strokeWidth={currentView === 'grid' ? 2.5 : 2} />
                    <span>Stations</span>
                </button>
                <button
                    className={`nav-item-mobile ${currentView === 'map' ? 'active' : ''}`}
                    onClick={() => onViewChange('map')}
                >
                    <Map size={24} strokeWidth={currentView === 'map' ? 2.5 : 2} />
                    <span>Map</span>
                </button>
            </nav>

            {/* Mobile Navbar Overlay (Omitted for brevity, assuming standard mobile burger implementation would be here if present) */}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </>
    );
};

export default Navbar;
