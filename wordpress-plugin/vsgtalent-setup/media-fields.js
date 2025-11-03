const { registerPlugin } = wp.plugins;
const { PluginSidebar } = wp.editPost;
const { PanelBody, Button, TextControl } = wp.components;
const { useSelect, useDispatch } = wp.data;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;

registerPlugin('vsgtalent-media-fields', {
  render: function() {
    const postId = useSelect(select => select('core/editor').getCurrentPostId());
    const { editPost } = useDispatch('core/editor');
    const meta = useSelect(select => select('core/editor').getEditedPostAttribute('meta') || {});
    
    const mediaGallery = meta.media_gallery || [];
    const mediaVideos = meta.media_videos || [];
    
    const onSelectImages = (images) => {
      const urls = images.map(img => img.source_url);
      editPost({ meta: { ...meta, media_gallery: urls } });
    };
    
    const onSelectVideos = (videos) => {
      const urls = videos.map(vid => vid.source_url);
      editPost({ meta: { ...meta, media_videos: urls } });
    };
    
    const removeImage = (index) => {
      const updated = mediaGallery.filter((_, i) => i !== index);
      editPost({ meta: { ...meta, media_gallery: updated } });
    };
    
    const removeVideo = (index) => {
      const updated = mediaVideos.filter((_, i) => i !== index);
      editPost({ meta: { ...meta, media_videos: updated } });
    };
    
    return (
      <PluginSidebar name="vsgtalent-media" title="📸 Media Galerij & Video's">
        <PanelBody title="Afbeeldingen" initialOpen={true}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImages}
              allowedTypes={['image']}
              multiple={true}
              render={({ open }) => (
                <Button onClick={open} isPrimary>
                  Afbeeldingen toevoegen
                </Button>
              )}
            />
          </MediaUploadCheck>
          <div style={{ marginTop: '10px' }}>
            {mediaGallery.map((url, index) => (
              <div key={index} style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <img src={url} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                <span style={{ flex: 1, fontSize: '12px', wordBreak: 'break-all' }}>{url}</span>
                <Button onClick={() => removeImage(index)} isDestructive isSmall>
                  Verwijder
                </Button>
              </div>
            ))}
          </div>
        </PanelBody>
        
        <PanelBody title="Video's" initialOpen={false}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectVideos}
              allowedTypes={['video']}
              multiple={true}
              render={({ open }) => (
                <Button onClick={open} isPrimary>
                  Video's toevoegen
                </Button>
              )}
            />
          </MediaUploadCheck>
          <div style={{ marginTop: '10px' }}>
            {mediaVideos.map((url, index) => (
              <div key={index} style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ flex: 1, fontSize: '12px', wordBreak: 'break-all' }}>{url}</span>
                <Button onClick={() => removeVideo(index)} isDestructive isSmall>
                  Verwijder
                </Button>
              </div>
            ))}
          </div>
        </PanelBody>
      </PluginSidebar>
    );
  }
});
