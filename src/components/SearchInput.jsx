import React from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ value, onChange, isDarkMode, placeholder = "Search for stations, countries, languages..." }) => {
    return (
        <div style={{
            position: 'relative',
            maxWidth: '600px',
            margin: '0 auto 32px',
            width: '100%'
        }}>
            <div style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                zIndex: 1
            }}>
                <Search size={20} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '16px 52px 16px 56px',
                    borderRadius: '50px',
                    border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.1)',
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    backdropFilter: 'blur(10px)',
                    color: isDarkMode ? '#ffffff' : '#1a1a1f',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                    e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#ffffff';
                    e.target.style.border = '1px solid rgba(212, 175, 55, 0.5)';
                    e.target.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.2)';
                }}
                onBlur={(e) => {
                    e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
                    e.target.style.border = isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.1)';
                    e.target.style.boxShadow = isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.05)';
                }}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
};

export default React.memo(SearchInput);
