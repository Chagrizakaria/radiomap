import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import StationMarker from './StationMarker';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// MapController handles flying to active station
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
};

// ViewportTracker - filters markers to visible bounds
const ViewportTracker = ({ stations, onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => {
      updateVisibleStations();
    },
    zoomend: () => {
      updateVisibleStations();
    }
  });

  const updateVisibleStations = useCallback(() => {
    if (!map) return;

    // Increase padding to 0.5 (50% of screen size) to have a "buffer" 
    // around the viewport. This effectively pre-renders things just outside 
    // the view, so when you pan, they are already there.
    const bounds = map.getBounds();
    const extendedBounds = bounds.pad(0.5);

    const visibleStations = stations.filter(station => {
      if (!station.coordinates) return false;
      return extendedBounds.contains(station.coordinates);
    });

    onBoundsChange(visibleStations);
  }, [map, stations, onBoundsChange]);

  // Initial load effect - Critical for showing markers on first render
  useEffect(() => {
    updateVisibleStations();
  }, [updateVisibleStations]);

  return null;
};

// MapLifecycle component to handle initial resize and invalidation
const MapLifecycle = () => {
  const map = useMap();

  useEffect(() => {
    // Force map to recalculate size on mount to prevent gray areas
    // This fixes the issue where the map might initialize before the container is full width
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

const MapView = ({ isDarkMode, activeStation, isPlaying, onTogglePlay, center, stations = [], onStationClick, onCloseStation, onToggleFavorite, isFavorite }) => {
  const [visibleStations, setVisibleStations] = useState([]);

  // Memoize handleBoundsChange to avoid re-renders of ViewportTracker
  const handleBoundsChange = useCallback((newVisibleStations) => {
    setVisibleStations(newVisibleStations);
  }, []);

  const mapStyle = isDarkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      scrollWheelZoom={true} // Enabled for better UX
      className="w-full h-screen z-0"
      zoomControl={false}
      // Removed maxBounds to allow horizontal wrapping
      preferCanvas={true} // Critical for performance with many markers
      renderer={L.canvas()}
      style={{ background: isDarkMode ? '#1a1a1d' : '#f0f0f0' }} // Match background to theme to hide loading gaps
    >
      <MapLifecycle />
      <TileLayer
        attribution={attribution}
        url={mapStyle}
        noWrap={false} // Allow horizontal wrapping to fill wide screens
        keepBuffer={2} // Preload tiles for smoother panning
        updateWhenIdle={false}
        updateWhenZooming={false}
      />

      {/* 
        ViewportTracker efficiently filters the 5000+ stations to only those 
        currently visible in the map view (plus a safety buffer).
        This works in tandem with MarkerClusterGroup.
      */}
      <ViewportTracker
        stations={stations}
        onBoundsChange={handleBoundsChange}
      />

      {/* Control map movement via the distinct 'center' prop (e.g. search result) */}
      <MapController center={center} />

      {/* 
         PERFORMANCE FIX:
         Only render markers that are actually in the visible viewport.
         This reduces the React Virtual DOM size from ~5000 to ~50-200 nodes.
         Chunked loading prevents UI freeze during rapid pans.
      */}
      <MarkerClusterGroup
        chunkedLoading={true} // breaks operations into small chunks prevents freeze
        showCoverageOnHover={false} // Performance: avoid calculating convex hulls
        maxClusterRadius={45} // Tuning: Slightly larger radius reduces total clusters
        spiderfyOnMaxZoom={true} // UX: See all stations at same spot
        removeOutsideVisibleBounds={true}
        animate={true}
        disableClusteringAtZoom={16} // UX: Show individual stations at high zoom
        zoomToBoundsOnClick={false} // UX: Disable zoom on cluster click
      >
        {visibleStations.map(station => (
          <StationMarker
            key={station.id}
            station={station}
            isActive={activeStation?.id === station.id}
            isPlaying={isPlaying && activeStation?.id === station.id}
            onTogglePlay={onTogglePlay}
            onClick={onStationClick}
            onClose={onCloseStation}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite(station.id)}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
