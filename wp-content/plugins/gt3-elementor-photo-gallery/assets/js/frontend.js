/*!
 Version: 1.0
 Author: GT3 Themes
 Website: https//gt3themes.com
 */

if (typeof onYouTubeIframeAPIReady !== "function") {
	// safe to use the function
	function onYouTubeIframeAPIReady() {
		jQuery('html').addClass('yt_ready');
	}
}

(function (factory) {
	'use strict'
	// Browser globals:
	window.GT3ElementorGalleryFrontend = factory(window.jQuery)();
})(function ($) {
	'use strict'

	function GT3ElementorGalleryFrontend() {
		if (!this || this.widgets !== GT3ElementorGalleryFrontend.prototype.widgets) {
			return new GT3ElementorGalleryFrontend()
		}
		this.initialize();
	}

	$.extend(GT3ElementorGalleryFrontend.prototype, {
		widgets: {
			'shift-gallery-gt3': 'ShiftGallery',
			'kenburns-gt3': 'KenburnsGallery',
			'fs-slider-gt3': 'FullScreenSlider',
			'ribbon-gt3': 'Ribbon',
			'flow-gt3': 'Flow',
			'packery-gt3': 'PackeryGallery',
			'masonry-gt3': 'MasonryGallery',
			'grid-gt3': 'GridGallery',
		},
		body: $('body'),
		html: $('html'),
		window: $(window),
		adminbar: $('#wpadminbar'),
		is_admin: false,
		windowSize: {
			width: 1920,
			height: 1080,
			orientation: 'landscape',
			ratio: 1.778
		},
		page_title: $('.gt3-page-title_wrapper'),
		header: $('.gt3_header_builder'),
		header_over_bg: $('.gt3_header_builder').hasClass('header_over_bg'),
		is_single: $('body').hasClass('single-gallery'),
		footer: $('footer'),
		editMode: false,

		getAdminBar: function () {
			if (this.is_admin && !this.adminbar) {
				this.adminbar = $('#wpadminbar');
			}
		},

		scrollTo: function (element, duration) {
			if (this.is_single) {
				$('html, body').animate({
					scrollTop: (element.offset().top - this.adminbar.height())
				}, duration);
			}
		},

		initElementor: function () {
			var that = this;

			if (typeof window.elementorFrontend !== 'undefined') {
				$.each(that.widgets, function (name, callback) {
					window.elementorFrontend.hooks.addAction('frontend/element_ready/' + name + '.default', that[callback].bind(that));
				})

				this.editMode = !!window.elementorFrontend.config.isEditMode;
			}
		},

		initialize: function () {
			var that = this;
			that.window.on('elementor/frontend/init', that['initElementor'].bind(that));

			$(window).on('load', function () {
				that.adminbar = $('#wpadminbar');
				that.is_admin = !!that.adminbar.length;
			});

			$(window).on('resize', that.resize.bind(that))
			that.resize();
		},
		resize: function () {
			this.windowSize.width = this.window.width();
			this.windowSize.height = this.window.height();
			this.windowSize.ratio = parseFloat(this.windowSize.width / this.windowSize.height).toFixed(3);
			this.windowSize.orientation = this.windowSize.ratio >= 1 ? 'landscape' : 'portrait';
		},
		array_chunk: function (input, size) {
			if (Array.isArray(input)) {
				for (var x, i = 0, c = -1, l = input.length, n = []; i < l; i++) {
					(x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
				}
				return n;
			}
			return input;
		},

		getElementImage: function (element) {
			var src = '';
			if (length in element) {
				switch (element[0].nodeName) {
					case 'IMG':
						src = this.getSrcFromElement(element);
						break;
					default:
						var img = $('img', element);
						if (img.length) {
							src = this.getSrcFromElement(img);
						} else {
							src = src.attr('data-src') || src.attr('data-bg') || '';
						}
						break;
				}
			} else {
				src = this.getSrcFromElement(element);
			}
			return src;
		},
		getSrcFromElement: function (element) {
			if (length in element) {
				element = element[0];
			}
			if (element.tagName !== 'IMG') return '';
			return element.currentSrc || element.src || '';
		},
		ShiftGallery: function ($scope) {
			var that = this;

			var shift_gallery_wrapper = $scope.hasClass('shift_gallery_wrapper') ? $scope : jQuery('.shift_gallery_wrapper', $scope);
			if (!shift_gallery_wrapper.length) {
				console.warn('Shift slider wrapper not found');
				return;
			} else if (shift_gallery_wrapper.hasClass('started')) {
				console.error('Slider Inited');
				return;
			}


			var shift_gallery = jQuery('.shift_gallery', $scope),
				shift_gallery_act,
				shift_slide = jQuery('.shift_slide', $scope),
				shift_gal_array = [];
			var counter = 0;
			var settings = shift_gallery_wrapper.data('settings');
			var interval = null;
			var even_max_slide = jQuery('.even_slide', $scope).length;
			var odd_max_slide = jQuery('.odd_slide', $scope).length;
			var cur_slide_even = 1, cur_slide_odd = 1;

			if (!that.editMode) {

				jQuery(document.documentElement).keydown(function (event) {
					if (jQuery('.hovered_shift_module', $scope).length > 0) {
						if ((event.keyCode === 40)) {
							event.preventDefault();
						}
						if ((event.keyCode === 38)) {
							event.preventDefault();
						}
						if ((event.keyCode === 37)) {
							event.preventDefault();
						}
						if ((event.keyCode === 39)) {
							event.preventDefault();
						}
					}
				});
				jQuery(document.documentElement).keyup(function (event) {
					if ((event.keyCode === 40)) {
						if (shift_gallery_wrapper.hasClass('hovered_shift_module')) {
							event.preventDefault();
							shift_nextSlide();
						}
					}
					if ((event.keyCode === 38)) {
						if (shift_gallery_wrapper.hasClass('hovered_shift_module')) {
							event.preventDefault();
							shift_prevSlide();
						}
					}
					if ((event.keyCode === 37)) {
						if (shift_gallery_wrapper.hasClass('hovered_shift_module')) {
							event.preventDefault();
							if (!shift_gallery_wrapper.hasClass('now_animate') && settings.expandeble) {
								if (!shift_gallery_wrapper.hasClass('fullview')) {
									clearInterval(interval);
									shift_gallery_wrapper.find('.shift_odd_current').addClass('slide_fullview');
									shift_gallery_wrapper.addClass('fullview');
								} else {
									if (settings.autoplay) {
										interval = setInterval(shift_nextSlide, settings.interval);
									}
									shift_gallery_wrapper.find('.shift_even_current').removeClass('slide_fullview');
									shift_gallery_wrapper.find('.shift_odd_current').removeClass('slide_fullview');
									shift_gallery_wrapper.removeClass('fullview');
								}
							}
						}
					}
					if ((event.keyCode === 39)) {
						if (shift_gallery_wrapper.hasClass('hovered_shift_module')) {
							event.preventDefault();
							if (!shift_gallery_wrapper.hasClass('now_animate') && settings.expandeble) {
								if (!shift_gallery_wrapper.hasClass('fullview')) {
									clearInterval(interval);
									shift_gallery_wrapper.find('.shift_even_current').addClass('slide_fullview');
									shift_gallery_wrapper.addClass('fullview');
								} else {
									if (settings.autoplay) {
										interval = setInterval(shift_nextSlide, settings.interval);
									}
									shift_gallery_wrapper.find('.shift_even_current').removeClass('slide_fullview');
									shift_gallery_wrapper.find('.shift_odd_current').removeClass('slide_fullview');
									shift_gallery_wrapper.removeClass('fullview');
								}
							}
						}
					}
				});

				jQuery('.shift_btn_prev', $scope).on('click', function () {
					shift_prevSlide();
				});
				jQuery('.shift_btn_next', $scope).on('click', function () {
					shift_nextSlide();
				});

				shift_gallery_wrapper.on('mouseenter', function () {
					jQuery(this).addClass('hovered_shift_module');
				}).on('mouseleave', function () {
					jQuery(this).removeClass('hovered_shift_module');
				})

				//Touch Events
				shift_gallery.on("swipeleft", function () {
					if (!shift_gallery_wrapper.hasClass('fullview')) {
						jQuery('.shift_even_current', $scope).addClass('slide_fullview');
						shift_gallery_wrapper.addClass('fullview');
					} else {
						jQuery('.shift_even_current', $scope).removeClass('slide_fullview');
						jQuery('.shift_odd_current', $scope).removeClass('slide_fullview');
						shift_gallery_wrapper.removeClass('fullview');
					}
				});
				shift_gallery.on("swiperight", function () {
					if (!shift_gallery_wrapper.hasClass('fullview')) {
						jQuery('.shift_odd_current', $scope).addClass('slide_fullview');
						shift_gallery_wrapper.addClass('fullview');
					} else {
						jQuery('.shift_even_current', $scope).removeClass('slide_fullview');
						jQuery('.shift_odd_current', $scope).removeClass('slide_fullview');
						shift_gallery_wrapper.removeClass('fullview');
					}
				});
				shift_gallery.on("swipeup", function () {
					shift_nextSlide();
				});
				shift_gallery.on("swipedown", function () {
					shift_prevSlide();
				});

				var lastChange = null;
				shift_gallery.on('mousewheel', function (event) {
					if (+new Date() - lastChange > 100) {
						var half_screen = jQuery(window).width() / 2;
						if (event.deltaY < 0) {
							if (event.pageX <= half_screen) {
								shift_nextSlide();
							} else {
								shift_prevSlide();
							}
						}
						if (event.deltaY > 0) {
							if (event.pageX <= half_screen) {
								shift_prevSlide();
							} else {
								shift_nextSlide();
							}
						}
						lastChange = +new Date();
					} else {
						lastChange = +new Date();
					}
					event.preventDefault();
				});

				jQuery($scope).on("click", ".shift_slide", function () {
					if (!shift_gallery_wrapper.hasClass('now_animate') && settings.expandeble) {
						jQuery(this).toggleClass('slide_fullview');
						shift_gallery_wrapper.toggleClass('fullview');
						if (jQuery(this).hasClass('slide_fullview')) {
							clearInterval(interval);
						} else {
							if (settings.autoplay) {
								interval = setInterval(shift_nextSlide, settings.interval);
							}
						}
					}
				});
			}

			jQuery(window).resize(function () {
				setup_shift_gallery();
			});



			function shift_prevSlide() {
				if (!shift_gallery_wrapper.hasClass('fullview') && !shift_gallery_wrapper.hasClass('now_animate')) {

					if (even_max_slide < 5 && odd_max_slide < 5) {
						shift_gallery_wrapper.find('.shift_gallery').addClass('prev_power');
					}

					cur_slide_even--;
					cur_slide_odd--;

					if (!settings.infinity) {
						shift_gallery_wrapper.removeClass('reached_top');
						shift_gallery_wrapper.removeClass('reached_bottom');
						if (cur_slide_even >= even_max_slide && cur_slide_odd >= odd_max_slide) {
							shift_gallery_wrapper.addClass('reached_bottom');
						}
						if (cur_slide_even <= 1 && cur_slide_odd <= 1) {
							shift_gallery_wrapper.addClass('reached_top');
						}
					}

					if (settings.infinity) {
						if (cur_slide_even > even_max_slide) cur_slide_even = 1;
						if (cur_slide_even < 1) cur_slide_even = even_max_slide;

						if (cur_slide_odd > odd_max_slide) cur_slide_odd = 1;
						if (cur_slide_odd < 1) cur_slide_odd = odd_max_slide;
					} else {
						if (cur_slide_even > even_max_slide) cur_slide_even = even_max_slide;
						if (cur_slide_even < 1) cur_slide_even = 1;

						if (cur_slide_odd > odd_max_slide) cur_slide_odd = odd_max_slide;
						if (cur_slide_odd < 1) cur_slide_odd = 1;
					}

					set_shift_Slide(cur_slide_even, cur_slide_odd);
				}
			}

			function shift_nextSlide() {
				if (!shift_gallery_wrapper.hasClass('fullview') && !shift_gallery_wrapper.hasClass('now_animate')) {
					if (shift_gallery_wrapper.find('.shift_gallery').hasClass('started')) {
						if (even_max_slide < 5 && odd_max_slide < 5) {
							shift_gallery_wrapper.find('.shift_gallery').addClass('next_power');
						}
						cur_slide_even++;
						cur_slide_odd++;
						if (!settings.infinity) {
							shift_gallery_wrapper.removeClass('reached_top');
							shift_gallery_wrapper.removeClass('reached_bottom');
							if (cur_slide_even >= even_max_slide && cur_slide_odd >= odd_max_slide) {
								shift_gallery_wrapper.addClass('reached_bottom');
							}
							if (cur_slide_even <= 1 && cur_slide_odd <= 1) {
								shift_gallery_wrapper.addClass('reached_top');
							}
						}


						if (settings.infinity) {
							if (cur_slide_even > even_max_slide) cur_slide_even = 1;
							if (cur_slide_even < 1) cur_slide_even = even_max_slide;

							if (cur_slide_odd > odd_max_slide) cur_slide_odd = 1;
							if (cur_slide_odd < 1) cur_slide_odd = odd_max_slide;
						} else {
							if (cur_slide_even > even_max_slide) cur_slide_even = even_max_slide;
							if (cur_slide_even < 1) cur_slide_even = 1;

							if (cur_slide_odd > odd_max_slide) cur_slide_odd = odd_max_slide;
							if (cur_slide_odd < 1) cur_slide_odd = 1;
						}

						set_shift_Slide(cur_slide_even, cur_slide_odd);
					} else {
						clearInterval(interval);
						interval = setInterval(shift_nextSlide, settings.interval);
					}
				}
			}

			function set_shift_Slide(slideNumEven, slideNumOdd) {
				clearInterval(interval);
				shift_gallery_wrapper.find('.shift_gallery').addClass('now_animate');
				slideNumEven = parseInt(slideNumEven);
				slideNumOdd = parseInt(slideNumOdd);

				if (even_max_slide < 5 && odd_max_slide < 5) {
					shift_gallery_wrapper.find('.shift_even_prev').removeClass('shift_even_prev');
					shift_gallery_wrapper.find('.shift_even_current').removeClass('shift_even_current');
					shift_gallery_wrapper.find('.shift_even_next').removeClass('shift_even_next');

					shift_gallery_wrapper.find('.shift_odd_prev').removeClass('shift_odd_prev');
					shift_gallery_wrapper.find('.shift_odd_current').removeClass('shift_odd_current');
					shift_gallery_wrapper.find('.shift_odd_next').removeClass('shift_odd_next');

					var curSlideEven = shift_gallery_wrapper.find('.even_slide' + slideNumEven);
					var curSlideOdd = shift_gallery_wrapper.find('.odd_slide' + slideNumOdd);
					curSlideEven.addClass('shift_even_current');
					curSlideOdd.addClass('shift_odd_current');

					//EVEN
					if ((parseInt(slideNumEven) + 1) > even_max_slide) {
						var nextSlideEven = shift_gallery_wrapper.find('.even_slide1');
					} else if ((parseInt(slideNumEven) + 1) === even_max_slide) {
						var nextSlideEven = shift_gallery_wrapper.find('.even_slide' + even_max_slide);
					} else {
						var nextSlideEven = shift_gallery_wrapper.find('.even_slide' + (parseInt(slideNumEven) + 1));
					}

					if ((parseInt(slideNumEven) - 1) < 1) {
						var prevSlideEven = shift_gallery_wrapper.find('.even_slide' + even_max_slide);
					} else if ((slideNumEven - 1) === 1) {
						var prevSlideEven = shift_gallery_wrapper.find('.even_slide1');
					} else {
						var prevSlideEven = shift_gallery_wrapper.find('.even_slide' + (parseInt(slideNumEven) - 1));
					}

					prevSlideEven.addClass('shift_even_prev');
					nextSlideEven.addClass('shift_even_next');

					//ODD
					if ((parseInt(slideNumOdd) + 1) > odd_max_slide) {
						var nextSlideOdd = shift_gallery_wrapper.find('.odd_slide1');
					} else if ((parseInt(slideNumOdd) + 1) === odd_max_slide) {
						var nextSlideOdd = shift_gallery_wrapper.find('.odd_slide' + odd_max_slide);
					} else {
						var nextSlideOdd = shift_gallery_wrapper.find('.odd_slide' + (parseInt(slideNumOdd) + 1));
					}

					if ((parseInt(slideNumOdd) - 1) < 1) {
						var prevSlideOdd = shift_gallery_wrapper.find('.odd_slide' + odd_max_slide);
					} else if ((slideNumOdd - 1) === 1) {
						var prevSlideOdd = shift_gallery_wrapper.find('.odd_slide1');
					} else {
						var prevSlideOdd = shift_gallery_wrapper.find('.odd_slide' + (parseInt(slideNumOdd) - 1));
					}

					prevSlideOdd.addClass('shift_odd_prev');
					nextSlideOdd.addClass('shift_odd_next');

					setTimeout(function () {
						shift_gallery.removeClass('prev_power');
						shift_gallery.removeClass('next_power');
					}, 500);

				} else {
					shift_gallery_wrapper.find('.shift_even_prev2').removeClass('shift_even_prev2');
					shift_gallery_wrapper.find('.shift_even_prev').removeClass('shift_even_prev');
					shift_gallery_wrapper.find('.shift_even_current').removeClass('shift_even_current');
					shift_gallery_wrapper.find('.shift_even_next').removeClass('shift_even_next');
					shift_gallery_wrapper.find('.shift_even_next2').removeClass('shift_even_next2');

					shift_gallery_wrapper.find('.shift_odd_prev2').removeClass('shift_odd_prev2');
					shift_gallery_wrapper.find('.shift_odd_prev').removeClass('shift_odd_prev');
					shift_gallery_wrapper.find('.shift_odd_current').removeClass('shift_odd_current');
					shift_gallery_wrapper.find('.shift_odd_next').removeClass('shift_odd_next');
					shift_gallery_wrapper.find('.shift_odd_next2').removeClass('shift_odd_next2');

					var curSlideEven = shift_gallery_wrapper.find('.even_slide' + slideNumEven);
					var curSlideOdd = shift_gallery_wrapper.find('.odd_slide' + slideNumOdd);
					curSlideEven.addClass('shift_even_current');
					curSlideOdd.addClass('shift_odd_current');

					//EVEN
					if ((parseInt(slideNumEven) + 1) > even_max_slide) {
						var nextSlideEven = shift_gallery_wrapper.find('.even_slide1');
						var nextSlideEven2 = shift_gallery_wrapper.find('.even_slide2');
					} else if ((parseInt(slideNumEven) + 1) === even_max_slide) {
						var nextSlideEven = shift_gallery_wrapper.find('.even_slide' + even_max_slide);
						var nextSlideEven2 = shift_gallery_wrapper.find('.even_slide1');
					} else {
						var nextSlideEven = shift_gallery_wrapper.find('.even_slide' + (parseInt(slideNumEven) + 1));
						var nextSlideEven2 = shift_gallery_wrapper.find('.even_slide' + (parseInt(slideNumEven) + 2));
					}

					if ((parseInt(slideNumEven) - 1) < 1) {
						var prevSlideEven = shift_gallery_wrapper.find('.even_slide' + even_max_slide);
						var prevSlideEven2 = shift_gallery_wrapper.find('.even_slide' + (even_max_slide - 1));
					} else if ((slideNumEven - 1) === 1) {
						var prevSlideEven = shift_gallery_wrapper.find('.even_slide1');
						var prevSlideEven2 = shift_gallery_wrapper.find('.even_slide' + even_max_slide);
					} else {
						var prevSlideEven = shift_gallery_wrapper.find('.even_slide' + (parseInt(slideNumEven) - 1));
						var prevSlideEven2 = shift_gallery_wrapper.find('.even_slide' + (parseInt(slideNumEven) - 2));
					}

					prevSlideEven2.addClass('shift_even_prev2');
					prevSlideEven.addClass('shift_even_prev');
					nextSlideEven.addClass('shift_even_next');
					nextSlideEven2.addClass('shift_even_next2');

					//ODD
					if ((parseInt(slideNumOdd) + 1) > odd_max_slide) {
						var nextSlideOdd = shift_gallery_wrapper.find('.odd_slide1');
						var nextSlideOdd2 = shift_gallery_wrapper.find('.odd_slide2');
					} else if ((parseInt(slideNumOdd) + 1) === odd_max_slide) {
						var nextSlideOdd = shift_gallery_wrapper.find('.odd_slide' + odd_max_slide);
						var nextSlideOdd2 = shift_gallery_wrapper.find('.odd_slide1');
					} else {
						var nextSlideOdd = shift_gallery_wrapper.find('.odd_slide' + (parseInt(slideNumOdd) + 1));
						var nextSlideOdd2 = shift_gallery_wrapper.find('.odd_slide' + (parseInt(slideNumOdd) + 2));
					}

					if ((parseInt(slideNumOdd) - 1) < 1) {
						var prevSlideOdd = shift_gallery_wrapper.find('.odd_slide' + odd_max_slide);
						var prevSlideOdd2 = shift_gallery_wrapper.find('.odd_slide' + (odd_max_slide - 1));
					} else if ((slideNumOdd - 1) === 1) {
						var prevSlideOdd = shift_gallery_wrapper.find('.odd_slide1');
						var prevSlideOdd2 = shift_gallery_wrapper.find('.odd_slide' + odd_max_slide);
					} else {
						var prevSlideOdd = shift_gallery_wrapper.find('.odd_slide' + (parseInt(slideNumOdd) - 1));
						var prevSlideOdd2 = shift_gallery_wrapper.find('.odd_slide' + (parseInt(slideNumOdd) - 2));
					}

					prevSlideOdd2.addClass('shift_odd_prev2');
					prevSlideOdd.addClass('shift_odd_prev');
					nextSlideOdd.addClass('shift_odd_next');
					nextSlideOdd2.addClass('shift_odd_next2');
				}
				setTimeout(function () {
					shift_gallery.removeClass('now_animate')
				}, 300);
				if (settings.autoplay) {
					interval = setInterval(shift_nextSlide, settings.interval);
				}
			}

			function setup_shift_gallery() {

				if (shift_gallery_wrapper.find('.even_slide').length === 1) {
					shift_gallery_wrapper.addClass('even_alone');
				}
				if (shift_gallery_wrapper.find('.odd_slide').length === 1) {
					shift_gallery_wrapper.addClass('odd_alone');
				}


				var setHeight = settings.height;
				if (setHeight === '100%' && !that.is_single) {
					setHeight = that.window.height();
					setHeight -= that.adminbar.height();
					if (!that.header_over_bg) {
						setHeight -= that.header.height();
					}
					setHeight -= that.footer.height();
				} else if (setHeight === '100%' && that.is_single) {
					setHeight = that.window.height() - that.adminbar.height();
				}
				setHeight = parseInt(setHeight);
				// fs_slider_wrapper.height(setHeight);

				shift_gallery_wrapper.height(setHeight);
				shift_gallery_wrapper.find('.shift_gallery').height(setHeight);
				shift_gallery_wrapper.find('.shift_slide');
				shift_gallery_wrapper.find('.shift_slide').each(function () {
					jQuery(this).css('transition-duration', settings.transition + 'ms')
						.height(setHeight)
						.find('.img_bg').css('background-image', 'url(' + that.getElementImage($(this)) + ')');
				});


			}

			function run_shift_slider() {
				shift_gallery.addClass('started');
				shift_gallery_wrapper.addClass('started');
				if (shift_gallery_wrapper.find('.shift_even_current').length > 0 && shift_gallery_wrapper.find('.shift_odd_current').length > 0) {
					cur_slide_even = parseInt(shift_gallery_wrapper.find('.shift_even_current').attr('data-count'));
					cur_slide_odd = parseInt(shift_gallery_wrapper.find('.shift_odd_current').attr('data-count'));
					set_shift_Slide(cur_slide_even, cur_slide_odd);
				} else {
					if (!settings.infinity) {
						shift_gallery_wrapper.addClass('reached_top');
					}
					set_shift_Slide(1, 1);
				}
				setup_shift_gallery();
				that.scrollTo(shift_gallery_wrapper, 800);
			}

			function init_pp4shift() {
				if (jQuery('.shift_block2preload:first', $scope).length > 0) {
					var $this_obj = jQuery('.shift_block2preload:first', $scope);
					(function (img, src) {
						img.src = src;
						img.onload = function () {
							$this_obj.removeClass('shift_block2preload').addClass('block_loaded').animate({
								'z-index': '3'
							}, 100, function () {
								init_pp4shift();
							});
						};
					}(new Image(), that.getElementImage($this_obj)));

					if (!shift_gallery.hasClass('started')) {
						if ($('.odd_slide1', $scope).hasClass('block_loaded') && $('.even_slide1', $scope).hasClass('block_loaded')) {
							run_shift_slider();
						}
					}

					// if (($this_obj.parents('.shift_gallery_wrapper').find('.odd_slide1').hasClass('block_loaded') && $this_obj.parents('.shift_gallery_wrapper').find('.even_slide1').hasClass('block_loaded')) && !$this_obj.parents('.shift_gallery_wrapper').find('.shift_gallery').hasClass('started')) {
					// 	run_shift_slider();
					// }
				} else {
					shift_gallery.removeClass('wait4load');
					if (!shift_gallery.hasClass('started')) {
						if ($('.odd_slide1', $scope).hasClass('block_loaded') && $('.even_slide1', $scope).hasClass('block_loaded')) {
							run_shift_slider();
						}
					}
				}
			}

			setup_shift_gallery();
			if (jQuery('.shift_block2preload', $scope).length > 0) {
				//Run Preloading Shift Items
				init_pp4shift();
			} else {
				run_shift_slider();
			}


		},
		PackeryGallery: function ($scope) {
			var that = this;
			var wrapper = $scope.hasClass('packery_wrapper') ? $scope : jQuery('.packery_wrapper', $scope);
			if (!wrapper.length) {
				return;
			}

			var isotope = jQuery('.isotope_wrapper', $scope);

			var query = wrapper.data('settings');
			query.action = 'gt3_packery_load_images';


			var pad = wrapper.data('margin') || 0,
				images = this.array_chunk(wrapper.data('images'), query.load_items),
				packery = query.packery,
				wrap_width_origin, index, width, height, wrap_width, wrap_height,
				wrap_ratio, img_ratio;

			var paged = 0,
				max_page = images.length,
				lightbox = query.lightbox,
				lightbox_array,
				lightbox_obj,
				gap;

			if (lightbox) {
				lightbox_array = window['images' + query.uid];
				if (!that.editMode) {
					wrapper.on('click', '.lightbox', function (event) {
						event.preventDefault();
						event.stopPropagation();
						var options = {
							index: $(this).closest('.isotope_item').index(),
							container: '#popup_gt3_elementor_gallery',
							event: event,
							instance: query.uid
						};

						lightbox_obj = blueimp.ElementorGallery(lightbox_array, options);
					});
				}
			}

			query.packery = null;

			function resize() {
				if (query.gap_unit === '%') {
					gap = (wrapper.width() * parseFloat(query.gap_value) / 100).toFixed(2);
					isotope.find('.isotope_item').css('padding-right', gap + 'px').css('padding-bottom', gap + 'px');
				}


				var grid = packery.grid;
				var lap = packery.lap;

				if ($(window).outerWidth() < 600) {
					grid = 1;
				} else if ($(window).outerWidth() < 900 && (grid % 2 === 0)) {
					lap = lap / 2;
					grid /= 2;
				}

				wrap_width_origin = Math.floor(isotope.width() / grid);

				var local_key = 0;
				wrapper.find('img').each(function (key, value) {
					if ($(window).outerWidth() < 600) {

						var img = $(this);
						var parent = img.closest('.isotope_item');
						parent
							.css('height', 'auto')
							.css('width', 'auto')
							.attr('data-ratio', '');

						img.attr('data-ratio', '')
							.closest('.img').css('height', 'auto').css('width', 'auto')
					} else {
						var img = $(this);
						var parent = img.closest('.isotope_item');
						wrap_height = wrap_width = wrap_width_origin;

						index = local_key % lap + 1;
						if (index in packery.elem) {
							if ('w' in packery.elem[index] && packery.elem[index].w > 1) {
								wrap_width = wrap_width_origin * packery.elem[index].w;
							}
							if ('h' in packery.elem[index] && packery.elem[index].h > 1) {
								wrap_height = wrap_width_origin * packery.elem[index].h;
							}
						}

						local_key++


						wrap_ratio = (wrap_width / wrap_height);
						img_ratio = ((img.attr('width') || 1) / (img.attr('height') || 1));
						if (wrap_ratio > img_ratio) img_ratio = 0.5;

						parent
							.css('height', Math.floor(wrap_height))
							.css('width', Math.floor(wrap_width))
							.attr('data-ratio', wrap_ratio >= 1 ? 'landscape' : 'portrait');

						img.attr('data-ratio', img_ratio >= 1 ? 'landscape' : 'portrait')
							.closest('.img').css('height', parent.height()).css('width', parent.width())
					}
				});
				isotope.isotope({
					layoutMode: 'masonry',
					itemSelector: '.isotope_item',
					masonry: {
						columnWidth: wrap_width_origin
					}
				}).isotope('reLayout');
			}

			resize();
			isotope.imagesLoaded(function () {
				resize();
				showImages();
			});

			if (!that.editMode) {
				$scope.on("click", ".isotope-filter a", function (e) {
					e.preventDefault();
					var data_filter = this.getAttribute("data-filter");
					jQuery(this).siblings().removeClass("active");
					jQuery(this).addClass("active");
					isotope.isotope({filter: data_filter});
				});

				$('.view_more_link', $scope).on('click', function (e) {
					e.preventDefault();
					query.images = images[paged++];

					jQuery.ajax({
						type: "POST",
						data: query,
						url: gt3_moone.ajaxurl,
						success: function (data) {
							if ('post_count' in data) {
								if (data.post_count > 0) {
									var add = $(data.respond);
									isotope.append(add).isotope('appended', add);
									if (lightbox && 'gallery_items' in data) {
										lightbox_array = lightbox_array.concat(data.gallery_items);
									}
									setTimeout(function () {
										isotope.isotope({sortby: 'original-order'});
										resize();
									}, 50);
									setTimeout(function () {
										showImages();
									}, 800);
								}
							}
						},
						error: function (e) {
							console.error('Error request');
						}
					});
					if (paged >= max_page) {
						// jQuery(this).remove();
						jQuery(this).addClass('hidden');
					}
				});
			}

			function showImages() {
				if (jQuery('.loading:first', $scope).length) {
					jQuery('.loading:first', $scope).removeClass('loading');
					setTimeout(showImages, 240);
				} else {
					resize();
				}
			}


			$(window).on('resize', function () {
				resize();
			})

			if (paged >= max_page) {
				jQuery('.view_more_link', $scope).remove();
			}
		},
		KenburnsGallery: function ($scope) {
			var that = this;
			$scope = $scope.hasClass('gallery_kenburns') ? $scope : jQuery('.gallery_kenburns', $scope);

			if (!$scope.length) {
				console.warn('Kenburns slider wrapper not found');
				return;
			} else if ($scope.attr('data-count') < 1) {
				console.warn('Kenburns slider images not found');
				return;
			}

			var images = [];
			if ($scope.attr('data-count') !== 0) {
				images = $scope.data('images');
			}

			function kenburns_resize() {
				var setHeight = $scope.attr('data-height');
				if (setHeight === '100%' && !that.is_single) {
					setHeight = that.window.height();
					setHeight -= that.adminbar.height();
					if (!that.header_over_bg) {
						setHeight -= that.header.height();
					}
					setHeight -= that.footer.height();
				} else if (setHeight === '100%' && that.is_single) {
					setHeight = that.window.height() - that.adminbar.height();
				}
				setHeight = parseInt(setHeight);
				$scope.height(setHeight);

				if ($scope.attr('data-count') === 0) return;
				if (jQuery('.kenburns', $scope).length) {
					jQuery('.kenburns', $scope).remove();
				}
				$scope.append('<canvas class="kenburns"><p>Your browser does not support canvas!</p></canvas>');
				jQuery('.kenburns', $scope)
					.attr('width', $scope.width())
					.attr('height', $scope.height())
					.css('top', '0px')
					.kenburns({
						images: images,
						frames_per_second: 30,
						display_time: parseInt($scope.attr('data-interval')),
						fade_time: parseInt($scope.attr('data-transition')),
						zoom: 1.2,
						background_color: $scope.attr('data-overlay_bg'),
					});

			}

			jQuery(window).resize(function () {
				setTimeout(kenburns_resize, 300);
			});

			kenburns_resize();
			that.scrollTo($scope, 800);

		},
		FullScreenSlider: function ($scope) {
			var that = this;
			var html = jQuery('html'),
				fs_slider_wrapper = $scope.hasClass('fs_gallery_wrapper') ? $scope : jQuery('.fs_gallery_wrapper', $scope);
			if (!fs_slider_wrapper.length) {
				console.warn('FullScreen slider wrapper not found');
				return;
			} else if (fs_slider_wrapper.hasClass('started')) {
				console.error('Slider Inited');
				return;
			}
			var max_slide = fs_slider_wrapper.find('.fs_slide').length;
			if (!max_slide) {
				console.warn('Can\'t start slider. Slides not found');
				return;
			}

			var fs_slider = jQuery('.fs_slider', $scope),
				fs_gallery_template = jQuery('.fs_gallery_template', $scope),
				fs_title_wrapper = jQuery('.fs_title_wrapper', $scope),
				fs_title = jQuery('.fs_title', $scope),
				fs_descr = jQuery('.fs_descr', $scope),
				fs_btn_prev = jQuery('.fs_slider_prev', $scope),
				fs_btn_next = jQuery('.fs_slider_next', $scope),
				fs_controls = jQuery('.fs_controls', $scope),
				fs_overlay = jQuery('.fs_overlay', $scope),
				fs_thmb_viewport = jQuery('.fs_thmb_viewport', $scope),
				fs_thumbs = jQuery('.fs_thumbs', $scope),
				set_video_controls = fs_slider.attr('data-video'),
				fs_thumb_slide = jQuery('.thmb_slide', $scope),
				fs_play_pause = jQuery('.fs_play_pause', $scope),
				fs_gal_array = [],
				interval = null,
				settings = JSON.parse(fs_slider_wrapper.attr('data-settings')),
				cur_slide = 1,
				started = false,
				statusCurrent = jQuery('.status .first', $scope);

			jQuery('.status .all_slides', $scope).html(max_slide.pad());


			jQuery('.fs_svg_animate', $scope).css('animation-duration', settings.interval + 'ms');


			that.html.addClass('fs_gallery_page');

			/* Start FS Gallery */
			if (!that.editMode) {
				jQuery(document).keyup(function (event) {
					if (fs_slider_wrapper.hasClass('hovered')) {
						if ((event.keyCode === 37)) {
							event.preventDefault();
							fs_prevSlide();
						}
						if ((event.keyCode === 27)) {
							fs_slider_wrapper.removeClass('show_fs_share');
						}
						if ((event.keyCode === 39)) {
							event.preventDefault();
							fs_nextSlide();
						}
					}
				});

				fs_slider_wrapper.on('mouseenter', function () {
					fs_slider_wrapper.addClass('hovered');
				}).on('mouseleave', function () {
					fs_slider_wrapper.removeClass('hovered');
				})


				jQuery('.fs_controls_toggler', $scope).on('click', function () {
					fs_slider_wrapper.toggleClass('hide_fs_controls');
				});


				fs_btn_prev.on('click', function () {
					fs_prevSlide();
				});
				fs_btn_next.on('click', function () {
					fs_nextSlide();
				});

				jQuery('.fs_slider_controls', $scope).on('click', function () {
					fs_slider_wrapper.toggleClass('fullview_fs_slider');
				});
				jQuery('.fs_slider_share', $scope).on('click', function () {
					fs_slider_wrapper.addClass('show_fs_share');
				});
				jQuery('.fs_share_block', $scope).on('click', function () {
					fs_slider_wrapper.removeClass('show_fs_share');
				});
				jQuery('.fs_play_pause', $scope).on('click', function () {
					if (jQuery(this).hasClass('fs_state_play')) {
						stopAutoplay();
					} else {
						if (!jQuery(this).hasClass('paused_by_video')) {
							startAutoplay();
						}
					}
				});

				if (this.canFullScreen($scope)) {
					jQuery('.fullscreen', $scope).on('click', function (e) {
						e.preventDefault();
						that.getFullScreenElement() ? that.exitFullScreen() : that.requestFullScreen(fs_slider_wrapper);
					});
				} else {
					jQuery('.fullscreen', $scope).hide();
				}

				fs_thumb_slide.on('click', function () {
					var setThmb = jQuery(this).attr('data-count');
					fs_setSlide(setThmb);
				});
			}


			jQuery(window).resize(function () {
				setup_fs_gallery();
				setVideoFrame();
			});

			function fs_prevSlide() {
				cur_slide--;
				if (cur_slide > max_slide) cur_slide = 1;
				if (cur_slide < 1) cur_slide = max_slide;
				fs_setSlide(cur_slide);
			}

			function fs_nextSlide() {
				cur_slide++;
				if (cur_slide > max_slide) cur_slide = 1;
				if (cur_slide < 1) cur_slide = max_slide;
				fs_setSlide(cur_slide);
			}

			function fs_setSlide(slideNum) {
				stopAutoplay();
				slideNum = parseInt(slideNum);
				statusCurrent.html(slideNum.pad());

				fs_slider_wrapper.find('.prev-slide').removeClass('prev-slide');
				fs_slider_wrapper.find('.current-slide').removeClass('current-slide');
				fs_slider_wrapper.find('.next-slide').removeClass('next-slide');

				if ((parseInt(slideNum) + 1) > max_slide) {
					nextSlide = fs_slider_wrapper.find('.fs_slide1');
				} else if ((parseInt(slideNum) + 1) === max_slide) {
					nextSlide = fs_slider_wrapper.find('.fs_slide' + max_slide);
				} else {
					nextSlide = fs_slider_wrapper.find('.fs_slide' + (parseInt(slideNum) + 1));
				}

				if ((parseInt(slideNum) - 1) < 1) {
					prevSlide = fs_slider_wrapper.find('.fs_slide' + max_slide);
				} else if ((slideNum - 1) === 1) {
					prevSlide = fs_slider_wrapper.find('.fs_slide1');
				} else {
					prevSlide = fs_slider_wrapper.find('.fs_slide' + (parseInt(slideNum) - 1));
				}

				prevSlide.addClass('prev-slide');
				var curSlide = fs_slider_wrapper.find('.fs_slide' + slideNum);

				curSlide.addClass('current-slide');
				nextSlide.addClass('next-slide');

				if (prevSlide.find('iframe').length > 0) {
					prevSlide.find('iframe').remove();
				}
				if (nextSlide.find('iframe').length > 0) {
					nextSlide.find('iframe').remove();
				}
				if (prevSlide.find('div').length > 0) {
					prevSlide.find('div').remove();
				}
				if (nextSlide.find('div').length > 0) {
					nextSlide.find('div').remove();
				}

				var title = curSlide.attr('data-title'),
					descr = curSlide.attr('data-descr')

				if (fs_slider.hasClass('started')) {
					fs_title_wrapper.fadeOut(300, function () {
						setTimeout(function () {
							fs_descr.html(descr);
							fs_title.html(title);
						}, (settings.transition - 300));
						setTimeout(function () {
							fs_title_wrapper.fadeIn(200);
						}, (settings.transition - 300));
					});
				}

				if (curSlide.attr('data-type') === 'image' && !curSlide.hasClass('block_loaded')) {
					curSlide.css('background-image', 'none');
					slide_not_loaded(curSlide.attr('data-count'));
				} else {
					fs_slider_wrapper.find('.paused_by_video').removeClass('paused_by_video');
					if (curSlide.attr('data-type') === 'image') {
						curSlide.css('background-image', 'url(' + that.getElementImage(curSlide) + ')');
					} else if (curSlide.attr('data-type') === 'youtube') {
						curSlide.css('background-image', 'url(' + curSlide.attr('data-bg') + ')');
						add_YT_video();
						fs_slider_wrapper.find('.fs_play_pause').addClass('paused_by_video');
					} else {
						curSlide.css('background-image', 'url(' + curSlide.attr('data-bg') + ')');
						fs_slider_wrapper.find('.fs_play_pause').addClass('paused_by_video');
						add_vimeo_video();
					}

					if (nextSlide.attr('data-type') === 'image') {
						nextSlide.css('background-image', 'url(' + that.getElementImage(nextSlide) + ')');
					} else if (nextSlide.attr('data-type') === 'youtube') {
						nextSlide.css('background-image', 'url(' + nextSlide.attr('data-bg') + ')');
					} else {
						nextSlide.css('background-image', 'url(' + nextSlide.attr('data-bg') + ')');
					}

					if (prevSlide.attr('data-type') === 'image') {
						prevSlide.css('background-image', 'url(' + that.getElementImage(prevSlide) + ')');
					} else if (prevSlide.attr('data-type') === 'youtube') {
						prevSlide.css('background-image', 'url(' + prevSlide.attr('data-bg') + ')');
					} else {
						prevSlide.css('background-image', 'url(' + prevSlide.attr('data-bg') + ')');
					}

					if (!prevSlide.hasClass('was_showed')) {
						prevSlide.addClass('was_showed');
					}
					if (!curSlide.hasClass('was_showed')) {
						curSlide.addClass('was_showed');
					}
					if (!nextSlide.hasClass('was_showed')) {
						nextSlide.addClass('was_showed');
					}

					if (fs_slider_wrapper.find('.thmb_slide').length > 0) {
						if (max_slide < 5) {
							fs_slider_wrapper.find('.fs_thmb_prev').removeClass('fs_thmb_prev');
							fs_slider_wrapper.find('.fs_thmb_current').removeClass('fs_thmb_current');
							fs_slider_wrapper.find('.fs_thmb_next').removeClass('fs_thmb_next');

							var curSlide = fs_slider_wrapper.find('.thmb_slide' + slideNum);
							curSlide.addClass('fs_thmb_current');

							if ((parseInt(slideNum) + 1) > max_slide) {
								var nextSlide = fs_slider_wrapper.find('.thmb_slide1');
							} else if ((parseInt(slideNum) + 1) === max_slide) {
								var nextSlide = fs_slider_wrapper.find('.thmb_slide' + max_slide);
							} else {
								var nextSlide = fs_slider_wrapper.find('.thmb_slide' + (parseInt(slideNum) + 1));
							}

							if ((parseInt(slideNum) - 1) < 1) {
								var prevSlide = fs_slider_wrapper.find('.thmb_slide' + max_slide);
							} else if ((slideNum - 1) === 1) {
								var prevSlide = fs_slider_wrapper.find('.thmb_slide1');
							} else {
								var prevSlide = fs_slider_wrapper.find('.thmb_slide' + (parseInt(slideNum) - 1));
							}

							prevSlide.addClass('fs_thmb_prev');
							curSlide.addClass('fs_thmb_current');
							nextSlide.addClass('fs_thmb_next');

						} else {
							fs_slider_wrapper.find('.fs_thmb_prev2').removeClass('fs_thmb_prev2')
							fs_slider_wrapper.find('.fs_thmb_prev').removeClass('fs_thmb_prev');
							fs_slider_wrapper.find('.fs_thmb_current').removeClass('fs_thmb_current');
							fs_slider_wrapper.find('.fs_thmb_next').removeClass('fs_thmb_next');
							fs_slider_wrapper.find('.fs_thmb_next2').removeClass('fs_thmb_next2');

							var curSlide = fs_slider_wrapper.find('.thmb_slide' + slideNum);
							curSlide.addClass('fs_thmb_current');

							if ((parseInt(slideNum) + 1) > max_slide) {
								var nextSlide = fs_slider_wrapper.find('.thmb_slide1');
								var nextSlide2 = fs_slider_wrapper.find('.thmb_slide2');
							} else if ((parseInt(slideNum) + 1) === max_slide) {
								var nextSlide = fs_slider_wrapper.find('.thmb_slide' + max_slide);
								var nextSlide2 = fs_slider_wrapper.find('.thmb_slide1');
							} else {
								var nextSlide = fs_slider_wrapper.find('.thmb_slide' + (parseInt(slideNum) + 1));
								var nextSlide2 = fs_slider_wrapper.find('.thmb_slide' + (parseInt(slideNum) + 2));
							}

							if ((parseInt(slideNum) - 1) < 1) {
								var prevSlide = fs_slider_wrapper.find('.thmb_slide' + max_slide);
								var prevSlide2 = fs_slider_wrapper.find('.thmb_slide' + (max_slide - 1));
							} else if ((slideNum - 1) === 1) {
								var prevSlide = fs_slider_wrapper.find('.thmb_slide1');
								var prevSlide2 = fs_slider_wrapper.find('.thmb_slide' + max_slide);
							} else {
								var prevSlide = fs_slider_wrapper.find('.thmb_slide' + (parseInt(slideNum) - 1));
								var prevSlide2 = fs_slider_wrapper.find('.thmb_slide' + (parseInt(slideNum) - 2));
							}

							prevSlide2.addClass('fs_thmb_prev2');
							prevSlide.addClass('fs_thmb_prev');
							curSlide.addClass('fs_thmb_current');
							nextSlide.addClass('fs_thmb_next');
							nextSlide2.addClass('fs_thmb_next2');
						}
					}

					setVideoFrame();
					if (!fs_slider_wrapper.find('.fs_play_pause').hasClass('paused_by_video')) {
						startAutoplay();

					}
				}
			}

			function stopAutoplay() {
				fs_slider_wrapper.removeClass('now_animate');
				fs_play_pause.removeClass('fs_state_play');
				clearTimeout(interval);
			}

			function startAutoplay() {
				interval = setTimeout(fs_nextSlide, settings.interval);
				fs_play_pause.addClass('fs_state_play');
				fs_slider_wrapper.addClass('now_animate');
			}

			function setup_fs_gallery() {
				var setHeight = settings.height;
				if (setHeight === '100%' && !that.is_single) {
					setHeight = that.window.height();
					setHeight -= that.adminbar.height();
					if (!that.header_over_bg) {
						setHeight -= that.header.height();
					}
					setHeight -= that.footer.height();
				} else if (setHeight === '100%' && that.is_single) {
					setHeight = that.window.height() - that.adminbar.height();
				}
				fs_slider_wrapper.height(parseInt(setHeight));
			}

			function run_fs_slider() {
				setup_fs_gallery();
				if (fs_slider.hasClass('autoplay')) {
					stopAutoplay();
				}
				fs_setSlide(1);
				if (that.is_single) {
					that.scrollTo(fs_slider_wrapper, 600);
				}
			}

			function slide_not_loaded(slide_num) {
				slide_num = parseInt(slide_num);
				var curSlide = fs_slider_wrapper.find('.fs_slide' + slide_num);
				if (curSlide.attr('data-type') === 'image' && !curSlide.hasClass('block_loaded')) {
					curSlide.css('background', 'none');
					setTimeout(function () {
						slide_not_loaded(fs_slider_wrapper.find('.current-slide').attr('data-count'));
					}, 500);
				} else {
					fs_setSlide(slide_num);
				}
			}

			function init_pp4fs_slider() {
				if (jQuery('.fs_block2preload:first', $scope).length > 0) {
					var $this_obj = jQuery('.fs_block2preload:first', $scope);
					(function (img, src) {
						img.src = src;
						img.onload = function () {
							$this_obj.removeClass('fs_block2preload').addClass('block_loaded').animate({
								'z-index': '3'
							}, 100, function () {
								init_pp4fs_slider();
							});
						};
					}(new Image(), that.getElementImage($this_obj)));

					if (!fs_slider.hasClass('started')) {
						if ($('.fs_slide1', $scope).hasClass('block_loaded')) {
							run_fs_slider();
							fs_slider.addClass('started');
						}
					}
				} else {
					fs_slider.removeClass('wait4load');
					if (!fs_slider.hasClass('started')) {
						if ($('.fs_slide1', $scope).hasClass('block_loaded')) {
							run_fs_slider();
							fs_slider.addClass('started');
						}
					}
				}
			}


//Video Functions
			function onPlayerReady(event) {
				event.target.playVideo();
			}

			function onPlayerStateChange(event) {
				var yt_cut_state = event.data;
				if (yt_cut_state === 0) {
					if (jQuery('.fs_play_pause', $scope).hasClass('fs_state_play')) {
						fs_nextSlide();
					}
				}
				if (yt_cut_state == 1) {
				}
			}

			function stopVideo() {
				player.stopVideo();
			}

			function add_YT_video() {
				var curSlide = jQuery('.fs_slide.current-slide', $scope);
				curSlide.append('<div id="player"></div>')
				var player;
				if (html.hasClass('yt_ready')) {
					player = new YT.Player('player', {
						height: '100%',
						width: '100%',
						playerVars: {'rel': 0, 'disablekb': 1},
						videoId: curSlide.attr('data-src'),
						events: {
							'onReady': onPlayerReady,
							'onStateChange': onPlayerStateChange
						}
					});
					setVideoFrame();
				} else {
					setTimeout(add_YT_video, 500);
				}
			}

			function add_vimeo_video() {
				var curSlide = jQuery('.fs_slide.current-slide', $scope);
				curSlide.append('<div id="vimeo_player"></div>')
				var options = {
					id: curSlide.attr('data-src'),
					width: '100%',
					loop: false,
					autoplay: true
				};
				var v_player = new Vimeo.Player('vimeo_player', options);
				setVideoFrame();
				v_player.on('play', function () {
				});
				v_player.on('ended', function () {
					if (jQuery('.fs_play_pause', $scope).hasClass('fs_state_play')) {
						fs_nextSlide();
					}
				});
				v_player.on('loaded', function () {
					setVideoFrame();
				});
			}

			function setVideoFrame() {
				jQuery('.video_cover', $scope).each(function () {
					if (that.window.width() > 1024) {
						if (jQuery('iframe', $scope).length > 0) {
							if (((jQuery(this).height() + 150) / 9) * 16 > jQuery(this).width()) {
								jQuery(this).find('iframe').height(jQuery(this).height() + 150).width(((jQuery(this).height() + 150) / 9) * 16);
								jQuery(this).find('iframe').css({
									'margin-left': (-1 * jQuery(this).find('iframe').width() / 2) + 'px',
									'top': "-75px",
									'margin-top': '0px'
								});
							} else {
								jQuery(this).find('iframe').width(jQuery(this).width()).height(((jQuery(this).width()) / 16) * 9);
								jQuery(this).find('iframe').css({
									'margin-left': (-1 * jQuery('iframe').width() / 2) + 'px',
									'margin-top': (-1 * jQuery('iframe').height() / 2) + 'px',
									'top': '50%'
								});
							}
						}
					} else {
						jQuery('iframe').height(that.window.height()).width(that.window.width()).css({
							'top': '0px',
							'margin-left': '0px',
							'left': '0px',
							'margin-top': '0px'
						});
					}
				});
			}

			// Init
			setup_fs_gallery();
			fs_slider_wrapper.find('.fs_slide').css('transition-duration', settings.transition + 'ms');
			if (jQuery('.fs_block2preload', $scope).length > 0) {
				init_pp4fs_slider();
			} else {
				run_fs_slider();
			}
		},
		MasonryGallery: function ($scope) {
			var that = this;
			var wrapper = $scope.hasClass('masonry_wrapper') ? $scope : jQuery('.masonry_wrapper', $scope);
			if (!wrapper.length) {
				console.warn('Masonry wrapper not found');
				return;
			}
			var isotope = jQuery('.isotope_wrapper', $scope);
			var query = wrapper.data('settings');
			query.action = 'gt3_masonry_load_images';

			var images = this.array_chunk(wrapper.data('images'), query.load_items);
			var paged = 0,
				max_page = images.length,
				lightbox = query.lightbox,
				lightbox_array,
				lightbox_obj,
				gap;

			if (lightbox) {
				lightbox_array = window['images' + query.uid];
				if (!that.editMode) {
					wrapper.on('click', '.lightbox', function (event) {
						event.preventDefault();
						event.stopPropagation();
						var options = {
							index: $(this).closest('.isotope_item').index(),
							container: '#popup_gt3_elementor_gallery',
							event: event,
							instance: query.uid
						};

						lightbox_obj = blueimp.ElementorGallery(lightbox_array, options);
					});
				}
			}

			function resize() {
				if (query.gap_unit === '%') {
					gap = (wrapper.width() * parseFloat(query.gap_value) / 100).toFixed(2);
					isotope.find('.isotope_item').css('padding-right', gap + 'px').css('padding-bottom', gap + 'px');
				}

				isotope.isotope().isotope('reLayout');
			}

			resize();
			isotope.imagesLoaded(function () {
				isotope.isotope('reLayout');
				showImages();
			});


			$(window).on('resize', function () {
				resize();
			});

			if (!that.editMode) {
				$scope.on("click", ".isotope-filter a", function (e) {
					e.preventDefault();
					var data_filter = this.getAttribute("data-filter");
					jQuery(this).siblings().removeClass("active");
					jQuery(this).addClass("active");
					isotope.isotope({filter: data_filter});
				});


				$('.view_more_link', $scope).on('click', function (e) {
					e.preventDefault();
					query.images = images[paged++];

					jQuery.ajax({
						type: "POST",
						data: query,
						url: gt3_moone.ajaxurl,
						success: function (data) {
							if ('post_count' in data) {
								if (data.post_count > 0) {
									var add = jQuery(data.respond);
									isotope.append(add).isotope('appended', add);
									if (lightbox && 'gallery_items' in data) {
										lightbox_array = lightbox_array.concat(data.gallery_items);
									}
									setTimeout(function () {
										isotope.isotope({sortby: 'original-order'});
									}, 50);
									setTimeout(function () {
										showImages();
									}, 800);
								}
							}
						},
						error: function (e) {
							console.error('Error request');
						}
					});
					if (paged >= max_page) {
						// jQuery(this).remove();
                        jQuery(this).addClass('hidden');
					}
				});
			}

			function showImages() {
				if (jQuery('.loading:first', $scope).length) {
					jQuery('.loading:first', $scope).removeClass('loading');
					setTimeout(showImages, 240);
				} else {
					resize();
				}
			}

			if (paged >= max_page) {
				jQuery('.view_more_link', $scope).remove();
			}
		},
		GridGallery: function ($scope) {
			var that = this;
			var wrapper = $scope.hasClass('grid_wrapper') ? $scope : jQuery('.grid_wrapper', $scope);
			if (!wrapper.length) {
				console.warn('Grid wrapper not found');
				return;
			}
			var isotope = jQuery('.isotope_wrapper', $scope);
			var query = wrapper.data('settings');
			query.action = 'gt3_masonry_load_images';

			var images = this.array_chunk(JSON.parse(wrapper.attr('data-images')), query.load_items);
			var paged = 0,
				max_page = images.length,
				lightbox = query.lightbox,
				lightbox_array,
				lightbox_obj,
				gap;

			var grig_type = new Array('rectangle', 'square', 'vertical');
			if ($.inArray(query.grid_type, grig_type) === -1) {
				return true;
			}

			if (lightbox) {
				lightbox_array = window['images' + query.uid];
				if (!that.editMode) {
					wrapper.on('click', '.lightbox', function (event) {
						event.preventDefault();
						event.stopPropagation();
						var options = {
							index: $(this).closest('.isotope_item').index(),
							container: '#popup_gt3_elementor_gallery',
							event: event,
							instance: query.uid
						};
						lightbox_obj = blueimp.ElementorGallery(lightbox_array, options);
					});
				}
			}

			function get_max_height() {
				var max = 0;
				jQuery.each(isotope.children(), function (key, value) {
					if (max <= jQuery(value).outerHeight()) max = jQuery(value).outerHeight();
				});
				return max;
			}

			function resize() {
				if (query.gap_unit === '%') {
					gap = (wrapper.width() * parseFloat(query.gap_value) / 100).toFixed(2);
					isotope
						.find('.isotope_item')
						.css('padding-right', gap + 'px')
						.css('padding-bottom', gap + 'px');
				}

				var options = {
					itemSelector: '.isotope_item',
					layoutMode: 'masonry',
				};

				var wrap_height, wrap_width, wrap_ratio, img_ratio;
				if (query.grid_type === 'rectangle' || query.grid_type === 'square') {
					wrapper.find('img').each(function (key, value) {
						if ($(window).outerWidth() < 600) {

							var img = $(this);
							var parent = img.closest('.img_wrap');
							parent
								.css('height', 'auto')
								.css('width', 'auto')
								.attr('data-ratio', '');

							img.attr('data-ratio', '')
								.closest('.img').css('height', 'auto').css('width', 'auto')
						} else {
							var img = $(this);
							var parent = img.closest('.img_wrap');

							wrap_height = wrap_width = Math.ceil(parent.outerWidth());
							if (query.grid_type === 'rectangle') {
								wrap_height = Math.ceil(wrap_width * 0.75);
							}

							wrap_height = Math.ceil(wrap_height);

							// wrap_height = wrap_width = wrap_width_origin;

							wrap_ratio = (wrap_width / wrap_height);
							img_ratio = ((img.attr('width') || 1) / (img.attr('height') || 1));
							if (wrap_ratio > img_ratio) img_ratio = 0.5;

							parent
								.css('height', Math.floor(wrap_height))
								// .css('width', Math.floor(wrap_width))
								.attr('data-ratio', wrap_ratio >= 1 ? 'landscape' : 'portrait');

							img.attr('data-ratio', img_ratio >= 1 ? 'landscape' : 'portrait')
								.closest('.img').css('height', parent.height()).css('width', parent.width())
						}
					});
				}


				if (that.window.width() > 600) {
					$.extend(options, {
						layoutMode: 'cellsByRow',
						itemSelector: '.isotope_item',
						cellsByRow: {
							// columnWidth: Math.floor(isotope.width() / query.cols),
							rowHeight: get_max_height(),
						}
					})
				}
				isotope.isotope(options);
			}


			$(window).on('resize', function () {
				resize();
			});

			if (!that.editMode) {
				$scope.on("click", ".isotope-filter a", function (e) {
					e.preventDefault();
					var data_filter = this.getAttribute("data-filter");
					jQuery(this).siblings().removeClass("active");
					jQuery(this).addClass("active");
					isotope.isotope({filter: data_filter});
				});


				$('.view_more_link', $scope).on('click', function (e) {
					e.preventDefault();
					query.images = images[paged++];

					jQuery.ajax({
						type: "POST",
						data: query,
						url: gt3_moone.ajaxurl,
						success: function (data) {
							if ('post_count' in data) {
								if (data.post_count > 0) {
									var add = jQuery(data.respond);
									isotope.append(add).isotope('appended', add);
									if (lightbox && 'gallery_items' in data) {
										lightbox_array = lightbox_array.concat(data.gallery_items);
									}
									setTimeout(function () {
										isotope.isotope({sortby: 'original-order'});
										resize();
									}, 50);
									setTimeout(function () {
										showImages();
									}, 800);
								}
							}
						},
						error: function (e) {
							console.error('Error request');
						}
					});
					if (paged >= max_page) {
						// jQuery(this).remove();
                        jQuery(this).addClass('hidden');
					}
				});
			}

			function showImages() {
				if (jQuery('.loading:first', $scope).length) {
					jQuery('.loading:first', $scope).removeClass('loading');
					setTimeout(showImages, 240);
				} else {
					resize();
				}
			}

			// resize();2
			isotope.imagesLoaded(function () {
				resize();
				showImages();
			});
			if (paged >= max_page) {
				jQuery('.view_more_link', $scope).remove();
			}
		},
		Ribbon: function ($scope) {
			var that = this;
			var ribbon_slider_wrapper = $scope.hasClass('ribbon_slider_wrapper') ? $scope : jQuery('.ribbon_slider_wrapper', $scope);
			if (!ribbon_slider_wrapper.length) {
				console.warn('Ribbon slider wrapper not found');
				return;
			}
			var ribbon_slider = jQuery('.ribbon_slider', $scope),
				ribbon_container = jQuery('.ribbon_gallery_container', $scope),
				ribbon_slide = jQuery('.ribbon_slide', $scope),
				fs_play_pause = jQuery('.fs_play_pause', $scope),
				ribbon_controls = jQuery('.ribbon_controls', $scope),
				r_max_slide = ribbon_slider.find('.ribbon_slide').length,
				ribbon_gal_array = [],
				prevText = jQuery('.ribbon_prevSlide .current', $scope),
				nextText = jQuery('.ribbon_nextSlide .current', $scope);

			if (!ribbon_slider_wrapper.length) {
				console.warn('Can\'t start slider. ');
				return;
			} else if (ribbon_slider_wrapper.hasClass('started')) {
				console.error('Slider Inited');
				return;
			}
			if (!r_max_slide) {
				console.warn('Can\'t start slider. Slides not found');
				return;
			}

			jQuery('.all_slides', $scope).html(r_max_slide.pad());


			var cur_slide = 1,
				interval = null,
				settings = ribbon_slider_wrapper.data('settings');

			if (!that.editMode) {
				jQuery(document.documentElement).keyup(function (event) {
					if (ribbon_slider_wrapper.hasClass('hovered_ribbongal_module')) {
						if ((event.keyCode === 37)) {
							event.preventDefault();
							ribbon_prevSlide();
						}
						if ((event.keyCode === 39)) {
							event.preventDefault();
							ribbon_nextSlide();
						}
					}
				});

				jQuery($scope).on('mouseenter', function (e) {
					ribbon_slider_wrapper.addClass('hovered_ribbongal_module');
				}).on('mouseleave', function (e) {
					ribbon_slider_wrapper.removeClass('hovered_ribbongal_module');
				})


				jQuery('.ribbon_prevSlide', $scope).on('click', function () {
					ribbon_prevSlide();
				});
				jQuery('.ribbon_nextSlide', $scope).on('click', function () {
					ribbon_nextSlide();
				});

				jQuery('.ribbon_slide', $scope).on('click', function () {
					if (!jQuery(this).hasClass('ribbon_current')) {
						var set_slide = jQuery(this).attr('data-count');
						set_ribbon_Slide(set_slide);
					}
				});

				//Touch Events
				var touch, startAt, movePath, movePercent, touch_interval;
				ribbon_slider.on('touchstart', function (event) {
					clearInterval(touch_interval);
					touch = event.originalEvent.touches[0];
					startAt = touch.pageX;
					ribbon_slider.addClass('touched');
				});

				ribbon_slider.on('touchmove', function (event) {
					touch = event.originalEvent.touches[0];
					movePath = -1 * (startAt - touch.pageX) / 2;
					movePercent = (movePath * 100) / that.window.width();
				});
				ribbon_slider.on('touchend', function (event) {
					ribbon_slider.removeClass('touched');
					touch = event.originalEvent.changedTouches[0];
					if (touch.pageX < startAt) {
						ribbon_nextSlide();
					}
					if (touch.pageX > startAt) {
						ribbon_prevSlide();
					}
				});
			}

			jQuery(window).resize(function () {
				setup_ribbon();
				set_ribbon_Slide(cur_slide);
				setup_ribbon_video();
			});

			function ribbon_prevSlide() {
				cur_slide--;
				if (cur_slide > r_max_slide) cur_slide = 1;
				if (cur_slide < 1) cur_slide = r_max_slide;
				set_ribbon_Slide(cur_slide);
			}

			function ribbon_nextSlide() {
				cur_slide++;
				if (cur_slide > r_max_slide) cur_slide = 1;
				if (cur_slide < 1) cur_slide = r_max_slide;
				set_ribbon_Slide(cur_slide);
			}

			function stopAutoplay() {
				clearInterval(interval);
			}

			function startAutoplay() {
				if (settings.autoplay) {
					interval = setInterval(ribbon_nextSlide, settings.interval);
				}
			}

			function set_ribbon_Slide(slideNum) {
				stopAutoplay();

				slideNum = parseInt(slideNum);
				if (r_max_slide < 5) {
					ribbon_slider.find('.ribbon_prev2').removeClass('ribbon_prev2');
					ribbon_slider.find('.ribbon_prev').removeClass('ribbon_prev');
					ribbon_slider.find('.ribbon_current').removeClass('ribbon_current');
					ribbon_slider.find('.ribbon_next').removeClass('ribbon_next');
					ribbon_slider.find('.ribbon_next2').removeClass('ribbon_next2');

					var curSlide = ribbon_slider.find('.ribbon_slide' + slideNum);
					curSlide.addClass('ribbon_current');

					if ((parseInt(slideNum) + 1) > r_max_slide) {
						var nextSlide = ribbon_slider.find('.ribbon_slide1');
					} else if ((parseInt(slideNum) + 1) == r_max_slide) {
						var nextSlide = ribbon_slider.find('.ribbon_slide' + r_max_slide);
					} else {
						var nextSlide = ribbon_slider.find('.ribbon_slide' + (parseInt(slideNum) + 1));
					}

					if ((parseInt(slideNum) - 1) < 1) {
						var prevSlide = ribbon_slider.find('.ribbon_slide' + r_max_slide);
					} else if ((slideNum - 1) == 1) {
						var prevSlide = ribbon_slider.find('.ribbon_slide1');
					} else {
						var prevSlide = ribbon_slider.find('.ribbon_slide' + (parseInt(slideNum) - 1));
					}

					prevSlide.addClass('ribbon_prev');
					curSlide.addClass('ribbon_current');
					nextSlide.addClass('ribbon_next');

					if (parseInt(ribbon_slider.attr('data-pad')) > 0) {
						var set_ribbon_pad = parseInt(ribbon_slider.attr('data-pad'));
					} else {
						var set_ribbon_pad = 0;
					}

					var mainOffSet = ribbon_slider.width() * 0.5 - curSlide.width() * 0.5;
					var nextOffset = curSlide.width() + mainOffSet + set_ribbon_pad;
					var prevOffset = mainOffSet - prevSlide.width() - set_ribbon_pad;

					prevSlide.css('transform', 'translateX(' + prevOffset + 'px)');
					curSlide.css('transform', 'translateX(' + mainOffSet + 'px)');
					nextSlide.css('transform', 'translateX(' + nextOffset + 'px)');

				} else {
					ribbon_slider.find('.ribbon_prev2').removeClass('ribbon_prev2');
					ribbon_slider.find('.ribbon_prev').removeClass('ribbon_prev');
					ribbon_slider.find('.ribbon_current').removeClass('ribbon_current');
					ribbon_slider.find('.ribbon_next').removeClass('ribbon_next');
					ribbon_slider.find('.ribbon_next2').removeClass('ribbon_next2');

					var curSlide = ribbon_slider.find('.ribbon_slide' + slideNum);
					curSlide.addClass('ribbon_current');

					if ((parseInt(slideNum) + 1) > r_max_slide) {
						var nextSlide = ribbon_slider.find('.ribbon_slide1');
						var nextSlide2 = ribbon_slider.find('.ribbon_slide2');
					} else if ((parseInt(slideNum) + 1) == r_max_slide) {
						var nextSlide = ribbon_slider.find('.ribbon_slide' + r_max_slide);
						var nextSlide2 = ribbon_slider.find('.ribbon_slide1');
					} else {
						var nextSlide = ribbon_slider.find('.ribbon_slide' + (parseInt(slideNum) + 1));
						var nextSlide2 = ribbon_slider.find('.ribbon_slide' + (parseInt(slideNum) + 2));
					}

					if ((parseInt(slideNum) - 1) < 1) {
						var prevSlide = ribbon_slider.find('.ribbon_slide' + r_max_slide);
						var prevSlide2 = ribbon_slider.find('.ribbon_slide' + (r_max_slide - 1));
					} else if ((slideNum - 1) == 1) {
						var prevSlide = ribbon_slider.find('.ribbon_slide1');
						var prevSlide2 = ribbon_slider.find('.ribbon_slide' + r_max_slide);
					} else {
						var prevSlide = ribbon_slider.find('.ribbon_slide' + (parseInt(slideNum) - 1));
						var prevSlide2 = ribbon_slider.find('.ribbon_slide' + (parseInt(slideNum) - 2));
					}

					prevSlide2.addClass('ribbon_prev2');
					prevSlide.addClass('ribbon_prev');
					curSlide.addClass('ribbon_current');
					nextSlide.addClass('ribbon_next');
					nextSlide2.addClass('ribbon_next2');

					if (settings.pad) {
						set_ribbon_pad = parseInt(settings.pad);
					} else {
						set_ribbon_pad = 0;
					}

					var mainOffSet = ribbon_slider.width() * 0.5 - curSlide.width() * 0.5;
					var nextOffset = curSlide.width() + mainOffSet + set_ribbon_pad;
					var prevOffset = mainOffSet - prevSlide.width() - set_ribbon_pad;
					var nextOffset2 = nextSlide.width() + nextOffset + set_ribbon_pad;
					var prevOffset2 = prevOffset - prevSlide2.width() - set_ribbon_pad;

					curSlide.css('transform', 'translateX(' + mainOffSet + 'px)');
					nextSlide.css('transform', 'translateX(' + nextOffset + 'px)');
					nextSlide2.css('transform', 'translateX(' + nextOffset2 + 'px)');
					prevSlide.css('transform', 'translateX(' + prevOffset + 'px)');
					prevSlide2.css('transform', 'translateX(' + prevOffset2 + 'px)');
				}

				UpdateArrowInfo(slideNum);
				startAutoplay();
			}

			function UpdateArrowInfo(currentSlideNum) {
				var prevSlideNum = currentSlideNum - 1;
				var nextSlideNum = currentSlideNum + 1;

				if (nextSlideNum > r_max_slide) nextSlideNum = 1;
				if (prevSlideNum < 1) prevSlideNum = r_max_slide;

				prevText.html(prevSlideNum.pad());
				nextText.html(nextSlideNum.pad());
			}

			function setup_ribbon() {
				ribbon_slider_wrapper.addClass('started');

				var setHeight = settings.height;
				if (setHeight === '100%' && !that.is_single) {
					setHeight = that.window.height();
					setHeight -= that.adminbar.height();
					if (!that.header_over_bg) {
						setHeight -= that.header.height();
					}
					setHeight -= that.footer.height();
				} else if (setHeight === '100%' && that.is_single) {
					setHeight = that.window.height() - that.adminbar.height();
				}
				setHeight = parseInt(setHeight);
				// ribbon_container.height(setHeight);
				ribbon_slider_wrapper.height(setHeight);

				if (!ribbon_slider.find('.ribbon_current').length) {
					set_ribbon_Slide(1);
				}
				ribbon_slide.css('transition-duration', settings.transition + 'ms');
				that.scrollTo(ribbon_container, 800);
			}

			function setup_ribbon_video() {
				ribbon_slider.find('iframe').each(function () {
					var video_height = jQuery(this).parent('.ribbon_slide').height(),
						video_width = (video_height / 9) * 16;
					if (video_width > that.window.width()) {
						video_width = that.window.width() - parseInt(jQuery(this).css('margin-left')) - parseInt(jQuery(this).css('margin-right'));
					}
					jQuery(this).width(video_width).height(video_height);
					jQuery(this).parent('.ribbon_slide').width(video_width);
				});
			}

			var firstload = 'last';

			function init_pp4ribbon_slider() {
				if (jQuery('.ribbon_block2preload:' + firstload, $scope).length) {
					var $this_obj = jQuery('.ribbon_block2preload:' + firstload, $scope);
					(function (img, src) {
						img.src = src;
						img.onload = function () {
							$this_obj.removeClass('ribbon_block2preload').addClass('block_loaded').animate({
								'z-index': '3'
							}, 100, function () {
								init_pp4ribbon_slider();
							});
							firstload = 'first';
						};
					}(new Image(), that.getElementImage($this_obj)));

					if (!ribbon_slider.hasClass('started')) {
						if ($('.fs_slide1', $scope).hasClass('block_loaded')) {
							ribbon_slider.addClass('started');
							setup_ribbon();
						}
					}
				} else {
					if (!ribbon_slider.hasClass('started')) {
						if ($('.fs_slide1', $scope).hasClass('block_loaded')) {
							ribbon_slider.addClass('started');
							setup_ribbon();

						}
					}
				}
			}

			setup_ribbon();
			init_pp4ribbon_slider();
		},
		Flow: function ($scope) {
			var that = this;
			var flow_slider_wrapper = $scope.hasClass('flow_slider_wrapper') ? $scope : jQuery('.flow_slider_wrapper', $scope);
			if (!flow_slider_wrapper.length) {
				console.warn('Packery wrapper not found');
				return;
			}
			var flow_slider_container = jQuery('.flow_gallery_container', $scope),
				flow_slider = jQuery('.flow_slider', $scope),
				flow_slide = jQuery('.flow_slider .flow_slide', $scope),
				fs_play_pause = jQuery('.fs_play_pause', $scope),
				flow_controls = jQuery('.flow_controls', $scope),
				r_max_slide = flow_slider.find('.flow_slide').length,
				flow_gal_array = [];


			var cur_slide = 1,
				interval = null,
				settings = JSON.parse(flow_slider_wrapper.attr('data-settings'));

			var img_ration = settings.img_width / settings.img_height;

			if (!that.editMode) {
				flow_slider.on("swipeleft", function () {
					flow_nextSlide();
				});
				flow_slider.on("swiperight", function () {
					flow_prevSlide();
				});

				jQuery('.flow_prevSlide', $scope).on('click', function () {
					flow_prevSlide();
				});
				jQuery('.flow_nextSlide', $scope).on('click', function () {
					flow_nextSlide();
				});

				jQuery('.flow_slide', $scope).on('click', function () {
					if (!jQuery(this).hasClass('flow_current')) {
						var set_slide = jQuery(this).attr('data-count');
						set_flow_Slide(set_slide);
					}
				});
			}

			jQuery(window).resize(function () {
				setup_flow();
			});

			function stopAutoplay() {
				clearInterval(interval);
			}

			function startAutoplay() {
				if (settings.autoplay) {
					interval = setInterval(flow_nextSlide, settings.interval);
				}
			}

			function flow_prevSlide() {
				cur_slide--;
				if (cur_slide > r_max_slide) cur_slide = 1;
				if (cur_slide < 1) cur_slide = r_max_slide;
				set_flow_Slide(cur_slide);
			}

			function flow_nextSlide() {
				cur_slide++;
				if (cur_slide > r_max_slide) cur_slide = 1;
				if (cur_slide < 1) cur_slide = r_max_slide;
				set_flow_Slide(cur_slide);
			}

			function set_flow_Slide(slideNum) {
				stopAutoplay();
				slideNum = parseInt(slideNum);
				if (r_max_slide < 5) {
					flow_slider.find('.flow_prev').removeClass('flow_prev');
					flow_slider.find('.flow_current').removeClass('flow_current');
					flow_slider.find('.flow_next').removeClass('flow_next');

					var curSlide = flow_slider.find('.flow_slide' + slideNum);
					curSlide.addClass('flow_current');

					if ((parseInt(slideNum) + 1) > r_max_slide) {
						var nextSlide = flow_slider.find('.flow_slide1');
					} else if ((parseInt(slideNum) + 1) == r_max_slide) {
						var nextSlide = flow_slider.find('.flow_slide' + r_max_slide);
					} else {
						var nextSlide = flow_slider.find('.flow_slide' + (parseInt(slideNum) + 1));
					}

					if ((parseInt(slideNum) - 1) < 1) {
						var prevSlide = flow_slider.find('.flow_slide' + r_max_slide);
					} else if ((slideNum - 1) == 1) {
						var prevSlide = flow_slider.find('.flow_slide1');
					} else {
						var prevSlide = flow_slider.find('.flow_slide' + (parseInt(slideNum) - 1));
					}

					prevSlide.addClass('flow_prev');
					curSlide.addClass('flow_current');
					nextSlide.addClass('flow_next');

					startAutoplay();
				} else {
					flow_slider.find('.flow_prev2').removeClass('flow_prev2');
					flow_slider.find('.flow_prev').removeClass('flow_prev');
					flow_slider.find('.flow_current').removeClass('flow_current');
					flow_slider.find('.flow_next').removeClass('flow_next');
					flow_slider.find('.flow_next2').removeClass('flow_next2');

					var curSlide = flow_slider.find('.flow_slide' + slideNum);
					curSlide.addClass('flow_current');

					if ((parseInt(slideNum) + 1) > r_max_slide) {
						var nextSlide = flow_slider.find('.flow_slide1');
						var nextSlide2 = flow_slider.find('.flow_slide2');
					} else if ((parseInt(slideNum) + 1) == r_max_slide) {
						var nextSlide = flow_slider.find('.flow_slide' + r_max_slide);
						var nextSlide2 = flow_slider.find('.flow_slide1');
					} else {
						var nextSlide = flow_slider.find('.flow_slide' + (parseInt(slideNum) + 1));
						var nextSlide2 = flow_slider.find('.flow_slide' + (parseInt(slideNum) + 2));
					}

					if ((parseInt(slideNum) - 1) < 1) {
						var prevSlide = flow_slider.find('.flow_slide' + r_max_slide);
						var prevSlide2 = flow_slider.find('.flow_slide' + (r_max_slide - 1));
					} else if ((slideNum - 1) == 1) {
						var prevSlide = flow_slider.find('.flow_slide1');
						var prevSlide2 = flow_slider.find('.flow_slide' + r_max_slide);
					} else {
						var prevSlide = flow_slider.find('.flow_slide' + (parseInt(slideNum) - 1));
						var prevSlide2 = flow_slider.find('.flow_slide' + (parseInt(slideNum) - 2));
					}

					prevSlide2.addClass('flow_prev2');
					prevSlide.addClass('flow_prev');
					curSlide.addClass('flow_current');
					nextSlide.addClass('flow_next');
					nextSlide2.addClass('flow_next2');

					startAutoplay();
				}
				setup_flow();

				// flow_slider_arrow_position();
			}

			function setup_flow() {
				var setHeight = settings.height;
				if (setHeight === '100%' && !that.is_single) {
					setHeight = that.window.height();
					setHeight -= that.adminbar.height();
					if (!that.header_over_bg) {
						setHeight -= that.header.height();
					}
					setHeight -= that.footer.height();
				} else if (setHeight === '100%' && that.is_single) {
					setHeight = that.window.height() - that.adminbar.height();
				}
				setHeight = parseInt(setHeight);
				flow_slider_wrapper.height(setHeight);
				if (flow_slider_wrapper.find('.flow_current .flow_title_content').length && that.windowSize.height > 480) {
					setHeight -= flow_slider.find('.flow_current').find('.flow_title_content').height();
					flow_slider_wrapper.find('.flow_title_content').css('display', '');
				} else {
					flow_slider_wrapper.find('.flow_title_content').css('display', 'none');
				}

				var setImgHeight = setHeight;
				var setImgWidth = Math.ceil(img_ration * setImgHeight);
				if (setImgWidth > settings.img_width) {
					setImgWidth = settings.img_width;
				}
				if (setImgHeight > settings.img_height) {
					setImgHeight = settings.img_height;
				}

				if (flow_slider_wrapper.width() >= 768) {
					if (setImgWidth * 1.5 + flow_slider_wrapper.width() / 10 > flow_slider_wrapper.width()) {
						setImgWidth = Math.ceil(flow_slider_wrapper.width() / 1.5) - Math.ceil(flow_slider_wrapper.width() / 20);
						setImgHeight = Math.ceil(setImgWidth / img_ration);
					}
				} else {
					setImgWidth = flow_slider_wrapper.width();
					setImgHeight = Math.ceil(setImgWidth / img_ration);
				}
				flow_slider_wrapper
					.find('.flow_slide').height(setImgHeight).width(setImgWidth)
					.find('img').height(setImgHeight).width(setImgWidth);

				flow_slider.height(setHeight);

				if (!flow_slider_wrapper.find('.flow_current').length) {
					set_flow_Slide(1);
				}
			}

			function init_pp4flow_slider() {
				if (jQuery('.flow_block2preload:first', $scope).length) {
					var $this_obj = jQuery('.flow_block2preload:first', $scope);
					(function (img, src) {
						img.src = src;
						img.onload = function () {
							$this_obj.removeClass('flow_block2preload').addClass('block_loaded').animate({
								'z-index': '3'
							}, 100, function () {
								init_pp4flow_slider();
							});
						};
					}(new Image(), that.getElementImage($this_obj)));

					if ($this_obj.parents('.flow_slider_wrapper').find('.flow_slide1').hasClass('block_loaded') && !$this_obj.parents('.flow_slider_wrapper').find('.flow_slider').hasClass('started')) {
						that.scrollTo(flow_slider_wrapper, 800);
						$this_obj.parents('.flow_slider_wrapper').find('.flow_slider').addClass('started');
						setup_flow();
					}
					if ($this_obj.parents('.flow_slider_wrapper').find('.flow_block2preload').size() < 1) {
						$this_obj.parents('.flow_slider').removeClass('wait4load').animate({
							'z-index': '3'
						}, 500, function () {
							flow_slider_container.removeClass('wait4load2');
						});
					}
				} else {
					flow_slider_container.removeClass('wait4load').animate({
						'z-index': '3'
					}, 500, function () {
						flow_slider_container.removeClass('wait4load2');
					});
				}
			}

			flow_slider_wrapper.find('.flow_slide').css('transition-duration', settings.transition + 'ms');

			init_pp4flow_slider();

		},
	});


	return GT3ElementorGalleryFrontend;
})
;
