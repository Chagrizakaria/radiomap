import React from 'react';

/**
 * CountryFlag Component
 * Renders a small, consistent SVG flag based on ISO country code.
 * Uses FlagCDN for lightweight, high-quality SVG flags.
 * 
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'MA')
 * @param {string} countryName - Full name of the country for accessibility
 * @param {number} size - Width of the flag in pixels
 */
const CountryFlag = ({ countryCode, countryName, size = 20 }) => {
    if (!countryCode) {
        return (
            <span
                title={countryName}
                style={{
                    fontSize: `${size}px`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: `${size}px`,
                    height: `${size * 0.75}px`
                }}
            >
                🌍
            </span>
        );
    }

    const code = countryCode.toLowerCase();
    // Using FlagCDN (reliable, high-performance SVG flags)
    const flagUrl = `https://flagcdn.com/${code}.svg`;

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size}px`,
            height: `${size * 0.75}px`, // Standard flag ratio is approx 4:3
            overflow: 'hidden',
            borderRadius: '2px', // Slight rounding for premium look
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            flexShrink: 0
        }}>
            <img
                src={flagUrl}
                alt={`${countryName} flag`}
                title={countryName}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '🌍';
                }}
            />
        </div>
    );
};

export default React.memo(CountryFlag);
