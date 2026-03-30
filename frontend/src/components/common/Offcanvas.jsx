import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';

const OffCanvas = ({ 
    isOpen, 
    onClose, 
    title = "Menu", 
    position = "right", 
    width = 350, 
    children 
}) => {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const positionClasses = {
        right: {
            container: 'inset-y-0 right-0',
            enter: 'translate-x-0',
            leave: 'translate-x-full',
        },
        left: {
            container: 'inset-y-0 left-0',
            enter: 'translate-x-0',
            leave: '-translate-x-full',
        },
        top: {
            container: 'inset-x-0 top-0',
            enter: 'translate-y-0',
            leave: '-translate-y-full',
        },
        bottom: {
            container: 'inset-x-0 bottom-0',
            enter: 'translate-y-0',
            leave: 'translate-y-full',
        }
    };

    const currentPos = positionClasses[position] || positionClasses.right;

    const content = (
        <div 
            className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isOpen}
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div 
                className={`absolute bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${currentPos.container} ${isOpen ? currentPos.enter : currentPos.leave} max-w-[85vw]`}
                style={{ 
                    width: ['left', 'right'].includes(position) ? width : '100%',
                    height: ['top', 'bottom'].includes(position) ? width : '100%' 
                }}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                    <div className="flex-1">
                        {title}
                    </div>
                    <button 
                        onClick={onClose}
                        className="ml-4 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all focus:outline-none group active:scale-90"
                    >
                        <CloseIcon fontSize="small" className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Body Section */}
                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default OffCanvas;
