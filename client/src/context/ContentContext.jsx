import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api';

// Create contexts
const ContentContext = createContext();
const SettingsContext = createContext();

/**
 * Content Provider - Provides page content management
 */
export const ContentProvider = ({ children }) => {
    const [contentCache, setContentCache] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch content for a specific page
    const getPageContent = useCallback(async (pageId, fallback = {}) => {
        // Return cached content if available
        if (contentCache[pageId]) {
            return contentCache[pageId];
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/content/${pageId}`);

            // Merge with fallback
            const mergedContent = { ...fallback };
            for (const [sectionId, sectionContent] of Object.entries(data)) {
                mergedContent[sectionId] = {
                    ...fallback[sectionId],
                    ...sectionContent
                };
            }

            // Cache the content
            setContentCache(prev => ({
                ...prev,
                [pageId]: mergedContent
            }));

            return mergedContent;
        } catch (error) {
            console.error(`Error fetching content for ${pageId}:`, error);
            return fallback;
        } finally {
            setLoading(false);
        }
    }, [contentCache]);

    // Clear cache for a specific page or all pages
    const clearCache = useCallback((pageId = null) => {
        if (pageId) {
            setContentCache(prev => {
                const newCache = { ...prev };
                delete newCache[pageId];
                return newCache;
            });
        } else {
            setContentCache({});
        }
    }, []);

    // Prefetch content for multiple pages
    const prefetchContent = useCallback(async (pageIds) => {
        const uncachedPages = pageIds.filter(id => !contentCache[id]);

        await Promise.all(
            uncachedPages.map(pageId => getPageContent(pageId))
        );
    }, [contentCache, getPageContent]);

    const value = {
        contentCache,
        loading,
        getPageContent,
        clearCache,
        prefetchContent
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};

/**
 * Settings Provider - Provides site settings management
 */
export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        siteName: 'LankaHope',
        siteTagline: 'Empowering Health Research',
        contactEmail: 'info@lankahope.lk',
        contactPhone: '+94 11 269 3456',
        contactAddress: 'No. 123, Norris Canal Road, Colombo 10, Sri Lanka',
        facebookUrl: '',
        twitterUrl: '',
        linkedinUrl: '',
        footerText: 'LankaHope is dedicated to promoting health research.',
        copyrightText: 'LankaHope. All Rights Reserved.',
        primaryColor: '#722F37',
        secondaryColor: '#D4AF37'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/settings`);
                setSettings(prev => ({ ...prev, ...data }));
                setError(null);
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError(err);
                // Keep default settings on error
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Refresh settings
    const refreshSettings = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/settings`);
            setSettings(prev => ({ ...prev, ...data }));
            setError(null);
        } catch (err) {
            console.error('Error refreshing settings:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get a specific setting
    const getSetting = useCallback((key, defaultValue = '') => {
        return settings[key] ?? defaultValue;
    }, [settings]);

    const value = {
        settings,
        loading,
        error,
        refreshSettings,
        getSetting
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

/**
 * Combined Provider for convenience
 */
export const CMSProvider = ({ children }) => {
    return (
        <SettingsProvider>
            <ContentProvider>
                {children}
            </ContentProvider>
        </SettingsProvider>
    );
};

// Custom hooks
export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export default CMSProvider;
