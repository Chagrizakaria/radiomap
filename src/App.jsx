import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import MapView from './components/MapView';
import SidebarPlayer from './components/SidebarPlayer';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MapGuidePanel from './components/MapGuidePanel';


import CountryFlag from './components/CountryFlag';
import StationCard from './components/StationCard';
import SearchInput from './components/SearchInput';
import { useFavorites } from './hooks/useFavorites';
import { useRadioSearch } from './hooks/useRadioSearch';
import { useRecentlyPlayed } from './hooks/useRecentlyPlayed';
import { useRef } from 'react';

function App() {
  const [stations, setStations] = useState([]);
  const [activeStation, setActiveStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio());

  const [mapCenter, setMapCenter] = useState(null); // Separate state for map movement
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  const [currentView, setCurrentView] = useState('home'); // Default to 'home'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50); // Pagination for grid view

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { history, addToHistory } = useRecentlyPlayed();
  const { searchQuery, setSearchQuery, filteredStations, isSearching } = useRadioSearch(stations);

  // Global Audio Logic
  useEffect(() => {
    if (!activeStation) {
      audioRef.current.pause();
      audioRef.current.src = "";
      setIsPlaying(false);
      return;
    }

    const audio = audioRef.current;

    const loadAndPlay = async () => {
      try {
        audio.pause();
        audio.src = activeStation.streamUrl;
        audio.volume = isMuted ? 0 : volume;
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        if (e.name !== 'AbortError') console.error("Playback failed:", e);
        setIsPlaying(false);
      }
    };

    loadAndPlay();
  }, [activeStation]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!activeStation) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Play failed:", e));
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);


  // Precise coordinates for known stations to ensure they appear exactly where they should
  // Added logo overrides. Setting logo: null FORCES the StaticLogo fallback for stations with bad/missing API images.
  const STATION_OVERRIDES = {
    'hit radio': { city: 'Rabat', coords: [34.0209, -6.8416] },
    'medi 1': { city: 'Tangier', coords: [35.7595, -5.8340] },
    'medi1': { city: 'Tangier', coords: [35.7595, -5.8340] },
    'radio mars': { city: 'Casablanca', coords: [33.5731, -7.5898] },
    'chada fm': { city: 'Casablanca', coords: [33.5899, -7.6039] },

    // START: FORCE STATIC LOGO (Reverted based on user feedback)
    // User requested "if you dont find the logo make a static radio logo".
    // We force null here so the improved StaticLogo component takes over.
    'aswat': {
      city: 'Casablanca',
      coords: [33.5731, -7.5898],
      logo: null
    },
    'radio aswat': {
      city: 'Casablanca',
      coords: [33.5731, -7.5898],
      logo: null
    },
    'atlantic radio': {
      city: 'Casablanca',
      coords: [33.5731, -7.5898],
      logo: null
    },
    // END: Fixed logos

    'mfm radio': { city: 'Casablanca', coords: [33.5731, -7.5898] },
    'mfm': { city: 'Casablanca', coords: [33.5731, -7.5898] },
    'med radio': { city: 'Casablanca', coords: [33.5731, -7.5898] },
    'cap radio': { city: 'Tangier', coords: [35.7595, -5.8340] },
    'radio 2m': { city: 'Casablanca', coords: [33.5731, -7.5898] },
    'luxe radio': { city: 'Casablanca', coords: [33.5731, -7.5898] },
    'medina fm': { city: 'Meknes', coords: [33.8935, -5.5473] },
    'radio inwi': { city: 'Casablanca', coords: [33.5731, -7.5898] },
    'snrt': { city: 'Rabat', coords: [34.0209, -6.8416] },
    'chain inter': { city: 'Rabat', coords: [34.0209, -6.8416] },
    'al idaa al watania': { city: 'Rabat', coords: [34.0209, -6.8416] },
    'radio plus marrakech': { city: 'Marrakesh', coords: [31.6295, -7.9811] },
    'radio plus agadir': { city: 'Agadir', coords: [30.4278, -9.5981] },
    'radio plus casablanca': { city: 'Casablanca', coords: [33.5731, -7.5898] }
  };

  // Expanded coordinates for Moroccan cities
  const moroccanCities = {
    'casablanca': [33.5731, -7.5898],
    'rabat': [34.0209, -6.8416],
    'marrakesh': [31.6295, -7.9811],
    'marrakech': [31.6295, -7.9811],
    'fez': [34.0331, -5.0003],
    'fes': [34.0331, -5.0003],
    'tangier': [35.7595, -5.8340],
    'tanger': [35.7595, -5.8340],
    'agadir': [30.4278, -9.5981],
    'oujda': [34.6814, -1.9086],
    'kenitra': [34.2610, -6.5802],
    'tetouan': [35.5889, -5.3626],
    'safi': [32.2994, -9.2372],
    'el jadida': [33.2316, -8.5007],
    'nador': [35.1681, -2.9335],
    'beni mellal': [32.3373, -6.3498],
    'mohammedia': [33.6835, -7.3849],
    'taza': [34.2125, -4.0083],
    'khemisset': [33.8167, -6.0667],
    'ksar el kebir': [35.0000, -5.9000],
    'meknes': [33.8935, -5.5473],
    'meknès': [33.8935, -5.5473],
    'essaouira': [31.5085, -9.7595],
    'ouarzazate': [30.9189, -6.8934],
    'laayoune': [27.1253, -13.1625],
    'dakhla': [23.6848, -15.9579],
    'berrechid': [33.2655, -7.5875],
    'settat': [33.0010, -7.6166],
    'salé': [34.0389, -6.8284],
    'sale': [34.0389, -6.8284],
    'taroudant': [30.4703, -8.8770],
    'errachidia': [31.9320, -4.4230],
    'guelmim': [28.9870, -10.0574],
    'ifrane': [33.5228, -5.1074],
    'larache': [35.1927, -6.1557],
    'chefchaouen': [35.1706, -5.2635]
  };

  // List of Radio Browser API mirrors to prevent single point of failure
  const API_MIRRORS = [
    'https://de1.api.radio-browser.info',
    'https://fr1.api.radio-browser.info',
    'https://at1.api.radio-browser.info',
    'https://nl1.api.radio-browser.info'
  ];

  useEffect(() => {
    async function fetchStations() {
      // Helper to try multiple servers
      const fetchWithRetry = async (endpoint) => {
        for (const base of API_MIRRORS) {
          try {
            const response = await fetch(`${base}${endpoint}`);
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            return await response.json();
          } catch (e) {
            console.warn(`Failed to fetch from ${base}, trying next...`, e);
          }
        }
        throw new Error('All API mirrors failed');
      };

      try {
        // Fetch global popular stations AND Moroccan stations specifically
        const [globalData, moroccoData] = await Promise.all([
          fetchWithRetry('/json/stations/search?limit=4000&has_geo_info=true&hidebroken=true&order=clickcount&reverse=true'),
          fetchWithRetry('/json/stations/search?countrycode=MA&hidebroken=true&order=name')
        ]);

        // Standardize data from both sources with strict validation
        const combinedData = [...globalData, ...moroccoData].map(station => {
          let coords = null;
          let city = station.state || station.city || 'Unknown';
          let country = station.country;
          const normalizedName = station.name.toLowerCase().trim();

          let logo = station.favicon || null;

          // Check for manual override first (Strongest signal)
          // Matches partial names if they are unique enough in the overrides list
          const overrideKey = Object.keys(STATION_OVERRIDES).find(key => normalizedName.includes(key));

          if (overrideKey && country === 'Morocco') {
            const override = STATION_OVERRIDES[overrideKey];
            city = override.city;

            // Apply logo override if it exists. 
            // We use hasOwnProperty so we can explicitly set logo: null to FORCE the static fallback
            if (override.hasOwnProperty('logo')) {
              logo = override.logo;
            }

            // Add slight jitter to prevent exact overlap
            coords = [
              override.coords[0] + (Math.random() - 0.5) * 0.005,
              override.coords[1] + (Math.random() - 0.5) * 0.005
            ];
          } else {
            // Validating latitude (-90 to 90) and longitude (-180 to 180)
            const lat = parseFloat(station.geo_lat);
            const lng = parseFloat(station.geo_long);

            if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
              if (lat !== 0 || lng !== 0) {
                coords = [lat, lng];
              }
            }
          }

          // If still no valid geo-coordinates, try to fallback based on City
          if (!coords && country === 'Morocco') {
            const cityName = city.toLowerCase().trim();
            if (cityName && moroccanCities[cityName]) {
              coords = moroccanCities[cityName];
              // Add slight jitter for city-based fallback too
              coords = [
                coords[0] + (Math.random() - 0.5) * 0.02,
                coords[1] + (Math.random() - 0.5) * 0.02
              ];
            } else {
              // FAIL-SAFE: Randomly placed in Morocco
              const baseLat = 31.79;
              const baseLng = -7.09;
              coords = [
                baseLat + (Math.random() - 0.5) * 4,
                baseLng + (Math.random() - 0.5) * 4
              ];
            }
          }

          return {
            id: station.stationuuid,
            name: station.name,
            streamUrl: station.url_resolved,
            logo: logo, // Use the potentially overridden logo
            homepage: station.homepage || station.url || null, // For logo fallback
            country: country,
            countryCode: station.countrycode,
            city: city,
            coordinates: coords,
            tags: station.tags ? station.tags.split(',') : [],
            clicks: station.clickcount || 0
          };
        }).filter(s => s.coordinates !== null); // Remove stations without valid coordinates

        // Deduplicate stations
        const uniqueStations = [];
        const seenIds = new Set();

        // Sort: Morocco first, then by popularity (clicks)
        combinedData.sort((a, b) => {
          const aIsMorocco = a.country === 'Morocco';
          const bIsMorocco = b.country === 'Morocco';
          if (aIsMorocco && !bIsMorocco) return -1;
          if (!aIsMorocco && bIsMorocco) return 1;
          return b.clicks - a.clicks;
        });

        combinedData.forEach(station => {
          if (!seenIds.has(station.id)) {
            seenIds.add(station.id);
            uniqueStations.push(station);
          }
        });

        setStations(uniqueStations);
      } catch (error) {
        console.warn('API fetch failed, falling back to local database:', error);

        // Fallback: Load from local JSON (radios.json)
        try {
          const res = await fetch('/radios.json');
          const localData = await res.json();

          const normalizedLocal = localData.map(s => ({
            id: s.id,
            name: s.name,
            streamUrl: s.streamUrl,
            logo: s.icon,
            country: s.country,
            city: s.city || 'Unknown',
            coordinates: (s.latitude && s.longitude) ? [s.latitude, s.longitude] : null,
            tags: [],
            clicks: 100 // Default importance
          })).filter(s => s.coordinates);

          setStations(normalizedLocal);
        } catch (localError) {
          console.error("Critical: Both API and Local fallback failed.", localError);
        }
      }
    }

    fetchStations();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleStationClick = (station, shouldCenter = false) => {
    setActiveStation(station);
    addToHistory(station);
    if (shouldCenter) {
      setMapCenter(station.coordinates);
    }
  };

  const handleFlyToStation = (station) => {
    setActiveStation(station);
    addToHistory(station);
    setMapCenter(station.coordinates);
    setCurrentView('map');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCategoryClick = (categoryId) => {
    console.log('Category clicked:', categoryId);
    setCurrentView('grid');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`relative w-full h-screen ${isDarkMode ? 'dark' : ''}`}>

      {/* Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        onViewChange={handleViewChange}
        currentView={currentView}
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
        toggleTheme={toggleTheme}
        stations={stations}
        onStationSelect={handleStationClick}
        onFlyToStation={handleFlyToStation}
      />

      {/* Main Content Area */}
      <div
        className="main-content"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'auto',
          backgroundColor: isDarkMode ? '#1a1a1d' : '#ffffff',
          zIndex: 1
        }}
      >
        {/* Home View */}
        {currentView === 'home' && (
          <HomePage
            stations={stations}
            onStationClick={handleStationClick}
            onCategoryClick={handleCategoryClick}
            favorites={favorites}
            history={history}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Grid View (Stations List) */}
        {currentView === 'grid' && (
          <div style={{
            padding: '40px 24px 40px',
            minHeight: '100vh',
            maxWidth: '1400px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{ fontSize: '48px', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#1a1a1f', marginBottom: '16px' }}>
                All Stations
              </h1>
              <p style={{ fontSize: '18px', color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0,0,0,0.6)' }}>
                Discover radio from every corner of the world
              </p>
            </div>

            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              isDarkMode={isDarkMode}
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
              marginTop: '40px'
            }}>
              {filteredStations.slice(0, visibleCount).map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  onStationClick={(station) => handleStationClick(station, false)} // No zoom on map click
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(station.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>

            {filteredStations.length === 0 && (
              <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
                <p style={{ fontSize: '20px' }}>No stations found matching your search.</p>
              </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredStations.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 50)}
                  style={{
                    padding: '16px 48px',
                    borderRadius: '50px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: '#D4AF37',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  Load More Stations ({filteredStations.length - visibleCount} left)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Map View */}
        {currentView === 'map' && (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapGuidePanel isDarkMode={isDarkMode} stationCount={stations.length} />

            {/* Cinematic Vignette Overlay - Adds depth to the map edges */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 400, // Above map (0), below panel (1000)
              pointerEvents: 'none',
              boxShadow: isDarkMode
                ? 'inset 0 0 120px rgba(0,0,0,0.6)'
                : 'inset 0 0 80px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s ease'
            }} />

            <MapView
              isDarkMode={isDarkMode}
              activeStation={activeStation}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              center={mapCenter} // Pass explicit center for navigation
              stations={stations} // Pass full list, internal filtering handles performance
              onStationClick={(station) => handleStationClick(station, false)} // No zoom on map click
              onCloseStation={() => setActiveStation(null)} // NEW: Handle closing sidebar from map
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          </div>
        )}
      </div>

      {/* Floating Active Player Sidebar */}
      <div
        className={`sidebar-container ${activeStation ? 'active' : ''}`}
        style={{
          position: 'fixed',
          top: '80px',
          right: 0,
          bottom: 0,
          zIndex: 1500,
          boxShadow: '-10px 0 50px rgba(0,0,0,0.5)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: activeStation ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        {activeStation && (
          <SidebarPlayer
            station={activeStation}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onClose={() => setActiveStation(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
