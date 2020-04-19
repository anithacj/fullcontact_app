<script id="tmpl-gt3-media-status" type="text/html">{{{ data.length }}}<# if ( data.length % 10 !== 1 ) { #>{{{ i18n_GT3Media_Gallery.multiple }}} <# } else {#>{{{ i18n_GT3Media_Gallery.single }}} <# } #></script>

<script id="tmpl-gt3-image-item" type="text/html">
	<div class="gt3-media-preview">
		<div class="gt3-media-content">
			<div class="centered">
				<# if ( 'image' === data.type && data.sizes ) { #>
				<# if ( data.sizes.thumbnail ) { #>
				<img src="{{{ data.sizes.thumbnail.url }}}">
				<# } else { #>
				<img src="{{{ data.sizes.full.url }}}">
				<# } #>
				<# } else { #>
				<# if ( data.image && data.image.src && data.image.src !== data.icon ) { #>
				<img src="{{ data.image.src }}" />
				<# } else { #>
				<img src="{{ data.icon }}" />
				<# } #>
				<# } #>
			</div>
		</div>
	</div>
	<div class="gt3-overlay"></div>
	<div class="gt3-media-bar">
		<a class="gt3-edit-media" title="{{{ i18n_GT3Media_Gallery.edit }}}" href="{{{ data.editLink }}}" target="_blank"></a>
		<a href="#" class="gt3-remove-media" title="{{{ i18n_GT3Media_Gallery.remove }}}"></a>
	</div>
</script>
