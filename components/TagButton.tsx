
import React from 'react';

interface TagButtonProps {
    tag: string;
    onClick: (tag: string) => void;
    disabled: boolean;
}

const TagButton: React.FC<TagButtonProps> = ({ tag, onClick, disabled }) => {
    return (
        <button
            onClick={() => onClick(tag)}
            disabled={disabled}
            className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-semibold rounded-full hover:bg-sky-200 transition-colors duration-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
            {tag}
        </button>
    );
};

export default TagButton;
