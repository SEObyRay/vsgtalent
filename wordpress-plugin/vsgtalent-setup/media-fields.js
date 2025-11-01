/**
 * Levy Racing – Gutenberg Media Panel
 */
(function (wp) {
    if (!wp || !wp.plugins || !wp.editPost || !wp.element || !wp.data) {
        console.error('Levy Racing Media Panel: WordPress editor globals not available.');
        return;
    }

    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { Fragment, createElement: el, useState } = wp.element;
    const { useSelect, useDispatch } = wp.data;
    const { Button, TextControl, Notice } = wp.components;
    const mediaModule = wp.blockEditor || wp.editor;

    if (!mediaModule || !mediaModule.MediaUpload) {
        console.error('Levy Racing Media Panel: MediaUpload component unavailable.');
        return;
    }

    const { MediaUpload, MediaUploadCheck } = mediaModule;

    const arrayFromMeta = (value) => {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value.filter(Boolean);
        }

        if (typeof value === 'string' && value.trim() !== '') {
            return value.split('\n').map((item) => item.trim()).filter(Boolean);
        }

        return [];
    };

    const MediaPanel = () => {
        const postType = useSelect((select) => select('core/editor').getCurrentPostType(), []);
        const meta = useSelect((select) => select('core/editor').getEditedPostAttribute('meta'), []);
        const { editPost } = useDispatch('core/editor');
        const { createNotice } = useDispatch('core/notices');

        const [customVideoUrl, setCustomVideoUrl] = useState('');

        if (postType !== 'post' || !meta) {
            return null;
        }

        const gallery = arrayFromMeta(meta.media_gallery);
        const videos = arrayFromMeta(meta.media_videos);

        const updateMeta = (key, value) => {
            editPost({
                meta: {
                    ...meta,
                    [key]: value,
                },
            });
        };

        const handleGallerySelect = (items) => {
            const mediaItems = Array.isArray(items) ? items : [items];
            const urls = mediaItems
                .map((item) => item && item.url ? item.url : null)
                .filter(Boolean);

            if (!urls.length) {
                return;
            }

            const next = Array.from(new Set([...gallery, ...urls]));
            updateMeta('media_gallery', next);
        };

        const handleVideoSelect = (items) => {
            const mediaItems = Array.isArray(items) ? items : [items];
            const urls = mediaItems
                .map((item) => item && item.url ? item.url : null)
                .filter(Boolean);

            if (!urls.length) {
                return;
            }

            const next = Array.from(new Set([...videos, ...urls]));
            updateMeta('media_videos', next);
        };

        const handleCustomVideoAdd = () => {
            const value = customVideoUrl.trim();
            if (!value) {
                return;
            }

            try {
                // Basic validation – throws if invalid
                const validated = new URL(value).toString();
                const next = Array.from(new Set([...videos, validated]));
                updateMeta('media_videos', next);
                setCustomVideoUrl('');
            } catch (err) {
                createNotice('error', 'Voer een geldige URL in voor de video.', { isDismissible: true });
            }
        };

        const removeItem = (key, items, index) => {
            const next = items.filter((_, i) => i !== index);
            updateMeta(key, next);
        };

        return el(
            PluginDocumentSettingPanel,
            {
                name: 'levy-racing-media-panel',
                title: '📸 Media Galerij & Video\'s',
                className: 'levy-racing-media-panel',
            },
            el(Fragment, null,
                // Afbeeldingen sectie
                el('div', { style: { marginBottom: '24px' } },
                    el('h3', { style: { marginBottom: '12px', fontSize: '14px' } }, '🖼️ Afbeeldingen'),
                    gallery.length === 0 && el(Notice, { status: 'info', isDismissible: false }, 'Nog geen afbeeldingen toegevoegd.'),
                    gallery.length > 0 && el('ul', {
                        style: {
                            listStyle: 'none',
                            margin: '0 0 16px',
                            padding: 0,
                            display: 'grid',
                            gap: '8px',
                        },
                    }, gallery.map((url, index) => (
                        el('li', {
                            key: `gallery-${index}`,
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                padding: '8px',
                            },
                        },
                            el('img', {
                                src: url,
                                style: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' },
                                alt: 'Galerij afbeelding',
                            }),
                            el('span', {
                                style: {
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: '12px',
                                },
                            }, url),
                            el(Button, {
                                isSmall: true,
                                isDestructive: true,
                                onClick: () => removeItem('media_gallery', gallery, index),
                            }, 'Verwijderen')
                        ))
                    ))
                ),
                el(MediaUploadCheck, null,
                    el(MediaUpload, {
                        onSelect: handleGallerySelect,
                        allowedTypes: ['image'],
                        multiple: true,
                        gallery: true,
                        render: ({ open }) => (
                            el(Button, { variant: 'primary', onClick: open }, '+ Afbeeldingen toevoegen')
                        ),
                    })
                ),

                // Video sectie
                el('hr', { style: { margin: '24px 0' } }),
                el('div', null,
                    el('h3', { style: { marginBottom: '12px', fontSize: '14px' } }, '🎥 Video\'s'),
                    videos.length === 0 && el(Notice, { status: 'info', isDismissible: false }, 'Nog geen video\'s toegevoegd.'),
                    videos.length > 0 && el('ul', {
                        style: {
                            listStyle: 'none',
                            margin: '0 0 16px',
                            padding: 0,
                            display: 'grid',
                            gap: '8px',
                        },
                    }, videos.map((url, index) => (
                        el('li', {
                            key: `video-${index}`,
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                padding: '8px',
                            },
                        },
                            el('span', { style: { fontSize: '18px' } }, '🎬'),
                            el('span', {
                                style: {
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: '12px',
                                },
                            }, url),
                            el(Button, {
                                isSmall: true,
                                isDestructive: true,
                                onClick: () => removeItem('media_videos', videos, index),
                            }, 'Verwijderen')
                        ))
                    ))
                ),
                el(MediaUploadCheck, null,
                    el(MediaUpload, {
                        onSelect: handleVideoSelect,
                        allowedTypes: ['video'],
                        multiple: true,
                        render: ({ open }) => (
                            el(Button, { variant: 'primary', onClick: open }, '+ Video\'s toevoegen (upload/bibliotheek)')
                        ),
                    })
                ),
                el('div', { style: { marginTop: '16px' } },
                    el(TextControl, {
                        label: 'YouTube/Vimeo of externe video URL',
                        value: customVideoUrl,
                        onChange: setCustomVideoUrl,
                        placeholder: 'https://youtu.be/… of https://example.com/video.mp4',
                    }),
                    el(Button, {
                        style: { marginTop: '8px' },
                        variant: 'secondary',
                        onClick: handleCustomVideoAdd,
                    }, 'Voeg video-URL toe')
                ),
                el('p', {
                    style: {
                        marginTop: '16px',
                        fontSize: '12px',
                        color: '#555',
                    },
                }, 'Media die je hier selecteert wordt automatisch getoond in de front-end carousel (16:9 verhouding).')
            )
        );
    };

    registerPlugin('levy-racing-media-panel', {
        render: MediaPanel,
        icon: 'images-alt2',
    });
})(window.wp);
