import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Create a custom icon that looks like a radio
// const radioIcon = new L.Icon({
//   iconUrl:radio.icon, // You can change this URL to your favorite radio icon
//   iconSize: [32, 32],       // Size of the icon
//   iconAnchor: [16, 32],     // Point of the icon which will correspond to marker's location
//   popupAnchor: [0, -32],    // Position of the popup relative to the icon
//   shadowUrl: null,          // No shadow for this icon
// });
function createRadioIcon(iconUrl) {
  return new L.Icon({
    iconUrl: iconUrl, // ici on utilise le paramètre
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: null,
  })
}

export default function RadioMap() {
  // State to store the list of radios loaded from JSON
  const [radios, setRadios] = useState([])

  // State to remember which radio is currently playing
  const [playingId, setPlayingId] = useState(null)

  // Reference to the HTML audio element, so we can control it programmatically
  const audioRef = useRef(null)

  // Load radios data once when component mounts
  useEffect(() => {
    fetch('/radios.json')
      .then((response) => response.json())
      .then((data) => setRadios(data))
      .catch((error) => console.error('Oops, failed to load radios:', error))
  }, [])

  // When the currently playing radio changes, update the audio player
  useEffect(() => {
    if (playingId) {
      // Find the radio that matches the playingId
      const currentRadio = radios.find((radio) => radio.id === playingId)

      if (currentRadio && audioRef.current) {
        // Set the audio source to this radio's stream URL and play it
        audioRef.current.src = currentRadio.streamUrl
        audioRef.current.play()
      }
    } else {
      // If no radio is selected, pause and clear the audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [playingId, radios])

  return (
    <>
      {/* The map centered on Morocco */}
      <MapContainer
        center={[31.7917, -7.0926]} // Morocco's approximate center coordinates
        zoom={6}
        style={{ height: '100vh', width: '100%' }}
      >
        {/* Map tiles from OpenStreetMap */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Place a marker for each radio */}
        {radios.map((radio) => (
          <Marker
            key={radio.id}
            position={[radio.latitude, radio.longitude]}
            icon={createRadioIcon(radio.icon)} // tu passes l’URL spécifique de chaque radio ici
            title={radio.name}
          >
            {/* When marker is clicked, show a popup with radio info and play/pause button */}
            <Popup>
              <div>
                <strong>{radio.name}</strong>
                <br />
                {playingId === radio.id ? (
                  <button onClick={() => setPlayingId(null)}>Pause</button>
                ) : (
                  <button onClick={() => setPlayingId(radio.id)}>Play</button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* The audio player is outside the map, controls the currently playing radio */}
      <audio ref={audioRef} controls style={{ width: '100%' }} />
    </>
  )
}
