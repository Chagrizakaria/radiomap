import { useState, useMemo, useEffect } from 'react';

/**
 * useRadioSearch Hook
 * Provides unified search and filtering logic for radio stations.
 */
export const useRadioSearch = (stations) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query for performance
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const filteredStations = useMemo(() => {
        if (!debouncedQuery.trim()) return stations;

        const query = debouncedQuery.toLowerCase().trim();

        return stations.filter(station => {
            const name = (station.name || '').toLowerCase();
            const country = (station.country || '').toLowerCase();
            const language = (station.language || '').toLowerCase();
            const city = (station.city || '').toLowerCase();
            const tags = (station.tags || []).join(' ').toLowerCase();

            return name.includes(query) ||
                country.includes(query) ||
                language.includes(query) ||
                city.includes(query) ||
                tags.includes(query);
        });
    }, [stations, debouncedQuery]);

    return {
        searchQuery,
        setSearchQuery,
        filteredStations,
        isSearching: searchQuery.length > 0
    };
};
