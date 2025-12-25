import React from 'react';

const Logo = ({ size = 48, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }}
        >
            <defs>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#F4CF57" />
                </linearGradient>
                <linearGradient id="gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b8941f" />
                    <stop offset="100%" stopColor="#8a6e15" />
                </linearGradient>
            </defs>

            {/* Map Pin Base */}
            <path
                d="M50 10C27.9 10 10 27.9 10 50C10 78 50 98 50 98C50 98 90 78 90 50C90 27.9 72.1 10 50 10Z"
                fill="url(#gold-gradient)"
            />

            {/* Inner Dark Circle */}
            <circle cx="50" cy="50" r="28" fill="#1A1A1D" />

            {/* Radio Waves */}
            <path
                d="M50 32C55 32 59 36 59 41"
                stroke="url(#gold-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M50 26C58.3 26 65 32.7 65 41"
                stroke="url(#gold-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
            />
            <path
                d="M50 32C45 32 41 36 41 41"
                stroke="url(#gold-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M50 26C41.7 26 35 32.7 35 41"
                stroke="url(#gold-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
            />

            {/* Center Dot / Emitter */}
            <circle cx="50" cy="55" r="6" fill="#D4AF37" />

            {/* Vertical Mic Stand / Antenna Base */}
            <path
                d="M50 55L50 68"
                stroke="#D4AF37"
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Base Line */}
            <path
                d="M40 68H60"
                stroke="#D4AF37"
                strokeWidth="4"
                strokeLinecap="round"
            />

        </svg>
    );
};

export default Logo;
