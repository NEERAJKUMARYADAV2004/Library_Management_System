import React, { createContext, useState, useContext, useCallback } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', 
        confirmLabel: 'OK',
        cancelLabel: 'Cancel',
        showCancel: true,
        resolve: null
    });

    const showModal = useCallback((options) => {
        return new Promise((resolve) => {
            setModalConfig({
                isOpen: true,
                title: options.title || 'Notification',
                message: options.message || '',
                type: options.type || 'info', 
                confirmLabel: options.confirmLabel || 'OK',
                cancelLabel: options.cancelLabel || 'Cancel',
                showCancel: options.showCancel !== undefined ? options.showCancel : true,
                resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        if (modalConfig.resolve) modalConfig.resolve(true);
        setModalConfig(prev => ({ ...prev, isOpen: false, resolve: null }));
    };

    const handleCancel = () => {
        if (modalConfig.resolve) modalConfig.resolve(false);
        setModalConfig(prev => ({ ...prev, isOpen: false, resolve: null }));
    };

    return (
        <ModalContext.Provider value={{ showModal, modalConfig, handleConfirm, handleCancel }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
