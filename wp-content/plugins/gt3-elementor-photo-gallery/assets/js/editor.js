'use strict';

(function (factory) {
	window.gt3Elementor = window.gt3Elementor || {};
	window.gt3Elementor.Editor = window.gt3Elementor.Editor || {};
	window.gt3Elementor.Editor.Gallery = window.gt3Elementor.Editor.Gallery || {};
	window.gt3Elementor.Editor.Gallery.Photo = window.gt3Elementor.Editor.Gallery.Photo || factory(window.jQuery);
})(function ($) {

	function CoreEditor() {
		if (!this || this.options !== CoreEditor.prototype.options) {
			return new CoreEditor()
		}

		this.initialize();
	}

	$.extend(CoreEditor.prototype, {
		options: {

		},
		initialize: function () {
			var that = this;
			window.elementor.channels.editor.on('section:activated', function (sectionName, editor) {
				var model = editor.getOption('editedElementView').getEditModel(),
					currentElementType = model.get('elType');
				if ('widget' === currentElementType) {
					currentElementType = model.get('widgetType');
				}
			});
			window.elementor.hooks.addAction('panel/open_editor/widget', that['hiddenUpdate'].bind(that));

		},

		hiddenUpdate: function (panel, model, view) {
			panel.$el.on('click', '[data-event="update_widget"]', function () {
				var input = $(this).closest('#elementor-controls').find('[data-setting*="hidden_update"]').eq(0);
				input.val(input.val() === '1' ? '0' : '1').trigger('input');
			});
		},
	});

	return CoreEditor
});

jQuery(window).ready(function () {
	if (typeof window.gt3Elementor.Editor.Gallery.Photo === 'function') {
		window.gt3Elementor.Editor.Gallery.Photo = window.gt3Elementor.Editor.Gallery.Photo();
	}
} );

(function () {
	window.GT3 = window.GT3 || {};
	window.GT3.Editor = window.GT3.Editor || {};
	window.GT3.Editor.Controls = window.GT3.Editor.Controls || {};

	if (window.GT3.Editor.Controls.CoreGallery === undefined) {
		var __ = wp.i18n.__, _n = wp.i18n._n, sprintf = wp.i18n.sprintf;

		var MediaClearButton = Backbone.View.extend({
			className: 'gt3-clear-media button page-title-action',
			tagName: 'a',
			events: {
				click: function () {
					this.controller.clearItems();
				}
			},
			render: function () {
				this.$el.text(__('Clear Gallery', 'gt3_elementor_gallery'));
				return this;
			},

			initialize: function (options) {
				this.controller = options.controller;
				this.render();
			}
		});
		var MediaStatus = Backbone.View.extend({
			tagName: 'span',
			className: 'gt3-media-status',

			initialize: function (options) {
				this.controller = options.controller;

				if (!this.controller.get('showStatus')) {
					this.$el.hide();
				}

				this.listenTo(this.controller, 'change:length', this.render);

				this.render();
			},

			render: function () {
				var length = this.controller.get('length');
				this.$el.html(sprintf(_n('%s image selected', '%s images selected', length, 'gt3_elementor_gallery'), length));
			}
		});
		var MediaButton = Backbone.View.extend({
			className: 'gt3-add-media',
			tagName: 'a',
			events: {
				click: function () {
					if (this._frame) {
						this._frame.dispose();
					}
					var that = this;

					var insertImage = wp.media.controller.Library.extend({
						defaults: _.defaults({
							query: true,
							id: 'insert-image',
							title: __('Select Files', 'gt3_elementor_gallery'),
							multiple: 'add',
							library: wp.media.query({
								post__not_in: this.controller.get('ids'),
								type: 'image'
							}),
							type: 'image'
						}, wp.media.controller.Library.prototype.defaults)
					});

					this._frame = wp.media({
						button: {text: __('Select', 'gt3_elementor_gallery')},
						state: 'insert-image',
						states: [
							new insertImage()
						]
					});

					this._frame.on('select', () => {
						that.controller.addItems(that._frame.state().get('selection').models);
					}, this);

					this._frame.on('open', function () {
						var timeOutID = null;
						that._frame.on('library:selection:add', librarySelectionAdd.bind(this));

						function librarySelectionAdd() {
							var state = that._frame.state(),
								library = state.get('library'),
								selection = state.get('selection'),
								loading = false;

							if (selection && selection.models) {
								loading = _.some(selection.models, function (attachment) {
									return attachment.get('uploading') === true;
								});
								if (loading) {
									clearTimeout(timeOutID);
									timeOutID = setTimeout(librarySelectionAdd.bind(this), 100);
								} else {
									library.add(selection.models)
								}
							}
						}
					});

					this._frame.open();
				}
			},
			render: function () {
				this.$el.text(__('+ Add Media', 'gt3_elementor_gallery'));
				return this;
			},
			initialize: function (options) {
				this.controller = options.controller;

				this.listenTo(this.controller, 'change:full', function () {
					this.$el.toggle(!this.controller.get('full'));
				});

				this.render();
			}
		});
		var MediaItem = Backbone.View.extend({
			tagName: 'div',
			className: 'gt3-image-item',
			initialize: function (options) {
				this.controller = options.controller;
				this.render = this.render.bind(this);
				this.render();
				this.listenTo(this.model, 'change', this.render);
				this.$el.data('id', this.model.cid);
			},

			events: {
				'click .gt3-remove-media': function (e) {
					e.preventDefault();
					e.stopPropagation();
					this.controller.removeItem(this.model);
					return false;
				},

				'click .gt3-edit-media': function (e) {
					e.preventDefault();
					e.stopPropagation();
					if (this._frame) {
						this._frame.dispose();
					}
					this._frame = wp.media({
						frame: 'edit-attachments',
						controller: {
							gridRouter: {
								navigate: function () {
								},
								baseUrl: function () {
								}
							},
						},
						library: this.controller.get('items'),
						model: this.model,
					});
					this._frame.resetRoute = function () {
					};
					this._frame.open();

					return false;
				}
			},

			render: function () {
				var data = Object.assign({}, this.model.attributes);
				var url = data.icon;
				if (data.type === 'image' && data.sizes) {
					url = (data.sizes.thumbnail) ? data.sizes.thumbnail.url : data.sizes.full.url
				} else {
					url = (data.image && data.image.src && data.image.src !== data.icon) ? data.image.src : data.icon
				}
				this.$el.html(`
		<div class="gt3-media-preview" data-id="${data.id}">
			<div class="gt3-media-content">
				<div class="centered"><img src="${url}"></div>
			</div>
		</div>
		<div class="gt3-overlay"></div>
		<div class="gt3-media-bar">
			<a class="gt3-edit-media" title="${__('Edit', 'gt3_elementor_gallery')}" href="${data.editLink}" target="_blank"></a>
			<a href="#" class="gt3-remove-media" title="${__('Remove', 'gt3_elementor_gallery')}"></a>
		</div>`);
				return this;
			}
		});
		var MediaList = Backbone.View.extend({
			tagName: 'div',
			className: 'gt3-media-list',

			initialize: function (options) {
				this._views = {};
				this.controller = options.controller;

				this.setEvents();
				this.render = this.render.bind(this);
			},

			setEvents() {
				this.listenTo(this.controller, 'render', this.render);
			},

			initSortable() {
				var collection = this.controller.get('items');
				this.$el.sortable({
					tolerance: 'pointer',
					handle: '.gt3-overlay',

					start: function (event, ui) {
						ui.item.data('sortableIndexStart', ui.item.index());
					}.bind(this),

					update: function (event, ui) {
						var model = collection.at(ui.item.data('sortableIndexStart'));

						collection.remove(model, {
							silent: true
						});

						collection.add(model, {
							silent: true,
							at: ui.item.index()
						});

						collection.trigger('reset', collection);
						this.controller.saveMedia();
					}.bind(this),
				});
			},

			render() {
				var items = this.controller.get('items');
				this.$el.empty();
				var view;
				if (items && items.length) {
					items.forEach(function (value, key) {
						view = this._views[value.cid] = new MediaItem({
							model: value,
							controller: this.controller
						});
						this.$el.append(view.$el);
					}.bind(this));
				}
				this.initSortable();
			}
		});
		var MediaController = Backbone.Model.extend({
			defaults: {
				maxFiles: 0,
				ids: [],
				forceDelete: false,
				length: 0,
				showStatus: true,
			},

			initialize(options) {
				this.set('ids', _.without(_.map(this.get('ids'), Number), 0, -1));
				this.set('items', new wp.media.model.Attachments());
				this.onChange = options.onChange || function () {
				};

				this.countItems = this.countItems.bind(this);
				this.listenTo(this.get('items'), 'add remove reset change', this.countItems);
			},
			countItems() {
				var items = this.get('items'),
					length = items.length,
					max = this.get('maxFiles');
				this.set('length', length);
				this.set('full', max > 0 && length >= max);
				this.set('ids', items.collect('id'));
				this.trigger('render');
			},
			isEmpty: function () {
				return !this.get('length');
			},

			load() {
				this.starting = true;
				if (!_.isEmpty(this.get('ids'))) {
					this.get('items').props.set({
						query: true,
						include: this.get('ids'),
						orderby: 'post__in',
						order: 'DESC',
						type: 'image',
						perPage: -1
					});
					this.get('items').more();
				}
			},

			removeItem(item) {
				this.get('items').remove(item);
			},

			addItems(items) {
				var _items = this.get('items'),
					new_items = _items.slice();

				new_items = new_items.concat(...items);

				_items.reset(new_items);
			},
			clearItems(force = false) {
				if (force || confirm(__('Are you really want remove all images?', 'gt3_elementor_gallery'))) {
					this.get('items').reset();
				}
			},
			saveMedia() {
				var items = this.get('items');
				this.onChange({
					id_a: items.collect('id'),
					ids: items.collect('id').join(','),
					url: items.map(function (modal) {
						return modal.attributes.sizes && modal.attributes.sizes.large && modal.attributes.sizes.large.url || modal.attributes.url
					}),
					caption: items.collect('caption'),
					description: items.collect('description'),
					title: items.collect('title'),
					json: items.toJSON().map(function (item) {
						return {
							alt: item.alt,
							caption: item.caption,
							description: item.description,
							height: item.height,
							width: item.width,
							id: item.id,
							title: item.title,
							url: item.url,
							sizes: item.sizes,
						}
					}),
					items: items,
				});
			},
		});
		var GalleryView = Backbone.View.extend({
			initialize: function (options) {
				this.controller = new MediaController(_.extend(
					{
						ids: options.value.split(','),
						onChange: options.onChange,
					},
					this.$el.data()
				));
				this.firstLoad = options.firstLoad || false;
				this.controllerChangeLength = this.controllerChangeLength.bind(this);

				this.createList();
				this.createAddButton();
				this.createClearButton();
				this.createStatus();

				this.render();
				this.controller.load();
				this.startTimer = null;
				this.controller.on('change:length', this.controllerChangeLength);
				this.startTimer = setTimeout(function () {
					this.controller.starting = false;
				}.bind(this), 1000);
			},
			controllerChangeLength() {
				if (this.controller.starting) {
					clearTimeout(this.startTimer);
					this.startTimer = setTimeout(function () {
						this.controller.starting = false;
						this.firstLoad && this.controller.saveMedia();
					}.bind(this), 1000);
				} else {
					this.controller.saveMedia();
				}
			},
			createList: function () {
				this.list = new MediaList({
					controller: this.controller,
				});
			},

			createAddButton: function () {
				this.addButton = new MediaButton({controller: this.controller});
			},

			createClearButton: function () {
				this.clearButton = new MediaClearButton({controller: this.controller});
			},

			createStatus: function () {
				this.status = new MediaStatus({controller: this.controller});
			},

			render: function () {
				this.$el.empty().append(
					jQuery('<div/>', {
						class: 'gt3-controls',
						html: [
							this.addButton.el,
							this.clearButton.el,
							this.status.el,
						]
					}),
					this.list.el
				);
			}
		});

		window.GT3.Editor.Controls.CoreGallery = elementor.modules.controls.BaseData.extend({
			onReady: function () {
				this.onChange = this.onChange.bind(this);

				var value = this.getControlValue();
				try {
					value = JSON.parse(value);
					value = value.map(function (item) {
						return item.id;
					}).join(',');
				} catch (ex) {

				}
				if (typeof value !== 'string') {
					value = value.join && value.join(',') || '';
				}

				this.media = new GalleryView({
					el: this.$el,
					value: value,
					onChange: this.onChange,
					firstLoad: false,
				});
			},

			onChange: function (e) {
				this.setValue(e && e.ids || '');
			}
		});
		elementor.addControlView('gt3-elementor-core-gallery', window.GT3.Editor.Controls.CoreGallery);
	}
})();

