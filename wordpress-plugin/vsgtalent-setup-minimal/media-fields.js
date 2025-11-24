(function() {
    var registerPlugin = wp.plugins.registerPlugin;
    var PluginSidebar = wp.editPost.PluginSidebar;
    var PluginSidebarMoreMenuItem = wp.editPost.PluginSidebarMoreMenuItem;
    var el = wp.element.createElement;
    var PanelBody = wp.components.PanelBody;
    var Button = wp.components.Button;
    var Fragment = wp.element.Fragment;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var useSelect = wp.data.useSelect;
    var useDispatch = wp.data.useDispatch;

    function MediaGalleryEditor() {
        var postId = useSelect(function(select) {
            return select('core/editor').getCurrentPostId();
        }, []);
        
        var editPost = useDispatch('core/editor').editPost;
        
        var meta = useSelect(function(select) {
            return select('core/editor').getEditedPostAttribute('meta') || {};
        }, []);
        
        var mediaGallery = meta.media_gallery || [];
        var mediaVideos = meta.media_videos || [];
        
        function onSelectImages(images) {
            var urls = images.map(function(img) { return img.url || img.source_url; });
            var updatedMeta = Object.assign({}, meta);
            updatedMeta.media_gallery = urls;
            editPost({ meta: updatedMeta });
        }
        
        function onSelectVideos(videos) {
            var urls = videos.map(function(vid) { return vid.url || vid.source_url; });
            var updatedMeta = Object.assign({}, meta);
            updatedMeta.media_videos = urls;
            editPost({ meta: updatedMeta });
        }
        
        function removeImage(index) {
            var updated = mediaGallery.filter(function(_, i) { return i !== index; });
            var updatedMeta = Object.assign({}, meta);
            updatedMeta.media_gallery = updated;
            editPost({ meta: updatedMeta });
        }
        
        function removeVideo(index) {
            var updated = mediaVideos.filter(function(_, i) { return i !== index; });
            var updatedMeta = Object.assign({}, meta);
            updatedMeta.media_videos = updated;
            editPost({ meta: updatedMeta });
        }

        // Create image items
        var imageItems = [];
        for (var i = 0; i < mediaGallery.length; i++) {
            var url = mediaGallery[i];
            imageItems.push(
                el('div', { 
                    key: 'img-' + i,
                    style: { 
                        marginBottom: '8px', 
                        display: 'flex', 
                        alignItems: 'center'
                    } 
                }, [
                    el('img', { 
                        src: url, 
                        style: { 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover',
                            marginRight: '8px'
                        } 
                    }),
                    el('span', { 
                        style: { 
                            flex: 1, 
                            fontSize: '12px', 
                            wordBreak: 'break-all'
                        } 
                    }, url),
                    el(Button, { 
                        isDestructive: true, 
                        onClick: removeImage.bind(null, i)
                    }, 'Verwijder')
                ])
            );
        }

        // Create video items
        var videoItems = [];
        for (var j = 0; j < mediaVideos.length; j++) {
            var videoUrl = mediaVideos[j];
            videoItems.push(
                el('div', { 
                    key: 'vid-' + j,
                    style: { 
                        marginBottom: '8px', 
                        display: 'flex', 
                        alignItems: 'center' 
                    } 
                }, [
                    el('span', { 
                        style: { 
                            flex: 1, 
                            fontSize: '12px', 
                            wordBreak: 'break-all',
                            marginRight: '8px'
                        } 
                    }, videoUrl),
                    el(Button, { 
                        isDestructive: true, 
                        onClick: removeVideo.bind(null, j)
                    }, 'Verwijder')
                ])
            );
        }

        return el(Fragment, {}, [
            el(PluginSidebarMoreMenuItem, {
                target: 'vsgtalent-media'
            }, '📸 Media Galerij & Video\'s'),
            el(PluginSidebar, {
                name: 'vsgtalent-media',
                title: '📸 Media Galerij & Video\'s',
                icon: 'format-gallery'
            }, [
                el(PanelBody, { 
                    title: 'Afbeeldingen', 
                    initialOpen: true 
                }, [
                    el(MediaUploadCheck, {}, [
                        el(MediaUpload, {
                            onSelect: onSelectImages,
                            allowedTypes: ['image'],
                            multiple: true,
                            render: function(obj) {
                                return el(Button, { 
                                    isPrimary: true, 
                                    onClick: obj.open,
                                    style: { width: '100%', marginBottom: '10px' }
                                }, 'Afbeeldingen toevoegen');
                            }
                        })
                    ]),
                    el('div', { style: { marginTop: '10px' } }, imageItems)
                ]),
                el(PanelBody, { 
                    title: 'Video\'s', 
                    initialOpen: false 
                }, [
                    el(MediaUploadCheck, {}, [
                        el(MediaUpload, {
                            onSelect: onSelectVideos,
                            allowedTypes: ['video'],
                            multiple: true,
                            render: function(obj) {
                                return el(Button, { 
                                    isPrimary: true, 
                                    onClick: obj.open,
                                    style: { width: '100%', marginBottom: '10px' }
                                }, 'Video\'s toevoegen');
                            }
                        })
                    ]),
                    el('div', { style: { marginTop: '10px' } }, videoItems)
                ])
            ])
        ]);
    }

    registerPlugin('vsgtalent-media-fields', {
        icon: 'format-gallery',
        render: MediaGalleryEditor
    });
})();
