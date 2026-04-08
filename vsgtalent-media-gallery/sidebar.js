/**
 * Super eenvoudige versie van de media gallery sidebar
 * Gemaakt door: Ray Gritter, 2025-11-06
 * Versie: 1.8.0
 * Dit script registreert een sidebar die wordt weergegeven in de WordPress post editor
 * LAATSTE VERSIE: Volledig bijgewerkt met verbeterde compatibiliteit
 */

(function() {
    // Wacht tot WordPress volledig is geladen
    document.addEventListener('DOMContentLoaded', function() {
        if (!wp || !wp.domReady) return;
        
        // Wacht tot de WordPress editor volledig is geladen
        wp.domReady(function() {
            if (!wp.plugins || !wp.editPost || !wp.element || !wp.components || !wp.data || !wp.blockEditor) {
                console.error('VSGTalent: Benodigde WordPress dependencies zijn niet beschikbaar');
                return;
            }
            
            try {
                registerMediaGallery();
            } catch (error) {
                console.error('VSGTalent: Fout bij het registreren van de media galerij sidebar:', error);
            }
        });
    });
    
    function registerMediaGallery() {
        const { registerPlugin } = wp.plugins;
        const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
        const { createElement: el } = wp.element;
        const { PanelBody, Button } = wp.components;
        const { select, dispatch, useSelect, useDispatch } = wp.data;
        const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
        
        const MediaGalleryComponent = function() {
            // Direct ophalen van huidige meta gegevens
            const meta = useSelect(function(sel) {
                return sel('core/editor').getEditedPostAttribute('meta') || {};
            });
            
            const editPostAction = useDispatch('core/editor').editPost;
            
            // Array met afbeeldingen ophalen of leeg array als het niet bestaat
            const mediaGallery = meta.media_gallery || [];
            const mediaVideos = meta.media_videos || [];
            
            // Functie om afbeeldingen toe te voegen
            function addImages(images) {
                const urls = images.map(function(image) {
                    return image.url;
                });
                
                editPostAction({
                    meta: {
                        ...meta,
                        media_gallery: urls
                    }
                });
            }
            
            // Functie om video's toe te voegen
            function addVideos(videos) {
                const urls = videos.map(function(video) {
                    return video.url;
                });
                
                editPostAction({
                    meta: {
                        ...meta,
                        media_videos: urls
                    }
                });
            }
            
            // Functie om een afbeelding te verwijderen
            function removeImage(index) {
                const updatedGallery = [...mediaGallery];
                updatedGallery.splice(index, 1);
                
                editPostAction({
                    meta: {
                        ...meta,
                        media_gallery: updatedGallery
                    }
                });
            }
            
            // Functie om een video te verwijderen
            function removeVideo(index) {
                const updatedVideos = [...mediaVideos];
                updatedVideos.splice(index, 1);
                
                editPostAction({
                    meta: {
                        ...meta,
                        media_videos: updatedVideos
                    }
                });
            }
            
            // Maak de afbeelding items aan
            const imageItems = [];
            for (let i = 0; i < mediaGallery.length; i++) {
                const url = mediaGallery[i];
                imageItems.push(
                    el('div', {
                        key: 'img-' + i,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            padding: '5px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px'
                        }
                    }, [
                        el('img', {
                            src: url,
                            style: {
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                marginRight: '10px',
                                borderRadius: '3px'
                            }
                        }),
                        el('div', {
                            style: {
                                flex: 1,
                                overflow: 'hidden'
                            }
                        }, [
                            el('div', {
                                style: {
                                    fontSize: '12px',
                                    color: '#555',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }, url)
                        ]),
                        el(Button, {
                            isDestructive: true,
                            variant: 'secondary',
                            onClick: function() {
                                removeImage(i);
                            }
                        }, 'Verwijder')
                    ])
                );
            }
            
            // Maak de video items aan
            const videoItems = [];
            for (let i = 0; i < mediaVideos.length; i++) {
                const url = mediaVideos[i];
                videoItems.push(
                    el('div', {
                        key: 'video-' + i,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            padding: '5px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px'
                        }
                    }, [
                        el('div', {
                            style: {
                                flex: 1,
                                overflow: 'hidden'
                            }
                        }, [
                            el('div', {
                                style: {
                                    fontSize: '12px',
                                    color: '#555',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }, url)
                        ]),
                        el(Button, {
                            isDestructive: true,
                            variant: 'secondary',
                            onClick: function() {
                                removeVideo(i);
                            }
                        }, 'Verwijder')
                    ])
                );
            }
            
            // Maak en geef de sidebar UI component terug
            return el('div', {}, [
                el(PluginSidebarMoreMenuItem, {
                    target: 'media-gallery-sidebar',
                    icon: 'format-gallery'
                }, 'Media Galerij'),
                el(PluginSidebar, {
                    name: 'media-gallery-sidebar',
                    title: 'Media Galerij',
                    icon: 'format-gallery'
                }, [
                    el(PanelBody, {
                        title: 'Afbeeldingen',
                        initialOpen: true
                    }, [
                        el(MediaUploadCheck, {}, [
                            el(MediaUpload, {
                                onSelect: addImages,
                                allowedTypes: ['image'],
                                multiple: true,
                                value: mediaGallery,
                                render: function(props) {
                                    return el(Button, {
                                        isPrimary: true,
                                        onClick: props.open,
                                        style: {
                                            marginBottom: '10px',
                                            display: 'block',
                                            width: '100%'
                                        }
                                    }, 'Selecteer afbeeldingen');
                                }
                            })
                        ]),
                        el('div', {}, imageItems.length ? imageItems : 'Geen afbeeldingen geselecteerd.')
                    ]),
                    el(PanelBody, {
                        title: 'Video\'s',
                        initialOpen: false
                    }, [
                        el(MediaUploadCheck, {}, [
                            el(MediaUpload, {
                                onSelect: addVideos,
                                allowedTypes: ['video'],
                                multiple: true,
                                value: mediaVideos,
                                render: function(props) {
                                    return el(Button, {
                                        isPrimary: true,
                                        onClick: props.open,
                                        style: {
                                            marginBottom: '10px',
                                            display: 'block',
                                            width: '100%'
                                        }
                                    }, 'Selecteer video\'s');
                                }
                            })
                        ]),
                        el('div', {}, videoItems.length ? videoItems : 'Geen video\'s geselecteerd.')
                    ])
                ])
            ]);
        };
        
        // Registreer de plugin
        registerPlugin('vsgtalent-media-gallery', {
            render: MediaGalleryComponent,
            icon: 'format-gallery'
        });
        
        console.log('VSGTalent: Media galerij sidebar succesvol geregistreerd');
    }
})();
