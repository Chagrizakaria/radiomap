import React, { useState, useMemo } from 'react';
import { Globe, Music, Mic, Trophy, Film, Heart, ArrowLeft, TrendingUp, Clock } from 'lucide-react';

import CountryFlag from './CountryFlag';
import StationCard from './StationCard';
import SearchInput from './SearchInput';

const HomePage = ({ stations, onStationClick, onCategoryClick, favorites, history = [], toggleFavorite, isFavorite, isDarkMode }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Main categories
    const mainCategories = [
        { id: 'favorites', name: 'My Favorites', icon: Heart, color: '#EF4444' },
        { id: 'recently-played', name: 'Recently Played', icon: Clock, color: '#6366F1' },
        { id: 'countries', name: 'By Country', icon: Globe, color: '#3B82F6' },
        { id: 'music', name: 'Music', icon: Music, color: '#10B981' },
        { id: 'news', name: 'News & Talk', icon: Mic, color: '#F59E0B' },
        { id: 'sports', name: 'Sports', icon: Trophy, color: '#EF4444' },
        { id: 'entertainment', name: 'Entertainment', icon: Film, color: '#8B5CF6' },
        { id: 'popular', name: 'Most Popular', icon: TrendingUp, color: '#FF7E5F' }
    ];

    // Get all unique countries
    const countries = useMemo(() => {
        const countryMap = {};
        stations.forEach(station => {
            const country = station.country || 'Unknown';
            const code = station.countryCode || '';
            if (!countryMap[country]) {
                countryMap[country] = { name: country, count: 0, code: code };
            }
            if (!countryMap[country].code && code) {
                countryMap[country].code = code;
            }
            countryMap[country].count++;
        });
        return Object.values(countryMap).sort((a, b) => b.count - a.count);
    }, [stations]);

    // Filter stations based on selection and search
    const filteredStations = useMemo(() => {
        let result = [];

        if (!selectedCategory) return [];

        if (selectedCategory === 'favorites') {
            result = favorites;
        } else if (selectedCategory === 'recently-played') {
            result = history;
        } else if (selectedCategory === 'countries') {
            if (selectedSubCategory) {
                result = stations.filter(s => s.country === selectedSubCategory);
            } else {
                return [];
            }
        } else if (selectedCategory === 'popular') {
            result = stations.slice(0, 100);
        } else {
            // Filter by tags
            result = stations.filter(station => {
                const tags = (station.tags || []).map(t => t.toLowerCase());
                const name = station.name.toLowerCase();

                if (selectedCategory === 'music') {
                    return tags.some(t =>
                        ['music', 'pop', 'rock', 'jazz', 'classical', 'dance', 'electronic', 'hip', 'rap', 'metal', 'indie', 'folk', 'blues', 'country', 'reggae', 'soul', 'funk', 'disco'].some(genre => t.includes(genre))
                    ) || name.includes('music') || name.includes('fm') || name.includes('hits');
                }
                if (selectedCategory === 'news') {
                    return tags.some(t => ['news', 'talk', 'information', 'current', 'affairs'].some(word => t.includes(word))) || name.includes('news') || name.includes('talk') || name.includes('info');
                }
                if (selectedCategory === 'sports') {
                    return tags.some(t => ['sport', 'football', 'soccer', 'basketball', 'baseball'].some(word => t.includes(word))) || name.includes('sport') || name.includes('espn');
                }
                if (selectedCategory === 'entertainment') {
                    return tags.some(t => ['entertainment', 'variety', 'comedy', 'culture'].some(word => t.includes(word))) || name.includes('entertainment') || name.includes('variety');
                }
                return false;
            });

            if (result.length === 0 && selectedCategory !== 'favorites') {
                result = stations.slice(0, 100);
            } else {
                result = result.slice(0, 100);
            }
        }

        // Apply search filter (unified logic)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(station =>
                station.name.toLowerCase().includes(query) ||
                station.country.toLowerCase().includes(query) ||
                station.city.toLowerCase().includes(query) ||
                (station.tags || []).join(' ').toLowerCase().includes(query)
            );
        }

        return result;
    }, [stations, selectedCategory, selectedSubCategory, searchQuery, favorites]);

    const filteredCountries = useMemo(() => {
        if (!searchQuery) return countries;
        return countries.filter(country =>
            country.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [countries, searchQuery]);

    const handleBack = () => {
        setSearchQuery('');
        if (selectedSubCategory) {
            setSelectedSubCategory(null);
        } else {
            setSelectedCategory(null);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: isDarkMode
                ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a1f 100%)'
                : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            paddingTop: '100px',
            paddingBottom: '60px'
        }}>
            {/* Search Bar (Unified) */}
            <div style={{ padding: '0 24px', marginBottom: selectedCategory ? '20px' : '0' }}>
                <SearchInput value={searchQuery} onChange={setSearchQuery} isDarkMode={isDarkMode} />
            </div>

            {/* Hero Section */}
            {!selectedCategory && !searchQuery && (
                <section style={{ padding: '40px 24px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#1a1a1f', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                        Discover World Radio
                    </h1>
                    <p style={{ fontSize: '18px', color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)', marginBottom: '40px' }}>
                        Join thousands listening to stations across the globe
                    </p>
                </section>
            )}

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

                {/* Back Button */}
                {(selectedCategory || searchQuery) && (
                    <button
                        onClick={handleBack}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            background: isDarkMode ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.15)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            color: isDarkMode ? '#D4AF37' : '#b8941f',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginBottom: '32px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = isDarkMode ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.15)'}
                    >
                        <ArrowLeft size={20} />
                        Back to Categories
                    </button>
                )}

                {/* Main Categories (only if not searching or if search is empty) */}
                {!selectedCategory && !searchQuery && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        padding: '20px 0'
                    }}>
                        {mainCategories.map((category) => {
                            const Icon = category.icon;
                            const count = category.id === 'favorites' ? favorites.length :
                                category.id === 'recently-played' ? history.length : null;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    style={{
                                        padding: '40px 24px',
                                        borderRadius: '24px',
                                        background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                        backdropFilter: 'blur(10px)',
                                        border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '16px',
                                        boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = `0 20px 40px ${category.color}30`;
                                        e.currentTarget.style.border = `1px solid ${category.color}80`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0,0,0,0.05)';
                                        e.currentTarget.style.border = isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <Icon size={48} color={category.color} strokeWidth={2} />
                                    <span style={{ fontSize: '22px', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#1a1a1f' }}>
                                        {category.name}
                                    </span>
                                    {count !== null && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '20px',
                                            right: '20px',
                                            background: category.color,
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            fontWeight: '700'
                                        }}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Countries List */}
                {selectedCategory === 'countries' && !selectedSubCategory && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '20px'
                    }}>
                        {filteredCountries.map((country) => (
                            <button
                                key={country.name}
                                onClick={() => setSelectedSubCategory(country.name)}
                                style={{
                                    padding: '24px',
                                    borderRadius: '20px',
                                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                    border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f8f9fa';
                                    e.currentTarget.style.border = '1px solid rgba(212, 175, 55, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
                                    e.currentTarget.style.border = isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.05)';
                                }}
                            >
                                <CountryFlag countryCode={country.code} countryName={country.name} size={32} />
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#1a1a1f', marginBottom: '4px' }}>
                                        {country.name}
                                    </div>
                                    <div style={{ fontSize: '14px', color: isDarkMode ? '#D4AF37' : '#b8941f', fontWeight: '500' }}>
                                        {country.count} stations
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Search Results / Category Grid */}
                {(selectedSubCategory || (selectedCategory && selectedCategory !== 'countries') || (searchQuery && !selectedCategory)) && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#1a1a1f', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {searchQuery && !selectedCategory ? 'Search Results' : (
                                    selectedSubCategory ? (
                                        <>
                                            <CountryFlag countryCode={filteredStations[0]?.countryCode} countryName={selectedSubCategory} size={32} />
                                            {selectedSubCategory}
                                        </>
                                    ) : mainCategories.find(c => c.id === selectedCategory)?.name
                                )}
                                <span style={{ fontSize: '18px', color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontWeight: '500' }}>
                                    ({filteredStations.length} stations)
                                </span>
                            </h2>
                        </div>

                        {filteredStations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '100px 24px', background: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)', borderRadius: '32px', border: isDarkMode ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px dashed rgba(0, 0, 0, 0.1)' }}>
                                <p style={{ fontSize: '20px', color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
                                    {selectedCategory === 'favorites' ? "You haven't added any favorites yet." :
                                        selectedCategory === 'recently-played' ? "You haven't listened to any stations yet." :
                                            "No stations found matching your criteria."}
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '32px'
                            }}>
                                {filteredStations.map((station) => (
                                    <StationCard
                                        key={station.id}
                                        station={station}
                                        onStationClick={onStationClick}
                                        onToggleFavorite={toggleFavorite}
                                        isFavorite={isFavorite(station.id)}
                                        isDarkMode={isDarkMode}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;
