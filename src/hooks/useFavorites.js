import { useState, useEffect, useCallback } from 'react';

/**
 * useFavorites Hook
 * Manages radio station favorites with localStorage persistence.
 */
export const useFavorites = () => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('radio_map_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading favorites:', e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('radio_map_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = useCallback((station) => {
        setFavorites(prev => {
            const isFavorited = prev.some(f => f.id === station.id);
            if (isFavorited) {
                return prev.filter(f => f.id !== station.id);
            } else {
                return [...prev, station];
            }
        });
    }, []);

    const isFavorite = useCallback((stationId) => {
        return favorites.some(f => f.id === stationId);
    }, [favorites]);

    return { favorites, toggleFavorite, isFavorite };
};
