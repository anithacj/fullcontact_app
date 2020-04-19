/*!
 Version: 1.0
 Author: GT3 Themes
 Website: https//gt3themes.com
 */

'use strict';

jQuery(function ($) {

	window.gt3 = window.gt3 || {};

	var views = gt3.views = gt3.views || {},
		models = gt3.models = gt3.models || {},
		Controller, MediaField, MediaList, MediaItem, MediaButton, MediaClearButton, ImageField, MediaStatus;

	Controller = models.Controller = Backbone.Model.extend({
		defaults: {
			maxFiles: 0,
			ids: [],
			mimeType: '',
			forceDelete: false,
			length: 0
		},

		initialize: function (options) {
			if ('$input' in options) this.$input = options.$input;
			var that = this;
			this.set('ids', _.without(_.map(this.get('ids'), Number), 0, -1));
			this.set('items', new wp.media.model.Attachments());

			this.listenTo(this.get('items'), 'add remove reset', function () {
				var items = this.get('items'),
					length = items.length,
					max = this.get('maxFiles');
				this.set('length', length);
				this.set('full', max > 0 && length >= max);
			});

			this.on('destroy', function (e) {
				if (this.get('forceDelete')) {
					this.get('items').each(function (item) {
						item.destroy();
					});
				}
			});
		},

		load: function () {
			var that = this;
			this.starting = true;
			if (!_.isEmpty(this.get('ids'))) {
				this.get('items').props.set({
					query: true,
					include: this.get('ids'),
					orderby: 'post__in',
					order: 'DESC',
					type: this.get('mimeType'),
					perPage: this.get('maxFiles') || -1
				});
				this.get('items').more();
			}
			setTimeout(function () {
				that.starting = false;
				that.get('items').more();
			}, 1000);
		},

		removeItem: function (item) {
			this.get('items').remove(item);
			if (this.get('forceDelete')) {
				item.destroy();
			}
			this.saveToInput();
		},

		addItems: function (items) {
			var _items = this.get('items');
			$.each(items, function (k, v) {
				_items.add(v, {at: 0});
			});
			this.saveToInput();
		},
		clearItems: function (force) {
			if (confirm(i18n_GT3Media_Gallery.clearAllConfirm) || force === true) {
				var items = this.get('items');
				while (this.get('items').length) {
					items.remove(items.models[0]);
					items = this.get('items')
				}
				this.saveToInput();
			}
		},
		saveToInput: function () {
			var items = this.get('items').collect('id');
			this.$input.trigger('focus').val(items.join(',')).trigger('change').trigger('blur').trigger('input');
		},
		getItemsIds: function () {
			return this.get('items').collect('id');
		}
	});

	MediaField = views.MediaField = Backbone.View.extend({
		initialize: function (options) {
			var that = this;
			this.$input = $(options.input);
			this.controller = new Controller(_.extend(
				{
					fieldName: this.$input.attr('name'),
					ids: this.$input.val().split(','),
					$input: this.$input,
				},
				this.$el.data()
			));
			this.createList();
			this.createAddButton();
			this.createClearButton();
			this.createStatus();

			this.render();

			this.controller.load();

			this.$input.on('remove', function () {
				that.controller.destroy();
			});

			this.controller.on('change:length', function (e) {
				that.$input.trigger('change');
			});
		},

		createList: function () {
			this.list = new MediaList({controller: this.controller});
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
				this.addButton.el,
				this.clearButton.el,
				this.status.el,
				this.list.el
			);
		}
	});

	MediaList = views.MediaList = Backbone.View.extend({
		tagName: 'ul',
		className: 'gt3-media-list',

		addItemView: function (item) {
			var view = this._views[item.cid] = new this.itemView({
				model: item,
				controller: this.controller
			});

			if (this.controller.starting === true) {
				this.$el.append(view.el);
			} else {
				this.$el.prepend(view.el);
			}
		},

		removeItemView: function (item) {
			if (this._views[item.cid]) {
				this._views[item.cid].remove();
				delete this._views[item.cid];
			}
		},

		initialize: function (options) {
			this._views = {};
			this.controller = options.controller;
			this.itemView = options.itemView || MediaItem;

			this.setEvents();

			this.initSortable();
		},

		setEvents: function () {
			this.listenTo(this.controller.get('items'), 'add', this.addItemView);
			this.listenTo(this.controller.get('items'), 'remove', this.removeItemView);
		},

		initSortable: function () {
			var that = this;
			var collection = this.controller.get('items');
			this.$el.sortable({
				tolerance: 'pointer',
				handle: '.gt3-overlay',

				// Record the initial `index` of the dragged model.
				start: function (event, ui) {
					ui.item.data('sortableIndexStart', ui.item.index());
				},

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
					that.controller.saveToInput();
				}
			});
		}
	});

	/***
	 * MediaStatus
	 * Tracks status of media field if maxStatus is greater than 0
	 */
	MediaStatus = views.MediaStatus = Backbone.View.extend({
		tagName: 'span',
		className: 'gt3-media-status',
		template: wp.template('gt3-media-status'),

		//Initialize
		initialize: function (options) {
			this.controller = options.controller;

			//Auto hide if showStatus is false
			if (!this.controller.get('showStatus')) {
				this.$el.hide();
			}

			//Rerender if changes happen in controller
			this.listenTo(this.controller, 'change:length', this.render);

			//Render
			this.render();
		},

		render: function () {
			var attrs = _.clone(this.controller.attributes);
			this.$el.html(this.template(attrs));
		}
	});

	/***
	 * Media Button
	 * Selects and adds ,edia to controller
	 */
	MediaButton = views.MediaButton = Backbone.View.extend({
		className: 'gt3-add-media button button-primary',
		tagName: 'a',
		events: {
			click: function () {
				// Destroy the previous collection frame.
				if (this._frame) {
					this._frame.dispose();
				}

				this._frame = wp.media({
					query: true,
					exclude: this.controller.getItemsIds(),
					className: 'media-frame gt3-media-frame',
					multiple: true,
					title: i18n_GT3Media_Gallery.select,
					editing: true,
					library: {
						type: 'image'
					},
				});

				this._frame.on('select', function () {
					var selection = this._frame.state().get('selection');
					this.controller.addItems(selection.models);
				}, this);

				this._frame.open();
			}
		},
		render: function () {
			this.$el.text(i18n_GT3Media_Gallery.add);
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

	MediaClearButton = views.MediaClearButton = Backbone.View.extend({
		className: 'gt3-clear-media button page-title-action',
		tagName: 'a',
		events: {
			click: function () {
				this.controller.clearItems();
			}
		},
		render: function () {
			this.$el.text(i18n_GT3Media_Gallery.clearGallery);
			return this;
		},

		initialize: function (options) {
			this.controller = options.controller;

			this.render();
		}
	});

	MediaItem = views.MediaItem = Backbone.View.extend({
		tagName: 'li',
		className: 'gt3-media-item',
		template: wp.template('gt3-media-item'),
		initialize: function (options) {
			this.controller = options.controller;
			this.render();
			this.listenTo(this.model, 'change', function () {
				this.render();
			});

			this.$el.data('id', this.model.cid);
		},


		events: {
			'click .gt3-remove-media': function (e) {
				this.controller.removeItem(this.model);
				return false;
			},

			'click .gt3-edit-media': function (e) {
				if (this._frame) {
					this._frame.dispose();
				}

				this._frame = wp.media({
					frame: 'edit-attachments',
					controller: {
						gridRouter: {
							navigate: function (destination) {
							},
							baseUrl: function (url) {
							}
						}
					},
					library: this.controller.get('items'),
					model: this.model
				});

				this._frame.open();

				return false;
			}
		},

		render: function () {
			var attrs = _.clone(this.model.attributes);
			attrs.fieldName = this.controller.get('fieldName');
			this.$el.html(this.template(attrs));
			return this;
		}
	});

	ImageField = views.ImageField = MediaField.extend({
		createList: function () {
			this.list = new MediaList({
				controller: this.controller,
				itemView: MediaItem.extend({
					className: 'gt3-image-item',
					template: wp.template('gt3-image-item')
				})
			});
		}
	});

	function initImageField(event, element) {
		new ImageField({input: element, el: $(element).siblings('div.gt3-media-view')});
	}

	$('input.gt3-image_advanced').each(initImageField);
});
