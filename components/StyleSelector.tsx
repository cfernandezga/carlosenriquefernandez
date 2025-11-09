import React from 'react';
import { StyleOption } from '../constants';

interface StyleSelectorProps {
    styles: StyleOption[];
    selectedStyle: string; // the id of the style
    onSelect: (styleId: string) => void;
    disabled: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelect, disabled }) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    disabled={disabled}
                    type="button"
                    className={`p-3 border rounded-lg text-sm text-center font-semibold transition-all duration-200 ${
                        selectedStyle === style.id
                            ? 'bg-sky-500 border-sky-500 text-white ring-2 ring-offset-2 ring-sky-500'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-sky-500 hover:bg-sky-50'
                    } disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed`}
                >
                    {style.name}
                </button>
            ))}
        </div>
    );
};

export default StyleSelector;
