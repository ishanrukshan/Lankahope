import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api';

/**
 * Custom hook to fetch page content from the CMS
 * @param {string} pageId - The page identifier (e.g., 'home', 'about-background')
 * @param {object} fallback - Fallback content to use if API fails
 * @returns {object} - { content, loading, error, refetch }
 */
export const usePageContent = (pageId, fallback = {}) => {
    const [content, setContent] = useState(fallback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/content/${pageId}`);

            // Merge with fallback to ensure all keys exist
            const mergedContent = { ...fallback };
            for (const [sectionId, sectionContent] of Object.entries(data)) {
                mergedContent[sectionId] = {
                    ...fallback[sectionId],
                    ...sectionContent
                };
            }

            setContent(mergedContent);
            setError(null);
        } catch (err) {
            console.error(`Error fetching content for ${pageId}:`, err);
            setError(err);
            // Keep fallback content on error
            setContent(fallback);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [pageId]);

    return { content, loading, error, refetch: fetchContent };
};

/**
 * Custom hook to fetch site settings
 * @returns {object} - { settings, loading, error, refetch }
 */
export const useSiteSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/settings`);
            setSettings(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return { settings, loading, error, refetch: fetchSettings };
};

/**
 * Custom hook to fetch images for a page
 * @param {string} pageId - The page identifier
 * @returns {object} - { images, loading, error, refetch }
 */
export const usePageImages = (pageId) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/images/page/${pageId}`);
            setImages(data);
            setError(null);
        } catch (err) {
            console.error(`Error fetching images for ${pageId}:`, err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pageId) {
            fetchImages();
        }
    }, [pageId]);

    return { images, loading, error, refetch: fetchImages };
};

/**
 * Get a specific image by name
 * @param {string} imageName - The unique image name
 * @returns {object} - { image, loading, error }
 */
export const useImage = (imageName) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_URL}/images/name/${imageName}`);
                setImage(data);
                setError(null);
            } catch (err) {
                console.error(`Error fetching image ${imageName}:`, err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (imageName) {
            fetchImage();
        }
    }, [imageName]);

    return { image, loading, error };
};

export default usePageContent;
