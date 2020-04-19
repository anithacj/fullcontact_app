;'use strict';

(function (factory) {
	window.gt3Elementor = window.gt3Elementor || {};
	window.gt3Elementor.CoreFrontend = window.gt3Elementor.CoreFrontend || factory(window.jQuery);
})(function ($) {

	function CoreFrontend() {
		if (!this || this.widgets !== CoreFrontend.prototype.widgets) {
			return new CoreFrontend()
		}

		this.initialize();
	}

	$.extend(CoreFrontend.prototype, {
		widgets: {
			'gt3-core-testimonials': 'Testimonials',
			'gt3-core-TestimonialsLite': 'TestimonialsLite',
			'gt3-core-flipbox': 'FlipBox',
			'gt3-core-imagebox': 'ImageBox',
			'gt3-core-tabs': 'Tabs',
			'gt3-core-accordion': 'Accordion',
			'gt3-core-newaccordion': 'NewAccordion',
			'gt3-core-shoplist': 'ShopList',
			'gt3-core-counter': 'Counter',
			'gt3-core-piechart': 'PieChart',
			'gt3-core-portfolio': 'Portfolio',
			'gt3-core-portfoliocarousel': 'PortfolioCarousel',
            'gt3-core-project': 'Project',
			'gt3-core-team': 'Team',
			'gt3-core-teamtabs' : 'TeamTabs',
			'gt3-core-teamcarousel' : 'TeamCarousel',
			'gt3-core-blog': 'Blog',
			'gt3-core-blog-packery': 'BlogPackery',
			'gt3-core-gallerypackery': 'GalleryPackery',
			'gt3-core-videopopup': 'VideoPopup',
			'gt3-core-image-carousel': 'ImageCarousel',
			'gt3-core-pricebox': 'PriceBox',
			'gt3-core-button': 'Button',
			'gt3-core-countdown': 'Countdown',
			'gt3-core-imageprocessbar': 'Imageprocessbar',
			'column' : 'build_column_adds',
			'gt3-core-blog-simple' : 'BlogSimple',
			'gt3-core-team-search' : 'TeamSearch',
			'gt3-core-blockquote' : 'Blockquote',
			'toggle' : 'Toggle',
			'gt3-core-typed-text': 'TypedText',
		},
		body: $('body'),
		html: $('html'),
		window: $(window),
		adminbar: $('#wpadminbar'),
		is_admin: !!$('body').hasClass('admin-bar'),
		windowSize: {
			width: 1920,
			height: 1080,
			orientation: 'landscape',
			ratio: 1.778
		},
		page_title: $('.gt3-page-title_wrapper'),
		header: $('.gt3_header_builder'),
		header_over_bg: $('.gt3_header_builder').hasClass('header_over_bg'),
		header_sticky: $('.sticky_header'),
		is_single: $('body').hasClass('single-gallery'),
		footer: $('footer'),
		editMode: false,
		support: (function (element) {
			var support = {
				touch:
				window.ontouchstart !== undefined ||
				(window.DocumentTouch && document instanceof DocumentTouch)
			};
			var transitions = {
				webkitTransition: {
					end: 'webkitTransitionEnd',
					prefix: '-webkit-'
				},
				MozTransition: {
					end: 'transitionend',
					prefix: '-moz-'
				},
				OTransition: {
					end: 'otransitionend',
					prefix: '-o-'
				},
				transition: {
					end: 'transitionend',
					prefix: ''
				}
			};
			var prop;
			for (prop in transitions) {
				if (
					transitions.hasOwnProperty(prop) &&
					element.style[prop] !== undefined
				) {
					support.transition = transitions[prop];
					support.transition.name = prop;
					break
				}
			}

			function elementTests() {
				var transition = support.transition;
				var prop;
				var translateZ;
				document.body.appendChild(element);
				if (transition) {
					prop = transition.name.slice(0, -9) + 'ransform';
					if (element.style[prop] !== undefined) {
						element.style[prop] = 'translateZ(0)';
						translateZ = window
							.getComputedStyle(element)
							.getPropertyValue(transition.prefix + 'transform');
						support.transform = {
							prefix: transition.prefix,
							name: prop,
							translate: true,
							translateZ: !!translateZ && translateZ !== 'none'
						}
					}
				}
				if (element.style.backgroundSize !== undefined) {
					support.backgroundSize = {};
					element.style.backgroundSize = 'contain';
					support.backgroundSize.contain =
						window
							.getComputedStyle(element)
							.getPropertyValue('background-size') === 'contain';
					element.style.backgroundSize = 'cover';
					support.backgroundSize.cover =
						window
							.getComputedStyle(element)
							.getPropertyValue('background-size') === 'cover'
				}
				document.body.removeChild(element)
			}

			if (document.body) {
				elementTests()
			} else {
				$(document).on('DOMContentLoaded', elementTests)
			}
			return support
			// Test element, has to be standard HTML and must not be hidden
			// for the CSS3 tests using window.getComputedStyle to be applicable:
		})(document.createElement('div')),
		agent: {
			isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
			isFirefox: typeof InstallTrigger !== 'undefined',
			isSafari: /constructor/i.test(window.HTMLElement) || (function (p) {
				return p.toString() === "[object SafariRemoteNotification]";
			})(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
			isIE: /*@cc_on!@*/false || !!document.documentMode,
			isChrome: !!window.chrome && !!window.chrome.webstore,
			isEdge: false,
			isBlink: false
		},
		EasingFunctions: {
			// http://gizma.com/easing/#l
			linearTween: function (t, b, c, d) {
				return c * t / d + b;
			},
			easeInQuad: function (t, b, c, d) {
				t /= d;
				return c * t * t + b;
			},
			easeOutQuad: function (t, b, c, d) {
				t /= d;
				return -c * t * (t - 2) + b;
			},
			easeInOutQuad: function (t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t + b;
				t--;
				return -c / 2 * (t * (t - 2) - 1) + b;
			},
			easeInCubic: function (t, b, c, d) {
				t /= d;
				return c * t * t * t + b;
			},
			easeOutCubic: function (t, b, c, d) {
				t /= d;
				t--;
				return c * (t * t * t + 1) + b;
			},
			easeInOutCubic: function (t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t + b;
				t -= 2;
				return c / 2 * (t * t * t + 2) + b;
			},
			easeInQuart: function (t, b, c, d) {
				t /= d;
				return c * t * t * t * t + b;
			},
			easeOutQuart: function (t, b, c, d) {
				t /= d;
				t--;
				return -c * (t * t * t * t - 1) + b;
			},
			easeInOutQuart: function (t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t * t + b;
				t -= 2;
				return -c / 2 * (t * t * t * t - 2) + b;
			},
			easeInQuint: function (t, b, c, d) {
				t /= d;
				return c * t * t * t * t * t + b;
			},
			easeOutQuint: function (t, b, c, d) {
				t /= d;
				t--;
				return c * (t * t * t * t * t + 1) + b;
			},
			easeInSine: function (t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			},
			easeOutSine: function (t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			},
			easeInOutSine: function (t, b, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			},
			easeInExpo: function (t, b, c, d) {
				return c * Math.pow(2, 10 * (t / d - 1)) + b;
			},
			easeOutExpo: function (t, b, c, d) {
				return c * (-Math.pow(2, -10 * t / d) + 1) + b;
			},
			easeInOutExpo: function (t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				t--;
				return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
			},
			easeInCirc: function (t, b, c, d) {
				t /= d;
				return -c * (Math.sqrt(1 - t * t) - 1) + b;
			},
			easeOutCirc: function (t, b, c, d) {
				t /= d;
				t--;
				return c * Math.sqrt(1 - t * t) + b;
			},
			easeInOutCirc: function (t, b, c, d) {
				t /= d / 2;
				if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				t -= 2;
				return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
			}
		},
		isInViewport: function (elem) {
			if ('length' in elem) elem = elem[0];
			var bounding = elem.getBoundingClientRect();
			return (
				(bounding.top > 0 && (window.innerHeight || document.documentElement.clientHeight) > bounding.top + 50)
				|| (bounding.top < 0 && (Math.abs(bounding.top) + 50 < bounding.height))
			);
		},
		setCookie: function (name, value, options) {
			options = options || {};

			$.extend(options, {
				path: '/',
				expires: 2592000 // month
			});

			var expires = options.expires;

			if (typeof expires == "number" && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}

			// value = encodeURIComponent(value);

			var updatedCookie = name + "=" + typeof value === "object" ? JSON.stringify(value) : value;

			for (var propName in options) {
				updatedCookie += "; " + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += "=" + propValue;
				}
			}

			document.cookie = updatedCookie;
		},
		getCookie: function (name) {
			var matches = document.cookie.match(new RegExp(
				"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
			));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		},
		getAdminBar: function () {
			if (this.is_admin && !this.adminbar) {
				this.adminbar = $('#wpadminbar');
			}
		},
		setTransition: function (element, duration, delay, _return) {
			var that = this;
			if (this.support.transition) {
				if ('length' in element && element.length) {
					element = element[0];
				}
				if ('style' in element) {
					var style = element.style;
					style[this.support.transition.name + 'Duration'] = !duration ? '' : duration + 'ms';
					style[this.support.transition.name + 'Delay'] = !delay ? '' : delay + 'ms';

					if (_return) {
						$(element).on(this.support.transition.end, endOfTransition);
					}
				}
			}

			function endOfTransition() {
				$(element).off(that.support.transition.end, endOfTransition);
				that.setTransition(element, 0, 0);
			}
		},
		cubic: function (encodedFuncName, coOrdArray) {
			if ($.isArray(encodedFuncName)) {
				coOrdArray = encodedFuncName;
				encodedFuncName = 'bez_' + coOrdArray.join('_').replace(/\./g, 'p');
			}
			if (typeof $.easing[encodedFuncName] !== "function") {
				var polyBez = function (p1, p2) {
					var A = [null, null], B = [null, null], C = [null, null],
						bezCoOrd = function (t, ax) {
							C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
							return t * (C[ax] + t * (B[ax] + t * A[ax]));
						},
						xDeriv = function (t) {
							return C[0] + t * (2 * B[0] + 3 * A[0] * t);
						},
						xForT = function (t) {
							var x = t, i = 0, z;
							while (++i < 14) {
								z = bezCoOrd(x, 0) - t;
								if (Math.abs(z) < 1e-3) break;
								x -= z / xDeriv(x);
							}
							return x;
						};
					return function (t) {
						return bezCoOrd(xForT(t), 1);
					}
				};
				$.easing[encodedFuncName] = function (x, t, b, c, d) {
					return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t / d) + b;
				}
			}
			return encodedFuncName;
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
		removeKey: function (arrayName, key) {
			var x;
			var tmpArray = {};
			var i = 0;
			for (x in arrayName) {
				if (x != key) {
					tmpArray[i++] = arrayName[x];
				}
			}
			return tmpArray;
		},
		getHeight: function () {
			var Height = this.getWindowHeight();
			if (this.is_admin) {
				Height -= this.adminbar.height() || 32;
			}
			if (this.header_sticky.length && this.header_sticky.hasClass('sticky_on')) {
				Height -= this.header_sticky.height();
			}
			return Height;
		},
		getWindowHeight: function () {
			return window.innerHeight;
		},
		get_position: function (element) {
			if ('tagName' in element && element.tagName !== 'IMG') {
				element = $('img', element);
			}
			element = $(element);
			return {
				top: Math.round(element.offset().top - $(document).scrollTop() - parseInt(element.css('margin-top'))),
				left: Math.round(element.offset().left - $(document).scrollLeft() - parseInt(element.css('margin-left'))),
				width: Math.round(element.width()),
				height: Math.round(element.height())
			};
		},
		scrollTo: function (element, duration, callback) {
			if (typeof element !== "number") {
				element = this.getScrollTo(element);
			}

			$('html, body').animate({
				scrollTop: (element)
			}, duration, this.cubic([0.75, 0, 0.25, 1]), callback);
		},
		getScrollTo: function (element) {
			var offset = element.offset().top;
			offset -= this.adminbar.height();
			if (this.header_sticky.length && this.header_sticky.hasClass('sticky_on')) {
				offset -= this.header_sticky.height();
			}
			return offset;
		},
		getScrollToCenter: function (element) {
			var offset = this.getScrollTo(element);
			var h_p = (this.window.height() - element.height()) / 2;
			return (offset - h_p);
		},
		roundNumber: function (num) {
			return +(Math.round(num + "e+2") + "e-2");
		},
		initialize: function () {


			jQuery('.project_wrapper .img img').each(function(){
				if (!jQuery(jQuery(this).parents('.elementor-column')[0]).hasClass('elementor-col-100')) {

					var image_width = jQuery(this).width();
					var lazyImage = jQuery(this)[0];
					var srcset = lazyImage.dataset.srcset

					var array_srcset = srcset.split(',');
					var srcset_by_size = [];
					array_srcset.forEach(function(item, i, arr) {
						var item_array = item.trim().split(' ');
						array_srcset[i] = item_array;

						var srcset_width = parseInt(item_array[1],10);

						if ((image_width < srcset_width) && (srcset_width >= 600)) {
							srcset_by_size[parseInt(item_array[1],10)] = item_array[0];
						}
					})
					var first_key = Object.keys(srcset_by_size)[0];
					var smallest_image = srcset_by_size[first_key];

					jQuery(lazyImage).attr('src',smallest_image)
					jQuery(lazyImage).removeAttr('data-src').removeAttr('data-srcset').removeAttr('data-sizes')

					jQuery(lazyImage).removeClass("gt3_lazyload");
	        		jQuery(lazyImage).addClass("gt3_lazyload_loaded");
	        		jQuery( lazyImage ).parents('.isotope_item.lazy_loading').removeClass('lazy_loading').addClass('lazy_loaded')

				}
			})

			var that = this;

			that.window.on('load', function () {
				that.adminbar = $('#wpadminbar');
			});

			$(window).on('resize', that.resize.bind(that));
			that.resize();
			this.agent.isEdge = !this.agent.isIE && !!window.StyleMedia;
			this.agent.isBlink = (this.agent.isChrome || this.agent.isOpera) && !!window.CSS;

			if (typeof window.elementorFrontend !== 'undefined') {
				$.each(that.widgets, function (name, callback) {
					window.elementorFrontend.hooks.addAction('frontend/element_ready/' + name + '.default', that[callback].bind(that));
				})
			}
			if (typeof elementorFrontend !== 'undefined') {
				this.editMode = elementorFrontend.config.isEditMode || (elementorFrontend.isEditMode && elementorFrontend.isEditMode());
			}

			$( 'body:not(.elementor-editor-active) .gt3_column_link-elementor' ).each(function(){
				var element = jQuery(this);
				var element_url = element.attr('data-column-clickable-url');
				var element_link_blank = element.attr('data-column-clickable-blank')

				element.find('.elementor-column-wrap').on('click',function(e){
					if (e.target.nodeName != 'A') {
						if (element_link_blank == 'yes') {
							window.open(element_url, '_blank');
						}else{
							window.location.href = element_url;
						}
					}
				})
			})


			if (this.editMode) {
				jQuery(function ($) {
					jQuery(':input');
				});

				setTimeout(function () {
					var elementorItemsModels = window.elementor.elements.models;
					elementorItemsModels.forEach(function(item, i, arr){
						that.find_any_element(item.attributes);
					})
				}, 200);
			}
			//// check here
            if (typeof window.elementorFrontend !== 'undefined') {
				window.elementorFrontend && elementorFrontend.hooks.addAction('frontend/element_ready/column', that['build_column_adds'].bind(that));
			}



			jQuery('.gt3_carousel-elementor').each(function(){
				that.build_column_adds(this);
			});

			jQuery('.gt3_column_tabs-elementor').each(function(){
				that.build_column_adds(this);
			});

		},
		find_any_element: function (item){
			var that = this;
			if (item.elType == 'column') {

				if (item.settings.attributes.gt3_carousel_back_end === 'yes') {

					var attributes = item.settings.attributes;
					var settings = {};

					settings.items_per_line = attributes.gt3_carousel_items_per_line;
					settings.item_per_line_mobile = attributes.gt3_carousel_items_per_line_mobile;
					settings.item_per_line_tablet = attributes.gt3_carousel_items_per_line_tablet;
					settings.autoplay = attributes.gt3_carousel_autoplay == 'yes' ? true : false;
					settings.autoplaySpeed = attributes.gt3_carousel_autoplay_time;
					settings.dots = attributes.gt3_carousel_nav == 'dots' ? true : false;
					settings.arrows = attributes.gt3_carousel_nav == 'arrows' ? true : false;
					settings.centerMode = attributes.gt3_carousel_center_mode == 'yes' ? true : false;
					settings.l10n = {};
					settings.l10n.prev = attributes.gt3_carousel_nav_prev ? attributes.gt3_carousel_nav_prev : '';
					settings.l10n.next = attributes.gt3_carousel_nav_next ? attributes.gt3_carousel_nav_next : '';

					if (item.settings.attributes.gt3_carousel === 'yes') {
						if (item.id) {
							jQuery('.elementor-element-'+item.id).addClass('gt3_carousel-elementor');
							jQuery('.elementor-element-'+item.id).attr('data-settings',JSON.stringify(settings));
							jQuery('.elementor-element-'+item.id).addClass('gt3_carousel_items_per_line-'+settings.items_per_line);
							jQuery('.elementor-element-'+item.id).addClass('gt3_carousel_items_per_line_tablet-'+settings.item_per_line_tablet);
							jQuery('.elementor-element-'+item.id).addClass('gt3_carousel_items_per_line_mobile-'+settings.item_per_line_mobile);
						}
					}
					jQuery('.elementor-element-'+item.id).removeClass('gt3_carousel_destroy-elementor');
				}else{
					jQuery('.elementor-element-'+item.id).addClass('gt3_carousel_destroy-elementor');
				}


				if (item.settings.attributes.gt3_tabs === 'yes') {
					var attributes = item.settings.attributes;
					var settings = {};
					var tab_items = {};

					settings.gt3_tabs_active = parseInt(attributes.gt3_tabs_active) - 1;
					settings.gt3_tabs_type = attributes.gt3_tabs_type;


					if(attributes.items.length){						
						attributes.items.models.forEach(function(item, i, arr){
							tab_items[i] = {};
							tab_items[i]['title'] = item.attributes['tab_title'];
							tab_items[i]['icon'] = item.attributes['icon'];
							tab_items[i]['type'] = item.attributes["type"];
							tab_items[i]['image'] = item.attributes['image'];
							tab_items[i]['image_hover'] = item.attributes['image_hover'];
							tab_items[i]['gt3_tabs_icon_size'] = item.attributes['gt3_tabs_icon_size'];
							tab_items[i]['_id'] = item.attributes['_id'];
						})
					}

					if (item.id) {
						jQuery('.elementor-element-'+item.id).addClass('gt3_column_tabs-elementor');
						if (settings['gt3_tabs_type'] === 'vertical') {
							jQuery('.elementor-element-'+item.id).addClass('gt3_column_tabs-type_vertical');
						}else{
							jQuery('.elementor-element-'+item.id).removeClass('gt3_column_tabs-type_vertical');
						}
						jQuery('.elementor-element-'+item.id).attr('data-settings',JSON.stringify(settings));
						jQuery('.elementor-element-'+item.id).attr('data-tab-items',JSON.stringify(tab_items));
					}
				}else{
					if (item.id) {
						jQuery('.elementor-element-'+item.id).removeClass('gt3_column_tabs-elementor');
						jQuery('.elementor-element-'+item.id).removeClass('gt3_column_tabs__activated');
					}
				}

				that.build_column_adds(jQuery('.elementor-element-'+item.id));
			}

			if (item.widgetType == 'toggle') {
				if (item.settings.attributes.add_question_marker === 'yes') {
					jQuery('.elementor-element-'+item.id).find('.elementor-tab-title').addClass('add_question_marker').attr('data-question_marker', item.settings.attributes.question_marker);
				}else{
					jQuery('.elementor-element-'+item.id).find('.elementor-tab-title').removeClass('add_question_marker')
				}
			}

			if (item.elements.length) {
				if (item.elements.models.length) {
					item.elements.models.forEach(function(item, i, arr){
						if (item.attributes) {
							that.find_any_element(item.attributes);
						}
					})
				}
			}
		},
		build_column_adds: function (column){


			var that = this;
			var element = jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap');
			if (jQuery(column).hasClass('gt3_carousel-elementor')) {
				that.build_column_carousel(column);
			}

			if (jQuery(column).hasClass('gt3_column_tabs-elementor') && !jQuery(column).hasClass('gt3_column_tabs__activated') ) {


				if (that.window.outerWidth() > 768) {
					if (element.hasClass('ui-accordion')) {
						element.accordion("destroy");
					}	
					if (jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap').hasClass('.ui-tabs')) {
						return;
					}
				}else{
					jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap.ui-tabs').tabs("destroy");	
					if (element.hasClass('ui-accordion')) {
						return;
					}
				}


				var element = jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap');
				var tabs_header = '';

				element.children('.gt3_column_tabs_nav_wrapper').remove();


				element.children('.elementor-element').each(function(index){
					var tab_item_json = jQuery(column).attr('data-tab-items');
					if (tab_item_json) {					
						var tab_items = JSON.parse(tab_item_json);
					}					

					var tab_content = '';
					var tab_id = 'elementor-repeater-item-';

					if (tab_items[index]) {
						if (tab_items[index]['type']) {
							
							if (tab_items[index]['_id']) {
								tab_id += tab_items[index]['_id'];
							}

							if (tab_items[index]['type'] == 'icon') {
								if (tab_items[index]['icon']) {
									tab_content += '<span class="gt3_column_tabs_nav__icon '+tab_items[index]['icon']+(tab_items[index]['gt3_tabs_icon_size'] ? ' gt3_column_tabs_nav__icon--'+tab_items[index]['gt3_tabs_icon_size'] : '')+'"></span>';
								}
							}
							if (tab_items[index]['type'] == 'image') {
								tab_content += '<span class="gt3_column_tabs_nav__image_container">';
								if (tab_items[index]['image']) {
									tab_content += '<span class="gt3_column_tabs_nav__image gt3_column_tabs_nav__image--front'+(tab_items[index]['gt3_tabs_icon_size'] ? ' gt3_column_tabs_nav__icon--'+tab_items[index]['gt3_tabs_icon_size'] : '')+'"><img src='+tab_items[index]['image']['url']+' ></span>';
								}
								if (tab_items[index]['image_hover']) {
									tab_content += '<span class="gt3_column_tabs_nav__image gt3_column_tabs_nav__image--back'+(tab_items[index]['gt3_tabs_icon_size'] ? ' gt3_column_tabs_nav__icon--'+tab_items[index]['gt3_tabs_icon_size'] : '')+'"><img src='+tab_items[index]['image_hover']['url']+' ></span>';
								}
								tab_content += '</span>';
							}
						}
						if (tab_items[index]['title']) {
							tab_content += '<span class="gt3_column_tabs_nav__title">'+tab_items[index]['title']+'</span>';
						}
						
					}

					jQuery(this).attr('id',jQuery(this).attr('data-id'))

					if (that.window.outerWidth() > 768) {
						tabs_header += '<li class="'+tab_id+'"><a href="#'+jQuery(this).attr('data-id')+'">'+tab_content+'</a></li>';
					}else{
						element.find('#'+jQuery(this).attr('data-id')).before('<div class="gt3_column_tabs_nav_wrapper"><ul class="gt3_column_tabs_nav"><li class="'+tab_id+'"><a href="#">'+tab_content+'</a></li></ul></div>');
					}

				});
				if (that.window.outerWidth() > 768) {
					element.prepend('<div class="gt3_column_tabs_nav_wrapper"><ul class="gt3_column_tabs_nav">'+tabs_header+'</ul></div>');
				}
				

				var json = jQuery(column).attr('data-settings');
				if (json) {					
					var settings = JSON.parse(json);
				}

				setTimeout(function () {
					element.find('.gt3_column_tabs_nav a').click(function(e){
						e.preventDefault()
						if (that.window.outerWidth() > 768) {
							e.stopPropagation()
						}
					})

					if (that.window.outerWidth() > 768) {
						if (element.hasClass('ui-accordion')) {
							element.accordion("destroy");
						}	
						jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap.ui-tabs').tabs("destroy");
						jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap').tabs({
							active: settings.gt3_tabs_active,
							hide: {effect:'fadeOut',duration: 200},
							show: {effect:'fadeIn',duration: 200}
						});
					}else{
						if (!element.hasClass('ui-accordion')) {
							jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap.ui-tabs').tabs("destroy");		
							element.accordion({
									classes: {
										"ui-accordion": "highlight"
									},
									header: ".gt3_column_tabs_nav_wrapper",
									icons: false
								}
							);
						}				

					}

				}, 400);


			}

		},
		build_column_tabs: function (item){
			var that = this;
		},
		build_column_carousel: function (column) {
			var element = jQuery(column).children('.elementor-column-wrap').children('.elementor-widget-wrap');
			if (element.hasClass('slick-initialized') || !jQuery(column).hasClass('gt3_carousel-elementor')) {
				return;
			}
			if (element.hasClass('slick-initialized')) {
				element.slick('unslick');
			}
			if (jQuery(column).hasClass('gt3_carousel_destroy-elementor')) {
				if (element.hasClass('slick-initialized')) {
					element.slick('unslick');
				}
				return;
			}

			if (jQuery(column).attr('data-settings')) {
				var json = jQuery(column).attr('data-settings');
				var settings = JSON.parse(json);

				var responsive = [];

				if (settings.item_per_line_tablet) {
					responsive.push({
						breakpoint: 1024,
						settings: {
							slidesToShow: parseInt(settings.item_per_line_tablet),
							slidesToScroll: parseInt(settings.item_per_line_tablet)
						}
					});
				}else{
					switch(parseInt(settings.items_per_line)) {
						case 5:
						case 4:
						case 3:
						    responsive.push({
								breakpoint: 1024,
								settings: {
									slidesToShow: 2,
									slidesToScroll: 2
								}
							});
					    break;

					  case 6:
						    responsive.push({
								breakpoint: 1024,
								settings: {
									slidesToShow: 3,
									slidesToScroll: 3
								}
							});
					    break;

					  default:

					}

				}

				if (settings.item_per_line_mobile) {
					responsive.push({
						breakpoint: 768,
						settings: {
							slidesToShow: parseInt(settings.item_per_line_mobile),
							slidesToScroll: parseInt(settings.item_per_line_mobile)
						}
					});
				}else{
					responsive.push({
						breakpoint: 768,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					});
				}


			}else{
				var settings = {};
				settings.items_per_line = 1;
				settings.autoplay = false;
				settings.autoplaySpeed = 3000;
				settings.dots = true;
				settings.arrows = true;
				settings.centerMode = false;
				settings.l10n = [];
				settings.l10n.prev = 'Prev';
				settings.l10n.next = 'Next';

				var responsive = [];

				responsive.push({
					breakpoint: 600,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				});

				if (settings.items_per_line == 3) {
					responsive.push({
						breakpoint: 992,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1
						}
					});
				}
			}

			var variableWidth = jQuery(column).parents('.elementor-section').hasClass('elementor-section-full_width') && jQuery(column).parents('.elementor-section').hasClass('elementor-section-stretched') && settings.centerMode;

			element.slick({
				autoplay: settings.autoplay,
				autoplaySpeed: settings.autoplaySpeed,
				dots: settings.dots,
				arrows: settings.arrows,
				slidesToScroll: parseInt(settings.items_per_line),
				slidesToShow: parseInt(settings.items_per_line),
				centerMode: settings.centerMode,
				variableWidth: variableWidth,
				focusOnSelect: true,
				speed: 500,
				infinite: true,
				prevArrow: '<div class="slick-prev gt3_modified"><div class="slick_arrow_icon slick_arrow_icon__left"></div>' + (settings.l10n.prev ? '<div class="slick_arrow_text">'+settings.l10n.prev+'</div>' : '') + '</div>',
				nextArrow: '<div class="slick-next gt3_modified">' + (settings.l10n.next ? '<div class="slick_arrow_text">'+settings.l10n.next+'</div>' : '') + '<div class="slick_arrow_icon slick_arrow_icon__right"></div></div>',
				responsive: responsive
			});
		},
		resize: function () {
			var that = this;
			this.windowSize.width = this.window.width();
			this.windowSize.height = this.window.height();
			this.windowSize.ratio = parseFloat(this.windowSize.width / this.windowSize.height).toFixed(3);
			this.windowSize.orientation = this.windowSize.ratio >= 1 ? 'landscape' : 'portrait';
			this.setCookie('gt3-window-size', this.windowSize);
			jQuery('.gt3_column_tabs-elementor').each(function(){
				that.build_column_adds(this);
			});
		},

		countFilterElements: function($scope) {
			var parent = $scope,
				value = $scope.find('.isotope-filter'),
				filter_elements = value.children(),
				elements = parent.find('.gt3_isotope_parent');
			if (filter_elements.length) {
				var filter_name, count;
				filter_elements.each(function (elem_key, elem_value) {
					elem_value = jQuery(elem_value);
					filter_name = elem_value.attr('data-filter');
					if (filter_name === '*') {
						count = elements.children().length;
					} else {
						count = elements.find(filter_name).length;
					}
					elem_value.attr('data-count',count);
				})
			}
		},
		loadFullImage: function ($items, callback) {
			var that = this;
			var $img = $('[data-srcset]', $items);
			if ($img.length) {
				$img = $img.first();
				$img.attr({srcset: $img.data('srcset')}).removeAttr('data-srcset').imagesLoaded(function () {
					that.loadFullImage($items, callback);
				})
			} else if (callback instanceof Function) {
				callback.call($items);
			}
		},
		Testimonials: function ($scope) {
			$scope = jQuery('.module_testimonial', $scope);
			if (!$scope.length) {
				return;
			}
			var settings = $scope.data('settings');
			$('.testimonials_item', $scope).css('display', '');

			jQuery('.testimonials_rotator', $scope).slick({
				autoplay: settings.autoplay,
				autoplaySpeed: settings.autoplaySpeed,
				fade: settings.fade,
				dots: settings.dots,
				arrows: settings.arrows,
				slidesToScroll: settings.items_per_line,
				slidesToShow: settings.items_per_line,
				focusOnSelect: true,
				speed: 500,
				infinite: true,
				prevArrow: '<div class="slick-prev gt3_modified"><div class="theme_icon-arrows-left"></div>' + settings.l10n.prev + '</div>',
				nextArrow: '<div class="slick-next gt3_modified">' + settings.l10n.next + '<div class="theme_icon-arrows-right"></div></div>',
				responsive: [
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}

				]
			});

		},
		TestimonialsLite: function ($scope) {
			$scope = jQuery('.gt3_testimonial', $scope);
			if (!$scope.length) {
				return;
			}
			var settings = $scope.data('settings');
			$('.testimonials_item', $scope).css('display', '');


			var testimonials_list = $('.testimonials_list', $scope);
			var quote_color = $scope.find('.testimonials_content .testimonials-text').css('color');
			var canvas = document.createElement('canvas');
			canvas.classList.add("testimonials-canvas-quote");
			testimonials_list.prepend(canvas);
			testimonials_list.prepend('<img class="testimonials-text-quote-holder" src=""/>');

			var quote_custom_color = $scope.find('.testimonials-text-quote-holder').css('color');
			if (typeof quote_custom_color !== 'undefined') {
				quote_color = quote_custom_color;
			}

			var img = new Image;
		      img.onload = function () {
		        canvas.width = this.width;
		        canvas.height = this.height;
		        // draw image
		        ctx.drawImage(this, 0, 0);
		        // set composite mode
		        ctx.globalCompositeOperation = "source-in";
		        // draw color
		        ctx.fillStyle = quote_color;

		        ctx.fillRect(0, 0, canvas.width, canvas.height);

		        var image = canvas.toDataURL("image/png");
		      	testimonials_list.find('.testimonials-text-quote-holder').attr('src',image);
		      	$('.testimonials_item', $scope).each(function(){
					var element = jQuery(this);
					if (element.length) {
						
						/*element.find('.testimonials-text-quote').attr('src',image);*/
						element.find('.testimonials-text').prepend('<div class="testimonials-text-quote"><div class="testimonials-quote-icon-holder" style="background-image:url('+image+');-webkit-mask-image:url('+image+');"></div></div>');
				    }
				})

		      };
		      if ($scope.attr('data-quote-src').length) {
		      	img.src = $scope.attr('data-quote-src');
		      }else{
		      	img.src = gt3_gt3theme.templateUrl+"/img/quote.png";
		      }
		      var ctx = canvas.getContext("2d");

		    var testimonials_author_rotator = jQuery('.testimonials_author_rotator', $scope);
		    if (!jQuery('.testimonials_author_rotator', $scope).length) {
		    	testimonials_author_rotator = false;
		    }


			jQuery('.testimonials_rotator', $scope).slick({
				autoplay: settings.autoplay,
				autoplaySpeed: settings.autoplaySpeed,
				fade: settings.fade,
				dots: settings.dots,
				arrows: settings.arrows,
				slidesToScroll: settings.items_per_line,
				slidesToShow: settings.items_per_line,
				focusOnSelect: true,
				speed: 500,
				infinite: true,
				asNavFor: testimonials_author_rotator,
				prevArrow: '<div class="slick-prev gt3_modified"><div class="theme_icon-arrows-left"></div>' + settings.l10n.prev + '</div>',
				nextArrow: '<div class="slick-next gt3_modified">' + settings.l10n.next + '<div class="theme_icon-arrows-right"></div></div>',
				responsive: [
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}

				]
			});

			if (jQuery('.testimonials_author_rotator', $scope).length) {
				jQuery('.testimonials_author_rotator', $scope).slick({
					slidesToShow: 3,
					slidesToScroll: 1,
					asNavFor: jQuery('.testimonials_rotator', $scope),
					dots: false,
					arrows: false,
					infinite: true,
					focusOnSelect: true,
					speed: 500,
					centerMode: $scope.hasClass('text_align-center'),
				})

			}

		},
		FlipBox: function ($scope) {
			var that = this;
			var $wrap_text = $scope.find('.text_wrap'),
				$fake_space = $scope.find('.fake_space');

			function resize() {
				if ($wrap_text.length && $fake_space.length) {
					$fake_space.height($wrap_text.height());
				}
			}

			that.window.on('resize', resize);
			resize();
		},
		ImageBox: function ($scope) {

		},
		Tabs: function ($scope) {
			var type_style_vertical = $scope.find('.vertical_type'),
				active_tab = $scope.find('.gt3_tabs_wrapper').attr('data-active-tab'),
				tabs_count = $scope.find('.gt3_tabs_nav li').length;

			if (active_tab > tabs_count) {
				active_tab = 1;
			}

			var tabindex_1 = active_tab - 1;

			if (type_style_vertical.length) {
				$scope.find('.gt3_tabs_wrapper').tabs({
					active: tabindex_1
				}).addClass('ui-tabs-vertical ui-helper-clearfix');
				$scope.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');
			} else {
				$scope.find('.gt3_tabs_wrapper').tabs({
					active: tabindex_1
				});
			}
		},
		Accordion: function ($scope) {
			var $wrapper = $scope.find('.accordion_wrapper');
			$wrapper.accordion({
					classes: {
						"ui-accordion": "highlight"
					},
					header: ".item_title",
					icons: {
						"header": " ui-icon-copy",
						"activeHeader": " ui-icon-alert"
					}
				}
			);
			jQuery(window).resize(function () {
				$wrapper.accordion("refresh");
			});
		},
		NewAccordion: function ($scope) {
			var $wrapper = $scope.find('.newaccordion_wrapper');
			$wrapper.accordion({
					classes: {
						"ui-accordion": "highlight"
					},
					header: ".item_title",
					icons: false
				}
			);
			jQuery(window).resize(function () {
				$wrapper.accordion("refresh");
			});
		},
		ShopList: function ($scope) {
			if (this.editMode) {
				var wrapper = jQuery(".gt3_theme_core.gt3-shop-list", $scope);
				if (wrapper.length) {
					wrapper.each(function () {
						var $this = $(this);
						if ($this.parent().parent().hasClass('elementor-element-editable')) {
							$this.addClass('gt3-shop-list-view').slideDown();
						}
					});
				}
			}
		},
		Counter: function ($scope) {
			var that = this;
			var $wrapper = $scope.find('.counter-wrapper');

			var options = $wrapper.data('options');
			var settings = $wrapper.data('settings');
			var element = $scope.find('.counter')[0];
			options.easingFn = that.EasingFunctions[options.easingFn];

			that.window.on('scroll', scroll);
			var countUp = new CountUp(element, settings.start, settings.end, settings.decimal, settings.duration, options);

			function start() {
				if (!countUp.error) {
					countUp.start(function () {
						countUp.duration = 100;
						countUp.update(settings.end);
					})
				} else console.error(countUp.error);
			}

			function scroll() {
				if (that.isInViewport($wrapper)) {
					that.window.off('scroll', scroll);
					start();
				}
			}

			scroll();
		},
		PieChart: function ($scope) {
			var that = this;
			var $wrapper = $scope.find('.gt3_elementor_pie_chart');

			that.window.on('scroll', scroll);

			function start() {
				var this_label_value = $wrapper.attr('data-label-value');
				$wrapper.circleProgress({
					startAngle: -Math.PI
				}).on('circle-animation-progress', function (event, progress) {
					$wrapper.find('strong').html(Math.round(this_label_value * progress) + $wrapper.attr('data-units'));
				});
			}

			function scroll() {
				if (that.isInViewport($wrapper)) {
					that.window.off('scroll', scroll);
					start();
				}
			}

			scroll();

		},



		PortfolioCarousel: function ($scope) {
			var that = this;
			var wrapper = $scope.hasClass('portfolio_carousel_wrapper') ? $scope : $('.portfolio_carousel_wrapper', $scope);
			if (!wrapper.length) {
				console.warn('Portfolio Carousel wrapper not found');
				return;
			}

			var settings = wrapper.data('settings');

			$('.portfolio_item', $scope).css('display', '');

			var variableWidth = jQuery('.items_list', $scope).parents('.elementor-section').hasClass('elementor-section-full_width') && jQuery('.items_list', $scope).parents('.elementor-section').hasClass('elementor-section-stretched') && settings.centerMode;

			var responsive = [];

			responsive.push({
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			});

			if (settings.items_per_line === 3) {
				responsive.push({
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				});
			}

			if (settings.show_text === true && settings.items_per_line === 4) {
				responsive.push({
					breakpoint: 1400,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1
					}
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				});
			}else if (settings.items_per_line === 4) {
				responsive.push({
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1
					}
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				});
			}


			jQuery('.items_list', $scope).slick({
				autoplay: settings.autoplay,
				autoplaySpeed: settings.autoplaySpeed,
				dots: settings.dots,
				arrows: settings.arrows,
				slidesToScroll: settings.items_per_line,
				slidesToShow: settings.items_per_line,
				centerMode: settings.centerMode,
				variableWidth: variableWidth,
				focusOnSelect: true,
				speed: 500,
				infinite: true,
				prevArrow: '<div class="slick-prev gt3_modified"><div class="theme_icon-arrows-left"></div>' + settings.l10n.prev + '</div>',
				nextArrow: '<div class="slick-next gt3_modified">' + settings.l10n.next + '<div class="theme_icon-arrows-right"></div></div>',
				responsive: responsive
			});
		},


		Portfolio: function ($scope) {
			var that = this;
			var wrapper = $scope.hasClass('portfolio_wrapper') ? $scope : $('.portfolio_wrapper', $scope);
			if (!wrapper.length) {
				console.warn('Portfolio wrapper not found');
				return;
			}

			var settings = wrapper.data('settings');

			if (!'type' in settings) return;
			var query = {
				pagination_en: settings.pagination_en,
				query: settings.query,
				lazyload: settings.lazyload,
				grid_gap: settings.grid_gap,
				show_title: settings.show_title,
				show_category: settings.show_category,
				use_filter: settings.use_filter,
				random: settings.random,
				render_index: wrapper.attr('data-post-index'),
				settings: settings.settings
			};
			query.action = 'gt3_themes_core_portfolio_load_items';
			query.query.paged = 0;

			var isotope = jQuery('.isotope_wrapper', $scope);

			var paged = 0;
			var packery = settings.packery,
				wrap_width_origin, index, width, height, wrap_width, wrap_height,
				wrap_ratio, img_ratio;

			isotope.imagesLoaded(function () {
				that.countFilterElements($scope);
				grid_resize();
			});


			if (!that.editMode) {
				var block_ajax = false;
				$('.portfolio_view_more_link', $scope).on('click', function (e) {
					e.preventDefault();
					if (block_ajax) return;
					block_ajax = true;

					query.render_index =  wrapper.attr('data-post-index');

					query.query.paged++;
					jQuery.ajax({
						type: "POST",
						data: query,
						url: gt3_themes_core.ajaxurl,
						success: function (data) {
							if ('post_count' in data && data.post_count > 0) {
								var post_index = wrapper.attr('data-post-index');
								wrapper.attr('data-post-index',(Number(post_index)+data.post_count))
								var add = $(data.respond);
								isotope.append(add).isotope('appended', add);

								that.countFilterElements($scope);

								setTimeout(function () {
									isotope.isotope({sortby: 'original-order'});
									grid_resize();
								}, 300);
								setTimeout(function () {
									showImages();
									that.show_lazy_images(isotope,add.find('img.gt3_lazyload'));
								}, 800);
							}
							if ('max_page' in data && (data.max_page <= query.query.paged || data.max_page === 0)) {
								$('.portfolio_view_more_link', $scope).remove();
							}
							if ('exclude' in data) {
								query.query.exclude = data.exclude;
							}
							block_ajax = false;
						},
						error: function (e) {
							console.error('Error request');
							block_ajax = false;
						}
					});
				});

				$scope.on("click", ".isotope-filter:not(.isotope-filter--links) a", function (e) {
					e.preventDefault();
					var data_filter = this.getAttribute("data-filter");
					jQuery(this).siblings().removeClass("active");
					jQuery(this).addClass("active");
					isotope.isotope({filter: data_filter});
					that.show_lazy_images(isotope);
				});
			}


			that.window.on('resize', function () {
				grid_resize();
			});

			function grid_resize() {
				var options = {
					itemSelector: '.isotope_item',
					layoutMode: 'masonry'
				};

				var layoutMode = 'masonry';
				var wrap_width_origin = '.isotope_item';
				if (settings.type === 'grid' && !isotope.hasClass('portfolio_offset_mode')) {
					layoutMode = 'fitRows';
				}
				if (settings.type === 'packery') {
					wrap_width_origin = '.isotope_item.packery_extra_size-default';
				}

				if (isotope[0] instanceof HTMLElement) {
					isotope.isotope({
						layoutMode: layoutMode,
						itemSelector: '.isotope_item',
						percentPosition: true,
						stagger: 30,
						transitionDuration: '0.4s',
						masonry: {
							columnWidth: wrap_width_origin,
							rowHeight: wrap_width_origin
						},
						originLeft: !jQuery('body').hasClass('rtl')
					}).isotope('layout');
				}else{
					var isotope_items = isotope.find('.isotope_item');
					var isotope_items_html = '';
					isotope_items.each(function(){
						isotope_items_html += jQuery(this)[0].outerHTML;
					})

					isotope_items_html = jQuery(isotope_items_html)
					isotope.empty();

					that.show_lazy_images(isotope,isotope_items_html.find('img.gt3_lazyload'));

					isotope.isotope({
						layoutMode: layoutMode,
						itemSelector: '.isotope_item',
						percentPosition: true,
						masonry: {
							columnWidth: wrap_width_origin
						},
						originLeft: !jQuery('body').hasClass('rtl')
					}).isotope('insert', isotope_items_html ).imagesLoaded(function () {
						setTimeout(function(){
							isotope.isotope('layout')
						}, 200);
					});

				}

			}

			// on scroll loading items
			that.window.on('scroll', scroll);

			function scroll() {
				if (that.isInViewport($scope)) {
					that.window.off('scroll', scroll);
					showImages();
				}
			}

			scroll();

			function showImages() {
				if (jQuery('.loading:first', $scope).length) {
					jQuery('.loading:first', $scope).addClass('loaded').removeClass('loading');
					setTimeout(showImages, 200);
				}
			}

			that.show_lazy_images(isotope);

		},
		show_lazy_images: function (isotope,gt3_lazyload){
			if (!gt3_lazyload) gt3_lazyload = isotope.find('img.gt3_lazyload');
                var lazyImages;
				if (isotope[0] instanceof HTMLElement) {
					lazyImages = [].slice.call(gt3_lazyload);
				}else{
					lazyImages = [].slice.call(gt3_lazyload);
				}

				var active = false;

				var lazyLoad = function() {
					if (active === false) {
						active = true;

						setTimeout(function() {

							lazyImages.forEach(function(lazyImage) {

					    	var lazyImagesLength = lazyImages.length
					    	if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {

								if (lazyImage.dataset.src) {
									lazyImage.src = lazyImage.dataset.src;
								}
								if (lazyImage.dataset.srcset) {
									lazyImage.srcset = lazyImage.dataset.srcset;
								}
								if (lazyImage.dataset.sizes) {
									lazyImage.sizes = lazyImage.dataset.sizes;
								}

						        lazyImage.onload = function(){
						        	var delay = 800*(1/(lazyImagesLength - lazyImages.length));
						        	if (!lazyImages.length) {
						        		delay = 0;
						        	}
						        	setTimeout(function() {
						            	lazyImage.classList.remove("gt3_lazyload");
						        		lazyImage.classList.add("gt3_lazyload_loaded");
						        		jQuery( lazyImage ).parents('.isotope_item.lazy_loading').removeClass('lazy_loading').addClass('lazy_loaded')
						            },(delay))
						        }

						        lazyImages = lazyImages.filter(function(image) {
						         	return image !== lazyImage;
						        });

						        if (lazyImages.length === 0) {
						         	document.removeEventListener("scroll", lazyLoad);
						         	window.removeEventListener("resize", lazyLoad);
						         	window.removeEventListener("orientationchange", lazyLoad);
						        }
					      	}
					    });

					    active = false;
					  }, 200);
					}
				};
				lazyLoad();
				document.addEventListener("scroll", lazyLoad);
				window.addEventListener("resize", lazyLoad);
				window.addEventListener("orientationchange", lazyLoad);
		},
        Project: function ($scope) {
            var that = this;
            var wrapper = $scope.hasClass('project_wrapper') ? $scope : $('.project_wrapper', $scope);
            if (!wrapper.length) {
                console.warn('Project wrapper not found');
                return;
            }

            var settings = wrapper.data('settings');

            if (!'type' in settings) return;
            var query = {
                pagination_en: settings.pagination_en,
                query: settings.query,
                show_title: settings.show_title,
                show_category: settings.show_category,
                use_filter: settings.use_filter,
                random: settings.random,
                render_index: settings.render_index,
                settings: settings.settings
            };
            query.action = 'gt3_themes_core_project_load_items';
            query.query.paged = 0;

            var isotope = jQuery('.isotope_wrapper', $scope);

            var paged = 0;
            var packery = settings.packery,
                wrap_width_origin, index, width, height, wrap_width, wrap_height,
                wrap_ratio, img_ratio;

            if (settings.type === 'grid') {
                isotope.imagesLoaded(function () {
                    resize();
                    //showImages();
                });
            } else if (settings.type === 'packery') {
                resize();
                isotope.imagesLoaded(function () {
                    resize();
                    //showImages();
                });
            } else if (settings.type === 'masonry') {
                resize();
                isotope.imagesLoaded(function () {
                    isotope.isotope('layout');
                    //showImages();
                });
            }

            if (!that.editMode) {
                var block_ajax = false;
                $('.project_view_more_link', $scope).on('click', function (e) {
                    e.preventDefault();
                    if (block_ajax) return;
                    block_ajax = true;

                    query.query.paged++;
                    jQuery.ajax({
                        type: "POST",
                        data: query,
                        url: gt3_themes_core.ajaxurl,
                        success: function (data) {
                            if ('post_count' in data && data.post_count > 0) {
                                var add = $(data.respond);

                                isotope.append(add).isotope('appended', add);
                                setTimeout(function () {
                                    isotope.isotope({sortby: 'original-order'});
                                    resize();
                                }, 50);
                                setTimeout(function () {
                                    showImages();
                                }, 800);
                            }
                            if ('max_page' in data && (data.max_page <= query.query.paged || data.max_page === 0)) {
                                $('.project_view_more_link', $scope).remove();
                            }
                            if ('exclude' in data) {
                                query.query.exclude = data.exclude;
                            }
                            block_ajax = false;
                        },
                        error: function (e) {
                            console.error('Error request');
                            block_ajax = false;
                        }
                    });
                });

                if (!query.pagination_en) {
                    $scope.on("click", ".isotope-filter a", function (e) {
                        e.preventDefault();
                        var data_filter = this.getAttribute("data-filter");
                        jQuery(this).siblings().removeClass("active");
                        jQuery(this).addClass("active");
                        isotope.isotope({filter: data_filter});
						resize();
						//setTimeout(resize, 100);
                    });
                }
            }


            that.window.on('resize', function () {
                resize();
            });

            function resize() {
                switch (settings.type) {
                    case 'grid':
                        grid_resize();
                        break;
                    case 'packery' :
                        packery_resize();
                        break;
                    case 'masonry':
                        masonry_resize();
                        break;
                }
            }

            function get_max_height() {
                var max = 0;
                jQuery.each(isotope.children(), function (key, value) {
                    if (max <= jQuery(value).outerHeight()) max = jQuery(value).outerHeight();
                });
                return max;
            }

            function grid_resize() {
                if (settings.gap_unit === '%') {
                    var gap = (wrapper.width() * parseFloat(settings.gap_value) / 100).toFixed(2);
                    isotope
                        .find('.isotope_item')
                        .css('padding-right', gap + 'px')
                        .css('padding-bottom', gap + 'px');
                }

                var options = {
                    itemSelector: '.isotope_item',
                    layoutMode: 'masonry'
                };

                var wrap_height, wrap_width, wrap_ratio, img_ratio;
                if (settings.grid_type === 'rectangle' || settings.grid_type === 'square') {
                    wrapper.find('img').each(function (key, value) {
                        var img = $(this);
                        var parent = img.closest('.img_wrap');
                        if (that.window.outerWidth() < 600) {
                            parent
                                .css('height', 'auto')
                                .css('width', 'auto')
                                .attr('data-ratio', '');

                            img.attr('data-ratio', '')
                                .closest('.img').css('height', 'auto').css('width', 'auto')
                        } else {
                            wrap_height = wrap_width = Math.ceil(parent.outerWidth());
                            if (settings.grid_type === 'rectangle') {
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
                        layoutMode: 'fitRows',
                        itemSelector: '.isotope_item',
                        fitRows: {
                            // columnWidth: Math.floor(isotope.width() / query.cols),
                            rowHeight: get_max_height()
                        },
                        originLeft: !jQuery('body').hasClass('rtl')
                    })
                }
                if (isotope[0] instanceof HTMLElement) {
                	isotope.isotope(options).imagesLoaded(function () {
						setTimeout(function(){
							isotope.isotope('layout')
						}, 600);
					});
                }else{
                	var isotope_items = isotope.find('.isotope_item');
                	var isotope_items_html = '';
                	isotope_items.each(function(){
						isotope_items_html += jQuery(this)[0].outerHTML;
					})
					isotope_items_html = jQuery(isotope_items_html)
					isotope.empty();

					that.show_lazy_images(isotope,isotope_items_html.find('img.gt3_lazyload'));
					isotope.isotope(options);
					isotope.isotope('insert', isotope_items_html ).imagesLoaded(function () {
						setTimeout(function(){
							isotope.isotope('layout')
						}, 200);
					});
                }

            }

            function packery_resize() {
                if (query.gap_unit === '%') {
                    var gap = (wrapper.width() * parseFloat(settings.gap_value) / 100).toFixed(2);
                    isotope.find('.isotope_item').css('padding-right', gap + 'px').css('padding-bottom', gap + 'px');
                }


                var grid = packery.grid;
                var native_grid = grid;
                var lap = packery.lap;

                var viewport = function () {
                    var e = window, a = 'inner';
                    if (!('innerWidth' in window)) {
                        a = 'client';
                        e = document.documentElement || document.body;
                    }
                    return {width: e[a + 'Width'], height: e[a + 'Height']};
                }();

                if (viewport.width < 600) {
                    grid = 1;
                } else if (viewport.width < 992 && (grid % 2 === 0)) {
                    lap = lap / 2;
                    grid /= 2;
                }

                if (grid === 5) {
                    if (viewport.width < 600) {
                        grid = 1;
                    } else if (viewport.width < 992 && (grid === 5)) {
                        lap = lap / 2;
                        grid = 2;
                    }
                }

                wrap_width_origin = Math.floor(isotope.width() / grid);

                var local_key = 0;

                wrapper.find('.isotope_item').each(function (key, value) {
                    var img = $(this).find('img');
                    var parent = $(this);
                    var text_wrap = parent.find('.text_wrap');

                    if (viewport.width < 600) {
                        parent
                            .css('height', 'auto')
                            .css('width', 'auto')
                            .attr('data-ratio', '');

                        img.attr('data-ratio', '')
                            .closest('.img_wrap').css('height', 'auto').css('width', 'auto')
                    } else {
                        wrap_height = wrap_width = wrap_width_origin;

                        index = local_key % lap + 1;
                        if (index in packery.elem) {
                            if ('w' in packery.elem[index] && packery.elem[index].w > 1) {
                                wrap_width = wrap_width_origin * packery.elem[index].w;
                            }
                            if ('h' in packery.elem[index] && packery.elem[index].h > 1) {
                                if (viewport.width < 992 && (native_grid === 5)) {
                                    wrap_height = wrap_width_origin * 1;
                                } else {
                                    wrap_height = wrap_width_origin * packery.elem[index].h;
                                }

                            }
                        }

                        local_key++;


                        wrap_ratio = (wrap_width / wrap_height);
                        img_ratio = ((img.attr('width') || 1) / (img.attr('height') || 1));
                        var wrap_data_ratio = wrap_ratio >= 1 ? 'landscape' : 'portrait';
                        var img_data_ratio = img_ratio >= 1 ? 'landscape' : 'portrait';

                        if (wrap_data_ratio === 'portrait' && img_data_ratio === 'portrait' && wrap_ratio >= img_ratio) {
                            wrap_data_ratio = 'landscape';
                        } else if (wrap_data_ratio === 'landscape' && img_data_ratio === 'landscape' && img_ratio <= wrap_ratio) {
                            img_data_ratio = 'portrait';
                        }

                        parent
                            .css('height', Math.floor(wrap_height))
                            .css('width', Math.floor(wrap_width))
                            .attr('data-ratio-n', wrap_ratio)

                            .attr('data-ratio', wrap_data_ratio);

                        img.attr('data-ratio', img_data_ratio)
                            .attr('data-ratio-n', img_ratio)

                            .closest('.img_wrap').css('height', parent.height()).css('width', parent.width())

                        if (text_wrap.height() > 30) {
                            parent.addClass('animate_text_wrap');
                        } else {
                            parent.removeClass('animate_text_wrap');
                        }
                    }
                });

                isotope.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.isotope_item',
                    masonry: {
                        columnWidth: wrap_width_origin
                    },
                    originLeft: !jQuery('body').hasClass('rtl')
                }).isotope('layout');
            }

            function masonry_resize() {
                if (settings.gap_unit === '%') {
                    var gap = (wrapper.width() * parseFloat(settings.gap_value) / 100).toFixed(2);
                    isotope.find('.isotope_item').css('padding-right', gap + 'px').css('padding-bottom', gap + 'px');
                }

                isotope.isotope().isotope('layout');
            }

            // on scroll loading items
            that.window.on('scroll', scroll);

            function scroll() {
                if (that.isInViewport($scope)) {
                    that.window.off('scroll', scroll);
                    showImages();
                }
            }

            scroll();
            that.show_lazy_images(isotope);
            function showImages() {
                if (jQuery('.loading:first', $scope).length) {
                    jQuery('.loading:first', $scope).removeClass('loading');
                    setTimeout(showImages, 200);
                }
            }
            // on scroll loading items end

        },

        TeamCarousel: function ($scope) {
			if (!$scope.length) {
				return;
			}
			var settings = $scope.find('.module_team').data('settings');
			var variableWidth = jQuery('.items_list', $scope).parents('.elementor-section').hasClass('elementor-section-full_width') && jQuery('.items_list', $scope).parents('.elementor-section').hasClass('elementor-section-stretched') && settings.centerMode;

			var responsive = [];

			responsive.push({
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			});

			if (settings.items_per_line === 3) {
				responsive.push({
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				});
			}

			if (settings.show_text === true && settings.items_per_line === 4) {
				responsive.push({
					breakpoint: 1400,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1
					}
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				});
			}else if (settings.items_per_line === 4) {
				responsive.push({
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1
					}
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				});
			}


			jQuery('.item_list', $scope).slick({
				autoplay: settings.autoplay,
				autoplaySpeed: settings.autoplaySpeed,
				dots: settings.dots,
				arrows: settings.arrows,
				slidesToScroll: parseInt(settings.items_per_line),
				slidesToShow: parseInt(settings.items_per_line),
				centerMode: settings.centerMode,
				variableWidth: variableWidth,
				focusOnSelect: true,
				speed: 500,
				infinite: true,
				prevArrow: '<div class="slick-prev gt3_modified"><div class="slick_arrow_icon slick_arrow_icon__left"></div>' + (settings.l10n.prev ? '<div class="slick_arrow_text">'+settings.l10n.prev+'</div>' : '') + '</div>',
				nextArrow: '<div class="slick-next gt3_modified">' + (settings.l10n.next ? '<div class="slick_arrow_text">'+settings.l10n.next+'</div>' : '') + '<div class="slick_arrow_icon slick_arrow_icon__right"></div></div>',
				responsive: responsive
			});

        },

        TeamTabs: function ($scope) {
        	$scope = jQuery('.gt3_team_tabs', $scope);
			if (!$scope.length) {
				return;
			}
			var settings = $scope.parent('.module_team').data('settings');

		    var gt3_team_avatar_slider = jQuery('.gt3_team_avatar_slider', $scope);
		    if (!gt3_team_avatar_slider.length) {
		    	gt3_team_avatar_slider = false;
		    }

			jQuery('.item_list', $scope).slick({
				autoplay: settings.autoplay,
				autoplaySpeed: settings.autoplaySpeed,
				fade: true,
				dots: false,
				arrows: false,
				slidesToScroll: settings.items_per_line,
				slidesToShow: settings.items_per_line,
				focusOnSelect: true,
				speed: 500,
				infinite: true,
				draggable: false,
				asNavFor: gt3_team_avatar_slider,
				responsive: [
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}

				]
			});

			if (jQuery('.gt3_team_avatar_slider', $scope).length) {
				jQuery('.gt3_team_avatar_slider', $scope).slick({
					slidesToShow: 6,
					slidesToScroll: 6,
					asNavFor: jQuery('.item_list', $scope),
					dots: false,
					arrows: false,
					infinite: true,
					focusOnSelect: true,
					speed: 500,
					centerMode: $scope.hasClass('text_align-center'),
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 4,
								slidesToScroll: 4
							}
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3
							}
						}

					]
				})

			}
        },

		Team: function ($scope) {
			var that = this;
			if (jQuery(".isotope", $scope).length) {
				jQuery(".isotope", $scope).isotope({
					itemSelector: ".item-team-member, .gt3_practice_list__item, .gt3_course_item.isotope-item",
					originLeft: !jQuery('body').hasClass('rtl')
				}).imagesLoaded(function () {
					that.countFilterElements($scope);
					jQuery(".isotope", $scope).isotope('layout');
				})
			}
			jQuery(window).on('resize', function () {
				jQuery(".isotope", $scope).each(function () {
					jQuery(this).isotope({
						itemSelector: ".item-team-member, .gt3_practice_list__item, .gt3_course_item.isotope-item",
						originLeft: !jQuery('body').hasClass('rtl')
					})
				})
			});
			$scope.on("click", ".isotope-filter a,.isotope-row .gt3_course_filter a", function (e) {
				e.preventDefault();
				var data_filter = this.getAttribute("data-filter");
				jQuery(this).siblings().removeClass("active");
				jQuery(this).addClass("active");
				var grid = this.parentNode.nextElementSibling;
				jQuery(grid).isotope({filter: data_filter});
			});

			var gt3_count = 1;
            $scope.each(function () {
				var li = jQuery(this).find('.item-team-member');
				li.each(function () {
					jQuery(this).on('mouseover', function () {
						gt3_count++;
						jQuery(this).addClass('hovered').css({'z-index': gt3_count});
					});
					jQuery(this).on("mouseleave", function () {
						jQuery(this).removeClass('hovered')
					})
				});
			});

            var wrapper = $scope.find('.module_team');

			var settings = wrapper.data('settings');
            var query = {
            	type: settings.type,
				grid_gap: settings.grid_gap,
				pagination_en: settings.pagination_en,
				query: settings.query,
				link_post: settings.link_post,
				custom_item_height: settings.custom_item_height,
				posts_per_line: settings.posts_per_line,
				show_social: settings.show_social,
				show_position: settings.show_position,
				show_description: settings.show_description,
				show_title: settings.show_title
			};
			query.action = 'gt3_themes_core_team_load_items';

            var block_ajax = false;
			$('.team_view_more_link', $scope).on('click', function (e) {				
				if (!'type' in settings) return;		
				e.preventDefault();
				if (block_ajax) return;
				block_ajax = true;
				query.render_index =  wrapper.attr('data-post-index');
				query.query.paged++;

				jQuery.ajax({
					type: "POST",
					data: query,
					url: gt3_themes_core.ajaxurl,
					success: function (data) {
						if ('post_count' in data && data.post_count > 0) {
							var post_index = wrapper.attr('data-post-index');
							wrapper.attr('data-post-index',(Number(post_index)+data.post_count))
							var add = $(data.respond);

							jQuery(".item_list", $scope).append(add);

							if (jQuery(".isotope", $scope).length) {
								jQuery(".item_list", $scope).isotope('appended', add);
							}

							that.countFilterElements($scope);

							if (jQuery(".isotope", $scope).length) {
								setTimeout(function () {
									jQuery(".item_list", $scope).isotope({sortby: 'original-order'});
									jQuery(".isotope", $scope).isotope('layout');
								}, 300);
							}
							
						}
						if ('max_page' in data && (data.max_page <= query.query.paged || data.max_page === 0)) {
							$('.team_view_more_link', $scope).remove();
						}
						if ('exclude' in data) {
							query.query.exclude = data.exclude;
						}
						block_ajax = false;
					},
					error: function (e) {
						console.log(e)
						console.error('Error request');
						block_ajax = false;
					}
				});
			});

        },
		Blog: function ($scope) {
			$scope = $scope.hasClass('gt3_module_blog') ? $scope : $scope.find('.gt3_module_blog');
			if (!$scope.length) {
				return;
			}

            showImages();
            function showImages() {
                if (jQuery('.loading:first', $scope).length) {
                    jQuery('.loading:first', $scope).removeClass('loading');
                    setTimeout(showImages, 200);
                }
            }

            var wrapper = jQuery(".isotope_blog_items", $scope);
			if (!wrapper.length) {
				return;
			}

			var settings = JSON.parse($scope.attr('data-settings')),
				windowWidth = myWindow.outerWidth();


			function resize() {
				var packery = settings.packery_grid,
					wrap_width_origin, wrap_height, wrap_width, index;

				windowWidth = myWindow.outerWidth();

				var grid = packery.grid;
				var lap = packery.lap;

				if (windowWidth < 600) {
					grid = 1;
				} else if (windowWidth < 900 && (grid % 2 === 0)) {
					lap = lap / 2;
					grid /= 2;
				} else if (windowWidth < 900 && grid > 2) {
					grid = 2;
				}

				wrap_width_origin = Math.floor(wrapper.width() / grid);

				var local_key = 0;
				wrapper.find('.element').each(function (key, value) {
					var $this = $(this);
					if (windowWidth < 600) {

						$this
							.css('height', 'auto')
							.css('width', 'auto')
							.attr('data-ratio', '');

					} else {
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

						local_key++;


						$this
							.css('height', Math.floor(wrap_height))
							.css('width', Math.floor(wrap_width));

					}
				});
				wrapper.isotope({
					layoutMode: 'masonry',
					itemSelector: '.element',
					masonry: {
						columnWidth: wrap_width_origin
					},
					originLeft: !jQuery('body').hasClass('rtl')
				}).imagesLoaded(function () {
					wrapper.isotope('layout')
					setTimeout(function () {
						wrapper.isotope('layout')
					}, 3000);
				});
			}

			if (settings.packery) {
				resize();
			} else {
				wrapper.isotope({
					itemSelector: '.element',
					originLeft: !jQuery('body').hasClass('rtl')
				}).imagesLoaded(function () {
					wrapper.isotope('layout')
					setTimeout(function () {
						wrapper.isotope('layout')
					}, 3000);
				});
			}

			jQuery(window).on('resize',windowResize);
			function windowResize() {
				if (settings.packery) {
					resize();
				} else {
					$scope.off();
					wrapper.isotope('layout');
				}
			}

			wrapper.on("remove", function () {
				jQuery(window).off('resize',windowResize);
			})

			//var isotope = jQuery('.isotope_blog_items', $scope);

			$scope.on("click", ".isotope-filter a", function (e) {
				e.preventDefault();
				var data_filter = this.getAttribute("data-filter");
				jQuery(this).siblings().removeClass("active");
				jQuery(this).addClass("active");
				wrapper.isotope({filter: data_filter});
			});
			$scope.addClass('blog_packery_loaded');
			if (this.editMode) {
				jQuery(window).trigger('resize');
			}

		},

		BlogPackery: function ($scope) {
			var that = this;
			var wrapper = $scope;

			var settings = wrapper.find('.isotope_wrapper').data('settings');

			if (settings) {
				settings.render_index = wrapper.find('.isotope_wrapper').attr('data-post-index')
				var query = {'settings':settings};
				query.action = 'gt3_themes_core_blogpackery_load_items';
				query.settings.query.paged = 0;
			}			

			var isotope = jQuery('.isotope_wrapper', $scope);

			var paged = 0;
			var wrap_width_origin, index, width, height, wrap_width, wrap_height,
				wrap_ratio, img_ratio;

			isotope.imagesLoaded(function () {
				that.countFilterElements($scope);
				grid_resize();
			});

			if (!that.editMode && query) {
				var block_ajax = false;
				$('.blogpackery_view_more_link', $scope).on('click', function (e) {
					e.preventDefault();
					if (block_ajax) return;
					block_ajax = true;

					query.render_index =  wrapper.find('.isotope_wrapper').attr('data-post-index');

					query.settings.query.paged++;
					jQuery.ajax({
						type: "POST",
						data: query,
						url: gt3_themes_core.ajaxurl,
						success: function (data) {
							if ('post_count' in data && data.post_count > 0) {
								var post_index = wrapper.attr('data-post-index');
								wrapper.attr('data-post-index',(Number(post_index)+data.post_count))
								var add = $(data.respond);
								isotope.append(add).isotope('appended', add).isotope('layout');
								showImages();
								that.show_lazy_images(isotope,add.find('img.gt3_lazyload'));
								setTimeout(function () {
									isotope.isotope({sortby: 'original-order'});
									grid_resize();
								}, 300);

							}

							if ('max_page' in data && (data.max_page <= query.settings.query.paged || data.max_page === 0)) {
								$('.blogpackery_view_more_link', $scope).remove();
							}
							if ('exclude' in data) {
								query.settings.query.exclude = data.exclude;
							}
							block_ajax = false;
						},
						error: function (e) {
							console.error('Error request');
							block_ajax = false;
						}
					});
				});

				$scope.on("click", ".isotope-filter:not(.isotope-filter--links) a", function (e) {
					e.preventDefault();
					var data_filter = this.getAttribute("data-filter");
					jQuery(this).siblings().removeClass("active");
					jQuery(this).addClass("active");
					isotope.isotope({filter: data_filter});
					that.show_lazy_images(isotope);
				});
			}


			that.window.on('resize', function () {
				grid_resize();
			});

			function grid_resize() {
				var options = {
					itemSelector: '.isotope_item',
					layoutMode: 'masonry'
				};

				var layoutMode = 'masonry';
				var wrap_width_origin = '.isotope_item.packery_extra_size-default';
				wrap_width_origin = jQuery(isotope).find(wrap_width_origin).outerWidth();

				if (isotope[0] instanceof HTMLElement) {

					isotope.isotope({
						layoutMode: layoutMode,
						itemSelector: '.isotope_item',
						percentPosition: true,
						stagger: 30,
						transitionDuration: '0.4s',
						masonry: {
							columnWidth: wrap_width_origin/2 - 0.01,
							rowHeight: wrap_width_origin/2 - 0.01
						},
						originLeft: !jQuery('body').hasClass('rtl')
					}).isotope('layout');
				}else{
					var isotope_items = isotope.find('.isotope_item');
					var isotope_items_html = '';
					isotope_items.each(function(){
						isotope_items_html += jQuery(this)[0].outerHTML;
					})

					isotope_items_html = jQuery(isotope_items_html)
					isotope.empty();

					that.show_lazy_images(isotope,isotope_items_html.find('img.gt3_lazyload'));

					isotope.isotope({
						layoutMode: layoutMode,
						itemSelector: '.isotope_item',
						percentPosition: true,
						masonry: {
							columnWidth: wrap_width_origin
						},
						originLeft: !jQuery('body').hasClass('rtl')
					}).isotope('insert', isotope_items_html ).imagesLoaded(function () {
						setTimeout(function(){
							isotope.isotope('layout')
						}, 200);
					});

				}

			}

			// on scroll loading items
			that.window.on('scroll', scroll);

			function scroll() {
				if (that.isInViewport($scope)) {
					that.window.off('scroll', scroll);
					showImages();
				}
			}

			scroll();

			function showImages() {
				if (jQuery('.loading:first', $scope).length) {
					jQuery('.loading:first', $scope).addClass('loaded').removeClass('loading');
					setTimeout(showImages, 200);
				}
			}

			that.show_lazy_images(isotope);

			videoPopup_init();
			slick_gallery_init();

			function videoPopup_init(){				
				if (jQuery('.swipebox-video', $scope).length ) {
					jQuery('.swipebox-video', $scope).swipebox({
						useCSS: true, // false will force the use of jQuery for animations
						useSVG: true, // false to force the use of png for buttons
						initialIndexOnArray: 0, // which image index to init when a array is passed
						hideCloseButtonOnMobile: false, // true will hide the close button on mobile devices
						removeBarsOnMobile: true, // false will show top bar on mobile devices
						hideBarsDelay: 3000, // delay before hiding bars on desktop
						videoMaxWidth: 1140,
						autoplayVideos: true,
						beforeOpen: function () {
						}, // called before opening
						afterOpen: null, // called after opening
						afterClose: function () {
						}, // called after closing
						loopAtEnd: false // true will return to the first image after the last image is reached
					});
				}
			}

			function slick_gallery_init(){

				if (jQuery('.slick_wrapper', $scope).length ) {

					var slick_wrapper = jQuery('.slick_wrapper', $scope);
					if (slick_wrapper.hasClass('slick-initialized')) {
						slick_wrapper.slick('unslick');
					}

					slick_wrapper.slick({
						autoplay: true,
						arrows: true,
						dots: true,
						slidesToScroll: 1,
						slidesToShow: 1,
						focusOnSelect: true,
						speed: 500,
						fade: true,
						cssEase: 'linear',
						dotsClass: 'gt3_custom_slick_paging',
						customPaging: function (slider, i) {
							return  (i + 1) + '<span>/</span>' + slider.slideCount;
						}
					});

				}

			}

		},

		GalleryPackery: function ($scope) {
			var that = this;
			var wrapper = $scope.hasClass('packery_wrapper') ? $scope : jQuery('.packery_wrapper', $scope);
			if (!wrapper.length) {
				console.warn('Packery wrapper not found');
				return;
			}

			var isotope = jQuery('.isotope_wrapper', $scope);

			var query = wrapper.data('settings');
			query.action = 'gt3_core_packery_load_images';


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
					var img = $(this);
					var parent = img.closest('.isotope_item');
					if ($(window).outerWidth() < 600) {
						parent
							.css('height', 'auto')
							.css('width', 'auto')
							.attr('data-ratio', '');

						img.attr('data-ratio', '')
							.closest('.img').css('height', 'auto').css('width', 'auto')
					} else {
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

						local_key++;

						wrap_ratio = (wrap_width / wrap_height);
						img_ratio = ((img.attr('width') || 1) / (img.attr('height') || 1));
						if (wrap_ratio > img_ratio) img_ratio = 0.5;

						var wrap_data_ratio = wrap_ratio >= 1 ? 'landscape' : 'portrait';
						var img_data_ratio = img_ratio >= 1 ? 'landscape' : 'portrait';

						if (wrap_data_ratio === 'portrait' && img_data_ratio === 'portrait' && wrap_ratio >= img_ratio) {
							wrap_data_ratio = 'landscape';
						} else if (wrap_data_ratio === 'landscape' && img_data_ratio === 'landscape' && img_ratio <= wrap_ratio) {
							img_data_ratio = 'portrait';
						}

						parent
							.css('height', Math.floor(wrap_height))
							.css('width', Math.floor(wrap_width))
							.attr('data-ratio-n', wrap_ratio)

							.attr('data-ratio', wrap_data_ratio);

						img.attr('data-ratio', img_data_ratio)
							.attr('data-ratio-n', img_ratio)

							.closest('.img_wrap').css('height', parent.height()).css('width', parent.width())

					}
				});

				isotope.isotope({
					layoutMode: 'masonry',
					itemSelector: '.isotope_item',
					masonry: {
						columnWidth: wrap_width_origin
					},
					originLeft: !jQuery('body').hasClass('rtl')
				}).isotope('layout');
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
						url: gt3_themes_core.ajaxurl,
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
			});

			if (paged >= max_page) {
				jQuery('.view_more_link', $scope).remove();
			}
		},
		Button: function ($scope) {
			var is_alignment_inline = jQuery($scope).find('.alignment_inline').length;
			if (is_alignment_inline) {
				jQuery($scope).addClass('gt3-core-button--alignment_inline')
			}else{
				jQuery($scope).removeClass('gt3-core-button--alignment_inline')
			}

		},
		VideoPopup: function ($scope) {
			var swipebox = jQuery('.swipebox-video', $scope);
			var settings = swipebox.data('settings');
			swipebox.swipebox({
				useCSS: true, // false will force the use of jQuery for animations
				useSVG: true, // false to force the use of png for buttons
				initialIndexOnArray: 0, // which image index to init when a array is passed
				hideCloseButtonOnMobile: false, // true will hide the close button on mobile devices
				removeBarsOnMobile: true, // false will show top bar on mobile devices
				hideBarsDelay: 3000, // delay before hiding bars on desktop
				videoMaxWidth: 1140,
				autoplayVideos: settings.autoplay,
				beforeOpen: function () {
				}, // called before opening
				afterOpen: null, // called after opening
				afterClose: function () {
				}, // called after closing
				loopAtEnd: false // true will return to the first image after the last image is reached
			});
		},
		ImageCarousel: function ($scope) {
			var that = this;
			var wrapper = $scope.hasClass('gt3_carousel_list') ? $scope : jQuery('.gt3_carousel_list', $scope);
			if (!wrapper.length) {
				return;
			}
			wrapper.slick();
		},
		PriceBox: function ($scope) {
			var windowW = window.innerWidth ? window.innerWidth : jQuery(window).width();
			if (windowW >= 1200) {
				if (!$scope.hasClass('hover_effect-yes')) return;
				var item_body = $scope.find('.gt3_price_item_body-elementor');
				$scope.mouseenter(function () {
					item_body.animate({
						height: "show",
						opacity: "show"
					}, 500);
				}).mouseleave(function () {
					item_body.animate({
						height: "hide",
						opacity: "hide"
					}, 500);
				});
			}
		},
		Countdown: function ($scope){
			if (jQuery('.gt3_countdown').length) {
				jQuery('.gt3_countdown').each(function () {
					var year = jQuery(this).attr('data-year');
					var month = jQuery(this).attr('data-month');
					var day = jQuery(this).attr('data-day');
					var hours = jQuery(this).attr('data-hours');
					var min = jQuery(this).attr('data-min');
					var format = jQuery(this).attr('data-format');

					var austDay = new Date();
					austDay = new Date(+year, +month-1, +day, +hours, +min);
					jQuery(this).countdown({
						until: austDay,
						format: format,
						padZeroes: true,
						alwaysExpire: false,
						labels: [jQuery(this).attr('data-label_years'),jQuery(this).attr('data-label_months'),jQuery(this).attr('data-label_weeks'),jQuery(this).attr('data-label_days'),jQuery(this).attr('data-label_hours'),jQuery(this).attr('data-label_minutes'),jQuery(this).attr('data-label_seconds')],
						labels1:[jQuery(this).attr('data-label_year'),jQuery(this).attr('data-label_month'),jQuery(this).attr('data-label_week'),jQuery(this).attr('data-label_day'),jQuery(this).attr('data-label_hour'),jQuery(this).attr('data-label_minute'),jQuery(this).attr('data-label_second')]
					});
				});
			}
		},
		Imageprocessbar: function ($scope){
			if (jQuery('.elementor-widget-gt3-core-imageprocessbar').length) {
				jQuery('.elementor-widget-gt3-core-imageprocessbar').each(function () {

					var color = jQuery(this).find('.gt3_process_item__circle_line_before').css('color');

					jQuery(this).find('.gt3_process_item__circle_line_before').css({
						'background-image': 'radial-gradient('+replace_rgb_to_rgba(color,0.5)+' 15%, transparent 30%), radial-gradient('+replace_rgb_to_rgba(color,0.8)+' 15%, transparent 30%),     radial-gradient('+color+' 15%, transparent 30%),     radial-gradient('+replace_rgb_to_rgba(color,0.8)+' 15%, transparent 30%),     radial-gradient('+replace_rgb_to_rgba(color,0.5)+' 15%, transparent 30%),  radial-gradient('+replace_rgb_to_rgba(color,0.5)+' 15%, transparent 30%)'
					})

					jQuery(this).find('.gt3_process_item__circle_line_after').css({
						'background-image': 'radial-gradient('+replace_rgb_to_rgba(color,0.5)+' 15%, transparent 30%), radial-gradient('+replace_rgb_to_rgba(color,0.8)+' 15%, transparent 30%),     radial-gradient('+color+' 15%, transparent 30%),     radial-gradient('+replace_rgb_to_rgba(color,0.8)+' 15%, transparent 30%),     radial-gradient('+replace_rgb_to_rgba(color,0.5)+' 15%, transparent 30%),  radial-gradient('+replace_rgb_to_rgba(color,0.5)+' 15%, transparent 30%)'
					})

					jQuery(this).find('.gt3_process_item').on('mouseenter',function(){
						jQuery(this).addClass('active').siblings().removeClass('active');
						jQuery(this).prev().addClass('prev_active').siblings().removeClass('prev_active');
						jQuery(this).next().addClass('next_active').siblings().removeClass('next_active');
					}).on('mouseleave',function(){
						jQuery(this).removeClass('active');
						jQuery(this).siblings().removeClass('prev_active');
						jQuery(this).siblings().removeClass('next_active');
					})
				});
			}

			function replace_rgb_to_rgba(color,alfa){
				if(color.indexOf('a') == -1){
				    var result = color.replace(')', ', '+alfa+')').replace('rgb', 'rgba');
				    return result;
				}
			}
		},
		TeamSearch: function ($scope){

			var ajax_data = {};

			jQuery('.gt3_team_search select').each(function(){
				var element = jQuery(this);
				var form = jQuery(element).parents('form.gt3_team_search');

				var search_inputs = new Object();
				form.find('.search_box [name]').each(function(){
					var name = jQuery(this).attr('name');
					search_inputs[name] = form[0].hasAttribute('data_search_'+name) ? form.attr('data_search_'+name) : '';
				})

				ajax_data.name = element.attr('name')
				ajax_data.search_inputs = search_inputs

				element.select2({
					placeholder: element.attr('placeholder'),
					allowClear: true,
					minimumResultsForSearch: 10,
					ajax: {
						url: gt3_themes_core.ajaxurl + "?action=gt3_core_get_team_search_data",
						dataType: "json",
						delay: 250,
                    	cache: !0,
                    	data: function(params) {
						    ajax_data.q = params.term
						    return ajax_data;

	                    },
	                    processResults: function(data, params) {
	                    	return {
	                    		results: data.select_options[ajax_data.name] || [],
							};
	                    }
					}
				});
				element.on('select2:select', function (e) {
					var element = jQuery(e.currentTarget);
					var name = element.attr('name');
					var data = e.params.data.id;
					form.attr('data_search_'+name,data)
				});

				element.on('select2:unselect', function (e) {
					var element = jQuery(e.currentTarget);
					var name = element.attr('name');
					if (form[0].hasAttribute('data_search_'+name)) {
						form.attr('data_search_'+name,'')
					}
					if (element.find('.empty_option').length == 0) {
						element.prepend('<option value="" selected="selected"></option>');
					}else{
						element.find('.empty_option').attr('selected','selected')
					}

				});

				element.on('select2:opening', function (e) {
					var element = jQuery(e.currentTarget);
					var form = jQuery(e.currentTarget).parents('form.gt3_team_search');
					element.addClass('opened')
					var search_inputs = new Object();
					form.find('.search_box [name]').each(function(){
						var name = jQuery(this).attr('name');
						search_inputs[name] = form[0].hasAttribute('data_search_'+name) ? form.attr('data_search_'+name) : '';
					});
					ajax_data.name = element.attr('name')
					ajax_data.search_inputs = search_inputs
					ajax_data.query = form.attr('data-query');
				});



			})
		},
		BlogSimple: function ($scope){
			//return;
			if (!$scope.find('.gt3_carousel-elementor').length) {
				return;
			}

			var element = $scope.find('.gt3_carousel-elementor');
			var json = element.attr('data-settings');
			var settings = JSON.parse(json);

			settings.items_per_line = 1;

			var responsive = [];


			element.slick({
				autoplay: settings.autoplay,
				autoplaySpeed: settings.autoplaySpeed,
				dots: settings.dots,
				arrows: settings.arrows,
				slidesToScroll: parseInt(settings.items_per_line),
				slidesToShow: parseInt(settings.items_per_line),
				focusOnSelect: true,
				speed: 500,
				infinite: true,
				prevArrow: '<div class="slick-prev gt3_modified"><div class="slick_arrow_icon slick_arrow_icon__left"></div>' + (settings.l10n.prev ? '<div class="slick_arrow_text">'+settings.l10n.prev+'</div>' : '') + '</div>',
				nextArrow: '<div class="slick-next gt3_modified">' + (settings.l10n.next ? '<div class="slick_arrow_text">'+settings.l10n.next+'</div>' : '') + '<div class="slick_arrow_icon slick_arrow_icon__right"></div></div>',
			});
		},
		Blockquote: function($scope){

			var quote_icon_holder = $scope.find('.gt3_blockquote__quote_icon')
			var quote_color = $scope.find('.gt3_blockquote__quote_icon').css('color');
			var canvas = document.createElement('canvas');
			var quote_src = $scope.find('.gt3_blockquote').attr('data-quote-src');
			canvas.classList.add("gt3_blockquote__canvas_quote");
			quote_icon_holder.prepend(canvas);

			var quote_custom_color = $scope.find('.gt3_blockquote__quote_icon').css('color');
			if (typeof quote_custom_color !== 'undefined') {
				quote_color = quote_custom_color;
			}

			var img = new Image;
			img.onload = function () {
				canvas.width = this.width;
				canvas.height = this.height;
				// draw image
				ctx.drawImage(this, 0, 0);
				// set composite mode
				ctx.globalCompositeOperation = "source-in";
				// draw color
				ctx.fillStyle = quote_color;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				var image = canvas.toDataURL("image/png");
				quote_icon_holder.prepend('<div class="testimonials-text-quote-holder" style="background-image:url('+image+');-webkit-mask-image:url('+image+');"></div>');
			};

			if (quote_src.length) {
				img.src = quote_src;
			}else{
				img.src = gt3_gt3theme.templateUrl+"/img/quote.png";
			}
			var ctx = canvas.getContext("2d")
		},
		Toggle: function($scope){
			console.log($scope)

		},
		TypedText: function ($scope) {
			var that = this;
			var $wrapper = $('.gt3_typed_widget', $scope);
			if (!$wrapper.length) return;

			var options = $wrapper.data('options');
			that.window.on('scroll', scroll);

			function scroll() {
				if (that.isInViewport($wrapper)) {
					that.window.off('scroll', scroll);
					new Typed(options.id, options)
				}
			}

			scroll();
		},
	});

	return CoreFrontend;
});

jQuery(window).on('elementor/frontend/init', function () {
	if ('function' === typeof window.gt3Elementor.CoreFrontend) {
		window.gt3Elementor.CoreFrontend = window.gt3Elementor.CoreFrontend();
	}
});


