import { useState, useEffect, useCallback } from 'react';

/**
 * useRecentlyPlayed Hook
 * Manages radio station history with localStorage persistence.
 */
export const useRecentlyPlayed = (maxCount = 20) => {
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('radio_map_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading history:', e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('radio_map_history', JSON.stringify(history));
    }, [history]);

    const addToHistory = useCallback((station) => {
        if (!station) return;

        setHistory(prev => {
            // Remove the station if it already exists to move it to the front
            const filtered = prev.filter(s => s.id !== station.id);
            // Add to the front and limit the size
            return [station, ...filtered].slice(0, maxCount);
        });
    }, [maxCount]);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return { history, addToHistory, clearHistory };
};
