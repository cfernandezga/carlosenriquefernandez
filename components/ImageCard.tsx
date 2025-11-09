
import React from 'react';

interface ImageCardProps {
  imageUrl: string;
  isSelected: boolean;
  isLoadingVariations: boolean;
  onSelect: (imageUrl: string) => void;
  onDownload: (imageUrl: string) => void;
}

const ActionButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button
        onClick={onClick}
        title={title}
        className="bg-white/20 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
    >
        {children}
    </button>
);

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, isSelected, isLoadingVariations, onSelect, onDownload }) => {
    
    return (
        <div className={`relative group aspect-square rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${isSelected ? 'ring-4 ring-offset-2 ring-sky-500' : 'ring-1 ring-slate-200'}`}>
            <img src={imageUrl} alt="Imagen generada para LinkedIn" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center p-4">
                {isLoadingVariations && isSelected ? (
                    <div className="flex flex-col items-center text-white">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="mt-2 text-sm font-semibold">Creando...</span>
                    </div>
                ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-4">
                        <ActionButton onClick={() => onSelect(imageUrl)} title="Generar Variaciones">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" /></svg>
                        </ActionButton>
                        <ActionButton onClick={() => onDownload(imageUrl)} title="Descargar Imagen">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </ActionButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCard;
