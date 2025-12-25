import React, { useMemo } from 'react';
import { Radio } from 'lucide-react';

const StaticLogo = ({ name, size = 100, style = {} }) => {
    // Consistent color based on name, but we use a default premium gradient for the "Standard Radio Logo" look
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${Math.abs(hash) % 360}, 70%, 35%)`;
    };

    const bgColor = useMemo(() => stringToColor(name || 'Radio'), [name]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a1f 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                ...style
            }}
        >
            <Radio size={size * 0.6} strokeWidth={2.5} />
        </div>
    );
};

export default StaticLogo;
