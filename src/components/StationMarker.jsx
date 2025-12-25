import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import CountryFlag from './CountryFlag';

const StationMarker = React.memo(({ station, isActive, isPlaying, onTogglePlay, onClick, onClose, onToggleFavorite, isFavorite }) => {
  const map = useMap();
  const markerRef = useRef(null);
  const isUnmounting = useRef(false);

  // Set unmounting flag on cleanup to prevent popupclose events from clearing state
  // when the user is just navigating away from the Map view.
  useEffect(() => {
    return () => {
      isUnmounting.current = true;
    };
  }, []);

  // Sync: Close map popup if sidebar is closed (isActive becomes false)
  useEffect(() => {
    if (!isActive && markerRef.current) {
      markerRef.current.closePopup();
    }
  }, [isActive]);

  // Helper to generate color from string for static logo
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 70%, 45%)`;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase())
      .join('') || 'FM';
  };

  // helper to safely extract domain for logo search
  const getDomain = (url) => {
    try {
      if (!url) return null;
      // Ensure protocol to avoid parsing errors
      const safeUrl = url.startsWith('http') ? url : `http://${url}`;
      return new URL(safeUrl).hostname;
    } catch {
      return null;
    }
  };

  // Memoize the icon creation to prevent Leaflet from destroying/re-creating DOM elements
  const icon = useMemo(() => {
    const size = isActive ? 40 : 32; // Optimized sizes for visibility
    const borderColor = isActive ? '#D4AF37' : '#3B82F6';
    const borderWidth = isActive ? 3 : 2;
    const bgColor = stringToColor(station.name);

    // Attempt fallback logo via Clearbit if homepage exists
    const domain = getDomain(station.homepage);
    const backupLogo = domain ? `https://logo.clearbit.com/${domain}` : '';

    // SVG String for the Radio Icon (matches Lucide Radio)
    const radioIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
        <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
      </svg>
    `;

    return L.divIcon({
      className: 'custom-logo-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          box-sizing: border-box;
          border-radius: 50%;
          border: ${borderWidth}px solid ${borderColor};
          background: #ffffff;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          overflow: hidden;
        ">
          <!-- 1. Fallback Layer (Always rendered behind image) -->
          <div style="
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, ${bgColor} 0%, #1a1a1f 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 0;
          ">
            ${radioIconSvg}
          </div>

          <!-- 2. Image Layer (Rendered on top if logo exists) -->
          ${station.logo || backupLogo ? `
          <img 
            src="${station.logo || backupLogo}" 
            alt="" 
            loading="lazy"
            style="
              position: absolute;
              inset: 0;
              width: 100%; 
              height: 100%; 
              object-fit: cover; 
              border-radius: 50%;
              transform: scale(1.12); /* Slight zoom to eliminate transparent edges */
              z-index: 1;
              transition: opacity 0.2s ease;
            "
            onerror="
              if (!this.dataset.retried && '${backupLogo}' && this.src !== '${backupLogo}') {
                this.dataset.retried = 'true';
                this.src = '${backupLogo}';
              } else {
                this.style.opacity = '0'; // Hide image to reveal fallback layer
              }
            "
          />` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  }, [isActive, station.logo, station.name, station.homepage]);

  // Safety check for coordinates
  if (!station.coordinates || station.coordinates[0] === null) return null;

  return (
    <Marker
      ref={markerRef}
      position={station.coordinates}
      icon={icon}
      eventHandlers={{
        click: (e) => {
          L.DomEvent.stopPropagation(e);
        },
        popupopen: () => {
          // Sync: If popup is opened manually (by clicking marker),
          // ensure the sidebar also opens.
          if (!isActive) {
            onClick(station);
          }
        },
        popupclose: () => {
          // IMPORTANT: Only close the sidebar if the user manually closed the popup
          // while still on the map. Don't close it if we are just navigating away.
          if (!isUnmounting.current && isActive && onClose) {
            onClose();
          }
        }
      }}
    >
      <Popup maxWidth={280} minWidth={240} closeButton={false} className="station-popup">
        <div style={{ position: 'relative', padding: '16px', borderRadius: '16px' }}>
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              map.closePopup();
              if (onClose) onClose(); // Ensure sidebar closes too
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              border: 'none',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            ✕
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 16px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow: isPlaying ? '0 0 30px rgba(59, 130, 246, 0.4)' : '0 8px 16px rgba(0,0,0,0.1)',
              border: `3px solid ${isActive ? '#D4AF37' : '#f3f4f6'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              {station.logo ? (
                <img
                  src={station.logo}
                  alt={station.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = `linear-gradient(135deg, ${stringToColor(station.name)} 0%, #1a1a1f 100%)`;
                    e.target.parentElement.innerText = getInitials(station.name);
                    e.target.parentElement.style.color = 'white';
                    e.target.parentElement.style.fontSize = '28px';
                    e.target.parentElement.style.fontWeight = '800';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${stringToColor(station.name)} 0%, #1a1a1f 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: '800'
                }}>
                  {getInitials(station.name)}
                </div>
              )}
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#1a1a1f', lineHeight: 1.2 }}>
              {station.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
              <CountryFlag countryCode={station.countryCode} countryName={station.country} size={16} />
              {station.city}, {station.country}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isActive) {
                    onTogglePlay();
                  } else {
                    onClick(station);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: isActive && isPlaying ? '#ef4444' : '#D4AF37',
                  color: 'white',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}
              >
                {isActive && isPlaying ? (
                  <><span>⏸</span> Pause</>
                ) : (
                  <><span>▶</span> Play</>
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(station);
                }}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '2px solid #f1f5f9',
                  background: isFavorite ? '#fff1f2' : 'white',
                  color: isFavorite ? '#e11d48' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.2s ease'
                }}
              >
                {isFavorite ? '❤️' : '♡'}
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}, (prev, next) => {
  return prev.isActive === next.isActive &&
    prev.isPlaying === next.isPlaying &&
    prev.isFavorite === next.isFavorite &&
    prev.station.id === next.station.id;
});

StationMarker.displayName = 'StationMarker';

export default StationMarker;
