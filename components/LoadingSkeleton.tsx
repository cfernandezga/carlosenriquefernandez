
import React from 'react';

const LoadingSkeleton: React.FC = () => {
    // Las animaciones y keyframes se definen en línea para mantener el componente autocontenido.
    const animationStyle = `
        @keyframes draw {
            to {
                stroke-dashoffset: 0;
            }
        }
        .animate-draw {
            animation: draw 1.5s ease-in-out forwards;
        }
    `;

    return (
        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-4 border border-slate-200">
            <style>{animationStyle}</style>
            <svg 
                className="w-2/3 h-2/3 text-slate-300" 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Generando imagen"
                role="img"
            >
                <g strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
                    {/* Marco exterior */}
                    <rect 
                        className="animate-draw" 
                        x="5" y="5" width="90" height="90" rx="5" 
                        strokeDasharray="360" 
                        strokeDashoffset="360"
                        style={{ animationDelay: '0s' }}
                    />
                    {/* Sol */}
                    <circle 
                        className="animate-draw" 
                        cx="70" cy="35" r="10" 
                        strokeDasharray="63" 
                        strokeDashoffset="63"
                        style={{ animationDelay: '0.4s' }}
                    />
                    {/* Montañas */}
                    <path 
                        className="animate-draw" 
                        d="M20 80 L40 60 L55 75 L70 65 L80 80 Z" 
                        strokeDasharray="155" 
                        strokeDashoffset="155"
                        style={{ animationDelay: '0.8s' }}
                    />
                </g>
            </svg>
        </div>
    );
};

export default LoadingSkeleton;
