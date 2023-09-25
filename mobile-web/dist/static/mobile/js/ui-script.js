// ui-script.js

(function ($) {
  var userAgent = navigator.userAgent;
  var userAgentCheck = {
    ieMode: document.documentMode,
    isIos: Boolean(userAgent.match(/iPod|iPhone|iPad/)),
    isAndroid: Boolean(userAgent.match(/Android/)),
  };
  if (userAgent.match(/Edge|Edg/gi)) {
    userAgentCheck.ieMode = 'edge';
  }
  userAgentCheck.androidVersion = (function () {
    if (userAgentCheck.isAndroid) {
      try {
        var match = userAgent.match(/Android (\d+(?:\.\d+){0,2})/);
        return match[1];
      } catch (e) {
        console.log(e);
      }
    }
  })();
  window.userAgentCheck = userAgentCheck;

  // min 포함 max 불포함 랜덤 정수
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 랜덤 문자열
  var hashCodes = [];
  function uiGetHashCode(length) {
    var string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    var stringLength = string.length;

    length = typeof length === 'number' && length > 0 ? length : 10;

    function getCode(length) {
      var code = '';
      for (var i = 0; i < length; i++) {
        code += string[getRandomInt(0, stringLength)];
      }
      if (hashCodes.indexOf(code) > -1) {
        code = getCode(length);
      }
      return code;
    }

    result = getCode(length);
    hashCodes.push(result);

    return result;
  }

  // common
  var $win = $(window);
  var $doc = $(document);

  // swiperSet
  // https://github.com/nolimits4web/swiper/blob/Swiper5/API.md
  // init ex: $(element).swiperSet({/* customOptions */});
  // method ex: $(element).data('swiper').update();
  $.fn.swiperSet = function (customOption) {
    var defaultOption = {
      wrapTagName: 'div',
      containerTagName: 'div',
      customClass: null,
      appendController: null,
      pageControl: false,
      nextControl: false,
      prevControl: false,
      playControl: false,
      pauseControl: false,
      togglePlayControl: false,
      scrollbarControl: false,
      observer: true,
      observeParents: true,
      a11yHidden: false,
      a11y: {
        firstSlideMessage: '첫번째 슬라이드',
        lastSlideMessage: '마지막 슬라이드',
        nextSlideMessage: '다음 슬라이드',
        prevSlideMessage: '이전 슬라이드',
        paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
      },
      on: {},
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);

      if (!(typeof customOption.a11y === 'object')) {
        customOption.a11y = {};
      }

      $.extend(option.a11y, defaultOption.a11y, customOption.a11y);

      var $this = $(this);
      var isA11y = !(typeof option.a11y.enabled === 'boolean' && !option.a11y.enabled);

      if ($this.data('swiper') || !$.isFunction(window.Swiper)) return;

      var $items = $this.children();
      var length = $items.length;

      if (!$this.parent('.swiper').length) {
        $this.wrap('<' + option.wrapTagName + ' class="swiper-object"><' + option.containerTagName + ' class="swiper"></' + option.containerTagName + '></' + option.wrapTagName + '>');
      }
      $this.addClass('swiper-wrapper');

      $items.addClass('swiper-slide').each(function (i) {
        var $this = $(this);

        $this.attr('data-swiper-set-slide-index', i);

        if (isA11y && userAgentCheck.isAndroid) {
          $this.attr('title', i + 1 + '/' + length);
        }
      });

      var $container = $this.parent('.swiper');
      var $wrap = $container.parent('.swiper-object');
      var $appendController = $wrap;
      var length = $items.length;

      if (typeof option.customClass === 'string') {
        $wrap.addClass(option.customClass);
      }

      option.pagination = option.pagination || {};
      option.navigation = option.navigation || {};
      option.scrollbar = option.scrollbar || {};

      option.autoplay = length > 1 && option.autoplay ? option.autoplay : false;
      option.loop = length > 1 && option.loop ? option.loop : false;

      if (option.appendController) {
        $appendController = $(option.appendController);
      }

      if (length === 1) {
        $wrap.addClass('swiper-object-once');
      } else if (length <= 0) {
        $wrap.addClass('swiper-object-empty');
      }

      if (option.prevControl) {
        $appendController.append('<button type="button" class="swiper-button-prev"><span class="swiper-button-prev-text">이전 슬라이드</span></button>');
        option.navigation.prevEl = $appendController.find('.swiper-button-prev').get(0);
      }
      if (option.nextControl) {
        $appendController.append('<button type="button" class="swiper-button-next"><span class="swiper-button-next-text">다음 슬라이드</span></button>');
        option.navigation.nextEl = $appendController.find('.swiper-button-next').get(0);
      }
      if (option.scrollbarControl) {
        $appendController.append('<span class="swiper-scrollbar"></span>');
        option.scrollbar.el = $appendController.find('.swiper-scrollbar').get(0);
      }
      if (option.playControl) {
        $appendController.append('<button type="button" class="swiper-button-play"><span class="swiper-button-play-text">자동 슬라이드 재생</span></button>');
        option.playButton = $appendController.find('.swiper-button-play').get(0);
      }
      if (option.pauseControl) {
        $appendController.append('<button type="button" class="swiper-button-pause"><span class="swiper-button-pause-text">자동 슬라이드 정지</span></button>');
        option.pauseButton = $appendController.find('.swiper-button-pause').get(0);
      }
      if (option.togglePlayControl) {
        $appendController.append('<button type="button" class="swiper-button-toggle-play"><span class="swiper-button-toggle-play-text">자동 슬라이드 재생</span></button>');
        option.togglePlayButton = $appendController.find('.swiper-button-toggle-play').get(0);
      }
      if (option.pageControl) {
        $appendController.append('<span class="swiper-pagination"></span>');
        option.pagination.el = $appendController.find('.swiper-pagination').get(0);
      }
      if (option.autoplay && option.playControl) {
        $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
      } else if (!option.autoplay && option.pauseControl) {
        $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
      }
      if (option.autoplay && option.togglePlayControl) {
        $(option.togglePlayButton).addClass('is-pause').removeClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 정지');
      } else if (!option.autoplay && option.togglePlayControl) {
        $(option.togglePlayButton).removeClass('is-pause').addClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 재생');
      }

      var on = $.extend({}, option.on);
      var isInit = false;

      function callEvent(name, swiper, args1, args2, args3) {
        if (typeof on[name] === 'function') {
          on[name](swiper, args1, args2, args3);
        }
      }

      var bulletClick = false;

      if (option.a11yHidden && option.pagination.clickable) {
        $(option.pagination.el).on('click.swiperSet', '.swiper-pagination-bullet', function () {
          bulletClick = true;
        });
      }

      function setA11yHidden(swiper) {
        var $slides = $(swiper.slides);
        var $activeItem = $slides.eq(swiper.activeIndex);

        if (option.a11yHidden) {
          $activeItem.removeAttr('aria-hidden');
          $slides.not($activeItem).attr('aria-hidden', 'true');
        }
      }

      function init(swiper) {
        var $slides = $(swiper.slides);

        if (!isInit && $slides.length) {
          isInit = true;

          if (isA11y && userAgentCheck.isAndroid) {
            $slides.removeAttr('aria-label role');
          }

          if (option.a11yHidden) {
            $slides.attr('tabindex', '0');
          }

          setA11yHidden(swiper);
        }
      }

      option.on.init = function (swiper) {
        var $slides = $(swiper.slides);

        if (isA11y && userAgentCheck.isAndroid && $slides.length) {
          $slides.removeAttr('aria-label role');
        }

        init(swiper);
        callEvent('init', swiper);
      };

      option.on.observerUpdate = function (swiper) {
        init(swiper);
        callEvent('observerUpdate', swiper);
      };

      option.on.slideChange = function (swiper) {
        setA11yHidden(swiper);

        $container.scrollTop(0).scrollLeft(0);

        callEvent('slideChange', swiper);
      };

      option.on.slideChangeTransitionEnd = function (swiper) {
        var $slides = $(swiper.slides);
        var $activeItem = $slides.eq(swiper.activeIndex);

        if (option.a11yHidden && bulletClick) {
          $activeItem.focus();
        }

        bulletClick = false;

        callEvent('slideChangeTransitionEnd', swiper);
      };

      option.on.autoplayStart = function (swiper) {
        if (option.playControl) {
          $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
        }
        if (option.pauseControl) {
          $(option.pauseButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).addClass('is-pause').removeClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 정지');
        }

        if (isA11y) {
          $this.attr('aria-live', 'off');
        }

        callEvent('autoplayStart', swiper);
      };

      option.on.autoplayStop = function (swiper) {
        if (option.playControl) {
          $(option.playButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
        }
        if (option.pauseControl) {
          $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).removeClass('is-pause').addClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 재생');
        }

        if (isA11y) {
          $this.attr('aria-live', 'polite');
        }

        callEvent('autoplayStop', swiper);
      };

      option.on.resize = function (swiper) {
        $this.trigger('swiperResize');
        callEvent('resize', swiper);
      };

      if ($.isFunction(window.Swiper)) {
        var swiper = new Swiper($container.get(0), option);
        $this.data('swiper', swiper);

        if (option.playControl) {
          $(option.playButton).on('click.swiperSet', function () {
            swiper.autoplay.start();
          });
        }
        if (option.pauseControl) {
          $(option.pauseButton).on('click.swiperSet', function () {
            swiper.autoplay.stop();
          });
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).on('click.swiperSet', function () {
            var $this = $(this);

            if ($this.hasClass('is-play')) {
              swiper.autoplay.start();
            } else if ($this.hasClass('is-pause')) {
              swiper.autoplay.stop();
            }
          });
        }

        var $slides = $(swiper.slides);

        if (isA11y && userAgentCheck.isAndroid) {
          $slides.removeAttr('aria-label role');
        }
      }
    });
  };

  // UiDropDown
  var UiDropDown = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-dropdown-opened',
      top: 'js-dropdown-top',
      bottom: 'js-dropdown-bottom',
    };
    _.css = {
      hide: {
        position: 'absolute',
        top: '',
        left: '',
        bottom: '',
        marginLeft: '',
        display: 'none',
      },
      show: {
        position: 'absolute',
        top: '100%',
        left: '0',
        display: 'block',
      },
    };
    _.options = option;
    _.wrap = $wrap;
    _.closeTimer = null;
    _.init();
    _.on();
  };
  $.extend(UiDropDown.prototype, {
    init: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener).eq(0);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer).eq(0);
        } else {
          _.layer = _.options.layer;
        }
        _.layer.css(_.css.hide);
      }

      if (_.layer.length) {
        _.hashCode = uiGetHashCode();
        _.wrap.css('position', 'relative');
      }

      _.options.init();
    },
    on: function () {
      var _ = this;

      if (_.layer.length) {
        _.off();

        if (_.opener && _.opener.length && _.options.event === 'click') {
          _.opener.on('click.uiDropDown' + _.hashCode, function () {
            _.toggle();
          });
          $doc.on('click.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

            if (!check) {
              _.close();
            }
          });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.layer) || $(e.target).closest(_.layer).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        } else if (_.options.event === 'hover') {
          _.wrap
            .on('mouseenter.uiDropDown' + _.hashCode, function () {
              _.open();
            })
            .on('mouseleave.uiDropDown' + _.hashCode, function () {
              _.close();
            });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        }
        $win.on('resize.uiDropDown' + _.hashCode, function () {
          _.update();
        });
      }
    },
    off: function () {
      var _ = this;

      if (_.options.event === 'click') {
        _.opener.off('click.uiDropDown' + _.hashCode);
        $doc.off('click.uiDropDown' + _.hashCode);
        $doc.off('focusin.uiDropDown' + _.hashCode);
      } else if (_.options.event === 'hover') {
        _.wrap.off('mouseenter.uiDropDown' + _.hashCode).off('mouseleave.uiDropDown' + _.hashCode);
        $doc.off('focusin.uiDropDown' + _.hashCode);
      }
      $win.off('resize.uiDropDown' + _.hashCode);
    },
    update: function () {
      var _ = this;
      var docW = 0;
      var winH = 0;
      var wrapT = 0;
      var wrapH = 0;
      var scrollTop = 0;
      var layerT = 0;
      var layerL = 0;
      var layerH = 0;
      var layerW = 0;
      var $overflow = null;
      var overflowH = 0;
      var overflowT = 0;
      var overflowL = 0;
      var overflowR = 0;
      var style = {
        marginTop: _.options.marginTop,
        marginLeft: _.options.marginLeft,
      };
      var isTopAlign = _.options.defaultVertical === 'top';
      var isOverflow = false;
      var isTopOverflow = false;
      var isBottomOverflow = false;

      if (_.wrap.hasClass(_.className.opened)) {
        _.layer.css({
          top: '',
          left: '-999999px',
          right: '',
          bottom: '',
          marginLeft: '',
          marginRight: '',
        });
        _.wrap.removeClass(_.className.top + ' ' + _.className.bottom);

        docW = $doc.width();
        docH = $doc.height();
        winW = $win.width();
        winH = $win.height();
        scrollLeft = $win.scrollLeft();
        scrollTop = $win.scrollTop();

        _.layer.css(_.css.show);

        if (_.options.align === 'right') {
          style.marginLeft = 0;
          style.marginRight = _.options.marginRight;
          _.layer.css({
            left: 'auto',
            right: '0',
          });
        } else if (_.options.align === 'center') {
          _.layer.css({
            left: '50%',
          });
        }

        function setTopPosition() {
          _.wrap.addClass(_.className.top);
          _.layer.css({
            top: 'auto',
            bottom: '100%',
          });
          style.marginTop = 0;
          style.marginBottom = _.options.marginBottom;
        }
        function setBottomPosition() {
          _.wrap.removeClass(_.className.top).addClass(_.className.bottom);
          _.layer.css({
            top: '',
            bottom: '',
          });
          style.marginTop = _.options.marginTop;
          style.marginBottom = 0;
        }

        if (isTopAlign) {
          setTopPosition();
        }

        wrapT = _.wrap.offset().top;
        wrapH = _.wrap.outerHeight();
        layerT = _.layer.offset().top;
        layerL = _.layer.offset().left;
        trueLayerW = _.layer.outerWidth();
        layerH = _.layer.outerHeight() + _.options.marginTop + _.options.marginBottom;
        layerW = trueLayerW + _.options.marginLeft + _.options.marginRight;

        if (_.options.align === 'center') {
          layerL -= Math.ceil(trueLayerW / 2);
          style.marginLeft = -Math.ceil(trueLayerW / 2);
        }

        _.wrap.parents().each(function () {
          var $this = $(this);
          if ($this.css('overflow').match(/hidden|auto|scroll/) && !$this.is('html')) {
            $overflow = $this;
            return false;
          }
        });

        isOverflow = $overflow !== null && $overflow.length;

        if (isOverflow) {
          overflowH = $overflow.height();
          overflowT = $overflow.offset().top;
          overflowL = $overflow.offset().left;
          overflowR = docW - (overflowL + $overflow.width());
        }

        isTopOverflow = wrapT - layerH < (isOverflow ? overflowT : scrollTop);
        isBottomOverflow = isOverflow ? (isTopAlign ? wrapT + wrapH : layerT) + layerH > overflowT + overflowH : (isTopAlign ? wrapT + wrapH : layerT) + layerH - scrollTop > winH;

        if (isTopAlign) {
          if (isTopOverflow && !isBottomOverflow) {
            setBottomPosition();
          } else {
            _.wrap.addClass(_.className.top);
          }
        } else {
          if (isBottomOverflow && !isTopOverflow) {
            setTopPosition();
          } else {
            _.wrap.addClass(_.className.bottom);
          }
        }

        if (docW - overflowR < layerL + layerW && docW - overflowL - overflowR - layerW > 0) {
          if (_.options.align === 'right') {
            style.marginRight = Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft -= Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else {
            style.marginLeft = -Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          }
        } else if (overflowL > layerL || (_.options.align === 'center' && overflowL < layerL && layerL - overflowL < _.options.marginLeft)) {
          if (_.options.align === 'right') {
            style.marginRight = -Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft += Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else {
            style.marginLeft = Math.ceil(overflowL - layerL + _.options.marginLeft);
          }
        }

        _.layer.css(style);
      }
    },
    toggle: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.close();
      } else {
        _.open();
      }
    },
    open: function () {
      var _ = this;

      if (!_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);
        _.wrap.addClass(_.className.opened).css('z-index', '1200');
        _.layer.css(_.css.show);
        _.update();
        _.layer.trigger('uiDropDownOpened');
      }
    },
    close: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);
        _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
        _.layer.css(_.css.hide).trigger('uiDropDownClosed');
      }
    },
    btnClose: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);

        if (userAgentCheck.isAndroid) {
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide);

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.opener.focus();
            _.layer.trigger('uiDropDownClosed');
          }, 10);
        } else if (userAgentCheck.isIos) {
          _.opener.focus();

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
            _.layer.css(_.css.hide).trigger('uiDropDownClosed');
          }, 100);
        } else {
          _.opener.focus();
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide).trigger('uiDropDownClosed');
        }
      }
    },
  });
  $.fn.uiDropDown = function (custom) {
    var defaultOption = {
      opener: null,
      layer: null,
      event: 'click',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      align: 'left',
      defaultVertical: 'bottom',
      init: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiDropDown = this.uiDropDown;

      if (typeof custom === 'object' && !uiDropDown) {
        options = $.extend({}, defaultOption, custom);
        this.uiDropDown = new UiDropDown(this, options);
      } else if (typeof custom === 'string' && uiDropDown) {
        switch (custom) {
          case 'btnClose':
            uiDropDown.btnClose();
            break;
          case 'close':
            uiDropDown.close();
            break;
          case 'open':
            uiDropDown.open();
            break;
          case 'update':
            uiDropDown.update();
            break;
          case 'on':
            uiDropDown.on();
            break;
          case 'off':
            uiDropDown.off();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiAccordion
  var UiAccordion = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-accordion-opened',
      active: 'js-accordion-active',
      animated: 'js-accordion-animated',
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiAccordion.prototype, {
    init: function () {
      var _ = this;

      _.hashCode = uiGetHashCode();
      _.getElements();

      if (_.layer.length && _.item.length && _.item.filter('[data-initial-open]').length) {
        _.item.each(function () {
          var $this = $(this);
          if ($this.attr('data-initial-open') === 'true') {
            _.open($this, 0);
          }
        });
      }

      _.options.onInit();
    },
    getElements: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer);
        } else {
          _.layer = _.options.layer;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }
    },
    on: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.on('click.uiAccordion' + _.hashCode, function () {
          _.toggle($(this).closest(_.item));
        });

        $doc
          .on('keydown.uiAccordion' + _.hashCode, function (e) {
            if (e.keyCode === 9 && _.blockTabKey) {
              e.preventDefault();
            }
          })
          .on('focusin.uiAccordion' + _.hashCode, function (e) {
            var $item = ($(e.target).is(_.layer) || $(e.target).closest(_.layer).length) && $(e.target).closest(_.item);

            if (_.options.focusInOpen && $item) {
              _.open($item, 0);
            }
          });
      }
    },
    off: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.off('click.uiAccordion' + _.hashCode);
        $doc.off('keydown.uiAccordion' + _.hashCode).off('focusin.uiAccordion' + _.hashCode);
      }
    },
    toggle: function ($item) {
      var _ = this;

      if ($item.hasClass(_.className.opened)) {
        _.close($item);
      } else {
        _.open($item);
      }
    },
    open: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if (!$item.hasClass(_.className.opened)) {
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', 'auto');
        $opener = $item.find(_.opener);
        $item.addClass(_.className.opened);
        $opener.addClass(_.className.active);
        $layer.addClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        if (speed > 0) {
          $item.addClass(_.className.animated);
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $item.removeClass(_.className.animated);
              $layer
                .css({
                  height: 'auto',
                })
                .trigger('uiAccordionAfterOpened');
            }
          )
          .trigger('uiAccordionOpened', [beforeH, afterH]);

        if (_.options.once) {
          _.item.not($item).each(function () {
            _.close($(this));
          });
        }
      }
    },
    close: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var itemBeforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if ($item.hasClass(_.className.opened)) {
        _.blockTabKey = true;
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        itemBeforeH = $item.height();
        $item.css('height', itemBeforeH);
        $layer.css('height', '');
        $opener = $item.find(_.opener);
        $item.removeClass(_.className.opened);
        $opener.removeClass(_.className.active);
        $layer.removeClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        if (speed > 0) {
          $item.addClass(_.className.animated);
        }
        $item.css('height', '');
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $item.removeClass(_.className.animated);
              $layer
                .css({
                  display: '',
                  height: '',
                })
                .trigger('uiAccordionAfterClosed');
              _.blockTabKey = false;
            }
          )
          .trigger('uiAccordionClosed', [beforeH, afterH]);
      }
    },
    allClose: function () {
      var _ = this;

      _.item.each(function () {
        _.close($(this));
      });
    },
    update: function (newOptions) {
      var _ = this;

      _.off();
      $.extend(_.options, newOptions);
      _.getElements();
      _.on();
    },
  });
  $.fn.uiAccordion = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      layer: null,
      once: false,
      speed: 500,
      focusInOpen: true,
      onInit: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiAccordion = this.uiAccordion;

      if (typeof custom === 'object' && !uiAccordion) {
        options = $.extend({}, defaultOption, custom);
        this.uiAccordion = new UiAccordion(this, options);
      } else if (typeof custom === 'string' && uiAccordion) {
        switch (custom) {
          case 'allClose':
            uiAccordion.allClose();
            break;
          case 'close':
            uiAccordion.close(other[0], other[1]);
            break;
          case 'open':
            uiAccordion.open(other[0], other[1]);
            break;
          case 'update':
            uiAccordion.update(other[0]);
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiTabPanel
  var UiTabPanel = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      active: 'js-tabpanel-active',
      opened: 'js-tabpanel-opened',
    };
    _.options = option;
    _.wrap = $wrap;
    _.crrTarget = '';
    _.init();
    _.on();
  };
  $.extend(UiTabPanel.prototype, {
    init: function () {
      var _ = this;
      var initialOpen = typeof _.options.initialOpen === 'string' && _.options.initialOpen;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      _.openerItems = _.opener;

      _.openerList = (function () {
        var $list = _.wrap;
        var eachBreak = false;

        if (_.opener && _.opener.length >= 2) {
          _.opener
            .eq(0)
            .parents()
            .each(function () {
              var $this = $(this);
              _.opener
                .eq(1)
                .parents()
                .each(function () {
                  var $secondThis = $(this);
                  var $children = $this.children();

                  if ($this.is($secondThis)) {
                    $list = $this;
                    eachBreak = true;

                    if ($children.filter(_.opener).length <= 0) {
                      _.openerItems = $this.children().filter(function () {
                        if ($(this).find(_.opener).length) {
                          return true;
                        } else {
                          return false;
                        }
                      });
                    }

                    return false;
                  }
                });

              if (eachBreak) {
                return false;
              }
            });
        }

        return $list;
      })();

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }

      if (_.opener.length && _.item.length) {
        _.hashCode = uiGetHashCode();

        if (!initialOpen) {
          initialOpen = _.opener.eq(0).attr('data-tab-open');
        }

        if (_.options.a11y) {
          _.initA11y();
        }

        _.open(initialOpen, false);
      }
    },
    on: function () {
      var _ = this;
      var openerFocus = false;
      var $focusOpener = null;
      var itemClickCheck = false;

      if (_.opener.length && _.item.length) {
        if (!_.openerItems.is(_.opener)) {
          _.openerItems.on('click.uiTabPanel' + _.hashCode, function (e) {
            var $this = $(this);
            var $target = $(e.target);

            if ($target.is($this)) {
              itemClickCheck = true;
              $target.find(_.opener).trigger('click');
            }
          });
        }
        _.opener.on('click.uiTabPanel' + _.hashCode, function (e) {
          var $this = $(this);
          var target = $this.attr('data-tab-open');

          _.open(target);

          if ($this.is('a')) {
            e.preventDefault();
          }

          if (itemClickCheck) {
            e.stopPropagation();
            itemClickCheck = false;
          }
        });
        $doc.on('focusin.uiTabPanel' + _.hashCode, function (e) {
          var $panel = ($(e.target).is(_.item) && $(e.target)) || ($(e.target).closest(_.item).length && $(e.target).closest(_.item));

          if ($panel && !$panel.is(':hidden')) {
            _.open($panel.attr('data-tab'));
          }
        });
        _.openerItems
          .on('focus.uiTabPanel' + _.hashCode, function () {
            openerFocus = true;
            $focusOpener = $(this);
          })
          .on('blur.uiTabPanel' + _.hashCode, function () {
            openerFocus = false;
            $focusOpener = null;
          });
        $doc
          .on('keydown.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            if (_.options.a11y && openerFocus) {
              if ([13, 32, 35, 36, 37, 38, 39, 40].indexOf(keyCode) > -1) {
                e.preventDefault();
              }
            }
          })
          .on('keyup.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            var target = $focusOpener && $focusOpener.attr('data-tab-open');
            if (_.options.a11y && openerFocus) {
              switch (keyCode) {
                case 35:
                  _.goEnd();
                  break;
                case 36:
                  _.goStart();
                  break;
                case 37:
                  _.prev();
                  break;
                case 38:
                  _.prev();
                  break;
                case 39:
                  _.next();
                  break;
                case 40:
                  _.next();
                  break;
                case 13:
                  _.open(target);
                  break;
                case 32:
                  _.open(target);
                  break;
                default:
                  break;
              }
            }
          });
      }
    },
    open: function (target, focus) {
      var _ = this;
      target = String(target);
      focus = focus instanceof Boolean ? (String(focus) === 'false' ? false : null) : focus;
      var $opener = _.opener.filter('[data-tab-open="' + target + '"]');
      var $panel = _.item.filter('[data-tab="' + target + '"]');

      if (!$panel.hasClass(_.className.opened)) {
        if (_.options.a11y) {
          _.setActiveA11y(target, focus);
        }

        _.crrTarget = target;
        _.opener.not($opener).removeClass(_.className.active);
        _.item.not($panel).removeClass(_.className.opened);
        $opener.addClass(_.className.active);
        $panel.addClass(_.className.opened).trigger('uiTabPanelChange', [$opener, $panel, _.opener, _.item]);
      }
    },
    indexOpen: function (i, focus) {
      var _ = this;
      target = Number(i);
      var target = _.opener.eq(i).attr('data-tab-open');

      _.open(target, focus);
    },
    next: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) + 1;
      if (i >= length) {
        i = 0;
      }
      _.indexOpen(i);
    },
    prev: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) - 1;
      if (i < 0) {
        i = length - 1;
      }
      _.indexOpen(i);
    },
    goStart: function () {
      var _ = this;
      _.indexOpen(0);
    },
    goEnd: function () {
      var _ = this;
      _.indexOpen(_.opener.length - 1);
    },
    initA11y: function () {
      var _ = this;

      _.opener.each(function (i) {
        var $this = $(this);
        var target = $this.attr('data-tab-open');
        var $item = (function () {
          var $item = $this.closest(_.openerItems);

          if ($item.length) {
            return $item;
          } else {
            return $this;
          }
        })();
        var $replaceWith = $this;

        $item
          .attr('role', 'tab')
          .attr('id', 'tabpanel-opener-' + target + '-' + _.hashCode)
          .attr('aria-controls', 'tabpanel-' + target + '-' + _.hashCode);

        if (!$this.is($item)) {
          $replaceWith = $(
            $this
              .get(0)
              .outerHTML.replace(/^<[a-zA-Z]+/, '<span')
              .replace(/\/[a-zA-Z]+>$/, '/span>')
          );

          $this.replaceWith($replaceWith);

          _.opener[i] = $replaceWith.get(0);
        }
      });

      _.item.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab');

        $this
          .attr('role', 'tabpanel')
          .attr('id', 'tabpanel-' + target + '-' + _.hashCode)
          .attr('aria-labelledby', 'tabpanel-opener-' + target + '-' + _.hashCode);
      });

      _.openerList.attr('role', 'tablist');
    },
    setActiveA11y: function (target, focus) {
      var _ = this;

      focus = focus === false ? false : true;

      _.opener.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab-open');
        var $item = (function () {
          var $item = $this.closest(_.openerItems);

          if ($item.length) {
            return $item;
          } else {
            return $this;
          }
        })();

        if (crrTarget === target) {
          $item.attr('tabindex', '0').attr('aria-selected', 'true');
          if (focus) {
            $item.focus();
          }
        } else {
          $item.attr('tabindex', '-1').attr('aria-selected', 'false');
        }
      });

      _.item.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab');

        if (crrTarget === target) {
          $this.removeAttr('hidden');
        } else {
          $this.attr('hidden', '');
        }
      });
    },
    addA11y: function () {
      var _ = this;

      if (!_.options.a11y) {
        _.options.a11y = true;
        _.initA11y();
        _.setActiveA11y(_.crrTarget);
      }
    },
    clearA11y: function () {
      var _ = this;

      if (_.options.a11y) {
        _.options.a11y = false;
        _.opener.removeAttr('role').removeAttr('id').removeAttr('aria-controls').removeAttr('tabindex').removeAttr('aria-selected');

        _.item.removeAttr('role').removeAttr('id').removeAttr('aria-labelledby').removeAttr('hidden');

        _.wrap.removeAttr('role');
      }
    },
  });
  $.fn.uiTabPanel = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      initialOpen: null,
      a11y: false,
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiTabPanel = this.uiTabPanel;

      if (typeof custom === 'object' && !uiTabPanel) {
        options = $.extend({}, defaultOption, custom);
        this.uiTabPanel = new UiTabPanel(this, options);
      } else if (typeof custom === 'string' && uiTabPanel) {
        switch (custom) {
          case 'addA11y':
            uiTabPanel.addA11y();
            break;
          case 'clearA11y':
            uiTabPanel.clearA11y();
            break;
          case 'open':
            uiTabPanel.open(other[0], other[1]);
            break;
          case 'indexOpen':
            uiTabPanel.indexOpen(other[0], other[1]);
            break;
          case 'next':
            uiTabPanel.next();
            break;
          case 'prev':
            uiTabPanel.prev();
            break;
          case 'goStart':
            uiTabPanel.goStart();
            break;
          case 'goEnd':
            uiTabPanel.goEnd();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // scrollbars width
  var scrollbarsWidth = {
    width: 0,
    set: function () {
      var _ = scrollbarsWidth;
      var $html = $('html');
      var $wrap = $('#wrap');
      $html.css('overflow', 'hidden');
      var beforeW = $wrap.width();
      $html.css('overflow', 'scroll');
      var afterW = $wrap.width();
      $html.css('overflow', '');
      _.width = beforeW - afterW;
    },
  };
  function checkScrollbars() {
    var $html = $('html');
    if (Boolean(scrollbarsWidth.width) && !$html.hasClass('is-scrollbars-width')) {
      $html.addClass('is-scrollbars-width');
    }
  }

  // scrollBlock
  var scrollBlock = {
    scrollTop: 0,
    scrollLeft: 0,
    className: {
      block: 'is-scroll-blocking',
    },
    block: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if (!$html.hasClass(_.className.block)) {
        scrollBlock.scrollTop = $win.scrollTop();
        scrollBlock.scrollLeft = $win.scrollLeft();

        $html.addClass(_.className.block);
        $win.scrollTop(0);
        $wrap.scrollTop(_.scrollTop);
        $win.scrollLeft(0);
        $wrap.scrollLeft(_.scrollLeft);
      }
    },
    clear: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if ($html.hasClass(_.className.block)) {
        $html.removeClass(_.className.block);
        $wrap.scrollTop(0);
        $win.scrollTop(_.scrollTop);
        $wrap.scrollLeft(0);
        $win.scrollLeft(_.scrollLeft);
      }
    },
  };
  window.uiJSScrollBlock = scrollBlock;

  // layer
  var uiLayer = {
    zIndex: 10000,
    open: function (target, opener, speed) {
      var _ = uiLayer;
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var timer = null;
      var hasScrollBlock = true;
      var isFocus = true;
      var isCycleFocus = true;
      var speed = typeof speed === 'number' ? speed : 350;
      var $label = null;
      var hashCode = '';
      var labelID = '';
      var $layers = $('[data-layer]');
      var $preOpenLayers = $layers.filter('.js-layer-opened').not($layer);
      var notOhterElements = 'script, link, style, base, meta, br, [aria-hidden], [inert], .js-not-inert, .js-not-inert *, [data-ui-js]';
      var $ohterElements = $('body')
        .find('*')
        .not('[data-layer], [data-layer] *, ' + notOhterElements);
      var $preLayersElements = $preOpenLayers.find('*').not(notOhterElements);

      $layers.parents().each(function () {
        $ohterElements = $ohterElements.not($(this));
      });

      if ($layer.length && !$layer.hasClass('js-layer-opened')) {
        $label = $layer.find('h1, h2, h3, h4, h5, h6, p').eq(0);
        hashCode = (function () {
          var code = $layer.data('uiJSHashCode');
          if (!(typeof code === 'string')) {
            code = uiGetHashCode();
            $layer.data('uiJSHashCode', code);
          }
          return code;
        })();
        hasScrollBlock = (function () {
          var val = $layer.data('scroll-block');
          return typeof val === 'boolean' ? val : true;
        })();
        isFocus = (function () {
          var val = $layer.data('focus');
          return typeof val === 'boolean' ? val : true;
        })();
        isCycleFocus = (function () {
          var val = $layer.data('cycle-focus');
          return typeof val === 'boolean' ? val : true;
        })();

        _.zIndex++;
        $layer.trigger('layerBeforeOpened').attr('role', 'dialog').attr('aria-hidden', 'true').css('visibility', 'hidden').attr('hidden', '');
        if ($label.length) {
          labelID = (function () {
            var id = $label.attr('id');
            if (!(typeof id === 'string' && id.length)) {
              id = target + '-' + hashCode;
              $label.attr('id', id);
            }
            return id;
          })();
          $layer.attr('aria-labelledby', labelID);
        }
        $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);

        $ohterElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preLayersElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preOpenLayers.attr('aria-hidden', 'true').attr('inert', '').removeAttr('aria-modal');

        if (isCycleFocus && !$layer.children('.js-loop-focus').length) {
          $('<div class="js-loop-focus" tabindex="0"></div>')
            .on('focusin.uiLayer', function () {
              $layer.focus();
            })
            .appendTo($layer);
        }

        $layer
          .stop()
          .removeClass('js-layer-closed')
          .css({
            display: 'block',
            zIndex: _.zIndex,
          })
          .animate(
            {
              opacity: 1,
            },
            speed,
            function () {
              if (isFocus) {
                $layer.focus();
              }
              $layer.removeClass('js-layer-animated').trigger('layerAfterOpened');
            }
          )
          .attr('tabindex', '0')
          .attr('aria-hidden', 'false')
          .attr('aria-modal', 'true')
          .css('visibility', 'visible')
          .removeAttr('hidden')
          .data('layerIndex', $('.js-layer-opened').length);

        if (hasScrollBlock) {
          scrollBlock.block();
        }

        if (Boolean(opener) && $(opener).length) {
          $layer.data('layerOpener', $(opener));
        }

        timer = setTimeout(function () {
          clearTimeout(timer);
          $layer.addClass('js-layer-opened js-layer-animated').trigger('layerOpened');
        }, 0);
      }
    },
    close: function (target, speed) {
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var $opener = $layer.data('layerOpener');
      var $allOpener = $('[data-layer-open="' + target + '"]');
      var isScrollBlock = $html.hasClass(scrollBlock.className.block);
      var timer = null;
      var speed = typeof speed === 'number' ? speed : 350;

      if ($layer.length && $layer.hasClass('js-layer-opened')) {
        if ($allOpener && $allOpener.length) {
          $allOpener.removeClass('js-layer-opener-active');
        }

        $layer
          .trigger('layerBeforeClosed')
          .stop()
          .removeClass('js-layer-opened')
          .addClass('js-layer-closed js-layer-animated')
          .css('display', 'block')
          .data('layerIndex', null)
          .attr('aria-hidden', 'true')
          .removeAttr('aria-modal')
          .animate(
            {
              opacity: 0,
            },
            speed,
            function () {
              var $ohterElements = $('body').find('[data-ui-js="hidden"]');
              var $preOpenLayers = $('[data-layer].js-layer-opened').not($layer);
              var $preOpenLayerHasScrollBlock = $preOpenLayers.not(function () {
                var val = $(this).data('scroll-block');
                return typeof val === 'boolean' ? val : false;
              });
              var preOpenLayersHigherZIndex = (function () {
                var array = [];
                $preOpenLayers.each(function () {
                  var zIndex = $(this).css('z-index');
                  array.push(zIndex);
                });
                array.sort();
                return array[array.length - 1];
              })();
              var $preOpenLayer = $preOpenLayers.filter(function () {
                var zIndex = $(this).css('z-index');

                return zIndex === preOpenLayersHigherZIndex;
              });
              var $preOpenLayerOhterElements = $preOpenLayer.find('[data-ui-js="hidden"]');
              var $openerClosest = null;

              $(this).css('display', 'none').css('visibility', 'hidden').attr('hidden', '').removeClass('js-layer-closed');

              $html.removeClass('js-html-layer-closed-animate js-html-layer-opened-' + target);

              if ($preOpenLayer.length) {
                $preOpenLayerOhterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
                $preOpenLayer.attr('aria-hidden', 'false').removeAttr('inert').attr('aria-modal', 'true');
              }

              if (!$preOpenLayers.length) {
                $html.removeClass('js-html-layer-opened');
                $ohterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
              }

              if (!$preOpenLayerHasScrollBlock.length && isScrollBlock) {
                scrollBlock.clear();
              }

              if ($opener && $opener.length) {
                if ($preOpenLayers.length) {
                  $openerClosest = $opener.closest($preOpenLayers);
                  if ($openerClosest.length && $openerClosest.hasClass('js-layer-opened')) {
                    $opener.focus();
                  }
                } else {
                  $opener.focus();
                }
                $layer.data('layerOpener', null);
              } else {
                $html.attr('tabindex', '0').focus().removeAttr('tabindex');
              }

              $layer.removeClass('js-layer-animated').trigger('layerAfterClosed');
            }
          )
          .trigger('layerClosed');

        timer = setTimeout(function () {
          clearTimeout(timer);
          $html.addClass('js-html-layer-closed-animate');
        }, 0);
      }
    },
    checkFocus: function (e) {
      var $layer = $('[data-layer]')
        .not(':hidden')
        .not(function () {
          var val = $(this).data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return true;
          } else {
            return false;
          }
        });
      var $target = $(e.target);
      var $closest = $target.closest('[data-layer]');
      var lastIndex = (function () {
        var index = 0;
        $layer.each(function () {
          var crrI = $(this).data('layerIndex');
          if (crrI > index) {
            index = crrI;
          }
        });
        return index;
      })();
      var checkLayer = $layer.length && !($target.is($layer) && $target.data('layerIndex') === lastIndex) && !($closest.length && $closest.is($layer) && $closest.data('layerIndex') === lastIndex);

      if (checkLayer) {
        $layer
          .filter(function () {
            return $(this).data('layerIndex') === lastIndex;
          })
          .focus();
      }
    },
  };
  window.uiJSLayer = uiLayer;

  $doc
    .on('focusin.uiLayer', uiLayer.checkFocus)
    .on('click.uiLayer', '[data-role="layerClose"]', function () {
      var $this = $(this);
      var $layer = $this.closest('[data-layer]');
      if ($layer.length) {
        uiLayer.close($layer.attr('data-layer'));
      }
    })
    .on('click.uiLayer', '[data-layer-open]', function (e) {
      var $this = $(this);
      var layer = $this.attr('data-layer-open');
      var $layer = $('[data-layer="' + layer + '"]');
      var isToggle = (function () {
        var val = $this.data('toggle');
        return typeof val === 'boolean' ? val : false;
      })();

      if ($layer.length) {
        if (isToggle && $layer.hasClass('js-layer-opened')) {
          uiLayer.close(layer);
        } else {
          if (isToggle) {
            $this.addClass('js-layer-opener-active');
          }
          uiLayer.open(layer);
          $layer.data('layerOpener', $this);
        }
      }

      e.preventDefault();
    })
    .on('layerAfterOpened.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var layer = $this.attr('data-layer');
      var delay = Number($this.attr('data-layer-timer-close'));
      var timer = setTimeout(function () {
        uiLayer.close(layer);
        clearTimeout(timer);
      }, delay);
      $this.data('layer-timer', timer);
    })
    .on('layerBeforeClosed.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var timer = $this.data('layer-timer');
      clearTimeout(timer);
    });

  // input disabled class
  function checkDisabledClass($root) {
    if (!$root) {
      $root = $doc;
    }

    var $inputs = $root.find('.ui-input, .ui-select');

    $inputs.each(function () {
      var $this = $(this);
      var $parent = $this.parent('.ui-input-block, .ui-select-block');
      var disabledClassName = 'is-disabled';
      var isDisabled = $this.is(':disabled');
      var disabledHasClass = $parent.hasClass(disabledClassName);
      var readonlyClassName = 'is-readonly';
      var isReadonly = $this.is('[readonly]');
      var readonlyHasClass = $parent.hasClass(readonlyClassName);

      if (isDisabled && !disabledHasClass) {
        $parent.addClass(disabledClassName);
      } else if (!isDisabled && disabledHasClass) {
        $parent.removeClass(disabledClassName);
      }

      if (isReadonly && !readonlyHasClass) {
        $parent.addClass(readonlyClassName);
      } else if (!isReadonly && readonlyHasClass) {
        $parent.removeClass(readonlyClassName);
      }
    });
  }

  // fixBarSet
  function fixBarSet() {
    var $layoutWrap = $('.layout-wrap');
    var $top = $('.fix-top-wrap');
    var $fakeTop = $('.js-fake-top');
    var $bottom = $('.fix-bottom-wrap');
    var $fakeBottom = $('.js-fake-bottom');
    var topH = 0;
    var bottomH = 0;
    var fakeTopH = 0;
    var fakeBottomH = 0;

    if ($top.length && !$top.is(':hidden')) {
      topH = $top.outerHeight();
      if (!$fakeTop.length) {
        $layoutWrap.prepend('<div class="js-fake-top"></div>');
        $fakeTop = $('.js-fake-top');
      }
      fakeTopH = $fakeTop.height();
      if (!(topH === fakeTopH)) {
        $fakeTop.height(topH);
      }
    }
    if ($bottom.length && !$bottom.is(':hidden')) {
      bottomH = $bottom.outerHeight();
      if (!$fakeBottom.length) {
        $layoutWrap.append('<div class="js-fake-bottom"></div>');
        $fakeBottom = $('.js-fake-bottom');
      }
      fakeBottomH = $fakeBottom.height();
      if (!(bottomH === fakeBottomH)) {
        $fakeBottom.height(bottomH);
      }
    }
  }

  // fixBarScroll
  function fixBarScroll() {
    var $fixBar = $('.fix-top-wrap, .fix-bottom-wrap, .bottom-sticky');
    var scrollX = $('#wrap').scrollLeft() || $win.scrollLeft();

    $fixBar.css('margin-left', -scrollX);
  }

  // header scroll
  function headerScroll() {
    var $header = $('.header:not(.header--popup)');
    var scrollTop = $win.scrollTop();
    var className = 'is-scroll';

    if (scrollTop > 0) {
      $header.addClass(className);
    } else {
      $header.removeClass(className);
    }
  }

  // checkbox tab
  var checkboxTab = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-checkbox-tab]:not(:checked)').each(function () {
        checkboxTab.update($(this));
      });
      $root.find('[data-checkbox-tab]:checked').each(function () {
        checkboxTab.update($(this));
      });
    },
    update: function ($input) {
      var name = $input.data('checkbox-tab');
      var $panels = $('[data-checkbox-tab-panel]');
      var $panel = $panels.filter(function () {
        var $this = $(this);
        var val = $this.attr('data-checkbox-tab-panel');
        var array = val.replace(/\s/g, '').split(',');

        return array.indexOf(name) >= 0;
      });
      var isChecked = $input.is(':checked');

      if (isChecked) {
        $panel.show();
      } else {
        $panel.css('display', 'none');
      }

      $panel.trigger('checkboxTabChange');
    },
  };
  $doc.on('change.checkboxTab', '[data-checkbox-tab]', function () {
    var $this = $(this);
    var group = $this.attr('data-checkbox-tab-group');
    var $groupSiblings = $('[data-checkbox-tab-group="' + group + '"]');
    var name = $this.attr('name');
    var $siblings = $('[name="' + name + '"]').not($this);

    if (typeof group === 'string') {
      $groupSiblings.not(':checked').each(function () {
        checkboxTab.update($(this));
      });
      $groupSiblings.filter(':checked').each(function () {
        checkboxTab.update($(this));
      });
    } else {
      if ($this.is('[type="radio"]')) {
        $siblings.each(function () {
          checkboxTab.update($(this));
        });
      }
      checkboxTab.update($this);
    }
  });

  // duet-date-picker
  var datePicker = {
    timer: null,
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('duet-date-picker').each(function () {
        var $this = $(this);
        var $layer = $this.find('.duet-date__dialog');
        var initTimer = $this.data('datePickerInitTimer');
        var picker = this;
        var DATE_FORMAT = /^(\d{4})\.(\d{2})\.(\d{2})$/;

        picker.dateAdapter = {
          parse: function (value = '', createDate) {
            value = typeof value === 'string' ? value : '';

            var matches = value.match(DATE_FORMAT);

            if (matches) {
              return createDate(matches[1], matches[2], matches[3]);
            }
          },
          format: function (date) {
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '.' + (month < 10 ? '0' : '') + month + '.' + (day < 10 ? '0' : '') + day;
          },
        };

        picker.firstDayOfWeek = 0;
        picker.localization = {
          buttonLabel: '날짜 선택',
          placeholder: '연도.월.일',
          selectedDateMessage: '선택 된 날짜',
          prevMonthLabel: '이전 달',
          nextMonthLabel: '다음 달',
          monthSelectLabel: '월',
          yearSelectLabel: '연도',
          closeLabel: '닫기',
          calendarHeading: '날짜 선택',
          dayNames: ['일 요일', '월 요일', '화 요일', '수 요일', '목 요일', '금 요일', '토 요일'],
          monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          locale: 'ko-KR',
        };

        clearTimeout(initTimer);

        initTimer = setTimeout(function () {
          clearTimeout(initTimer);
          if (!$layer.hasClass('is-active')) {
            $this.find('.duet-date__select select').prop('disabled', true).attr({
              disabled: '',
              'aria-hidden': 'true',
              inert: '',
            });
          }
        }, 200);

        $this.data('datePickerInitTimer', initTimer);
      });
    },
    animated: function ($picker) {
      var $html = $('html');

      $html.addClass('is-date-picker-animated');
      $picker.addClass('is-animated');

      clearTimeout(datePicker.timer);
      datePicker.timer = setTimeout(function () {
        clearTimeout(datePicker.timer);
        $html.removeClass('is-date-picker-animated');
        $picker.removeClass('is-animated');
      }, 300);
    },
  };
  $doc
    .on('duetOpen.uiJSCommon', 'duet-date-picker', function () {
      var $this = $(this);
      var $html = $('html');

      $html.addClass('is-date-picker-opened');
      $this.find('.duet-date__select select').prop('disabled', false).removeAttr('aria-hidden inert');

      datePicker.animated($this);
    })
    .on('duetClose.uiJSCommon', 'duet-date-picker', function () {
      var $this = $(this);
      var $html = $('html');

      $html.removeClass('is-date-picker-opened');
      $this.find('.duet-date__select select').prop('disabled', true).attr({
        disabled: '',
        'aria-hidden': 'true',
        inert: '',
      });

      datePicker.animated($this);
    });

  // section slide
  function sectionSlideInit($root) {
    if (!$root) {
      $root = $doc;
    }
    $root.find('.section-slide').each(function () {
      var $this = $(this);
      var $wrap = $this.closest('.section-slide-wrap');
      var $controller = $wrap.find('.section-slide-controller');
      var $list = $this.find('.section-slide__list');

      $list.swiperSet({
        appendController: $controller,
        pageControl: true,
        pagination: {
          type: 'fraction',
          formatFractionCurrent: function (num) {
            if (num < 10) {
              return '0' + num;
            } else {
              return num;
            }
          },
          formatFractionTotal: function (num) {
            if (num < 10) {
              return '0' + num;
            } else {
              return num;
            }
          },
        },
      });
    });
  }

  // loading
  function loadingInit($root) {
    if (!$root) {
      $root = $doc;
    }

    $root.find('.ui-loading__object:not(.is-init)').each(function () {
      var $this = $(this);
      var $img = $this.find('.ui-loading__img');
      var width = 160;
      var frames = 120;
      var ms = 50;
      var i = 0;

      $this.addClass('is-init');

      setInterval(function () {
        i++;

        if (i >= frames) {
          i = 0;
        }

        if ($img.is(':visible')) {
          $img.css('margin-left', '-' + width * i + 'px');
        }
      }, ms);
    });
  }

  // main section
  var mainSection = {
    scroll: function () {
      var $section = $('.main-section');

      if (!$section.length) return;

      var scrollTop = $win.scrollTop();
      var winH = $win.height();
      var docH = $doc.height();
      var checkPoint = scrollTop + winH / 3;
      var isBlocking = $('html').hasClass('is-scroll-blocking');

      $section.each(function () {
        var $this = $(this);
        var offsetTop = $this.offset().top;

        if (!isBlocking && !$this.hasClass('is-in') && (checkPoint >= offsetTop || (checkPoint < offsetTop && scrollTop >= docH - winH))) {
          $this.addClass('is-in');
        }
      });
    },
  };

  // common js
  function uiJSCommon($root) {
    if (!$root) {
      $root = $doc;
    }

    checkScrollbars();
    fixBarSet();
    loadingInit($root);
    checkDisabledClass($root);
    sectionSlideInit($root);
    checkboxTab.init($root);
    datePicker.init($root);

    $root.find('.tooltip__block.js-ui-dropdown').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
      align: 'center',
      defaultVertical: 'top',
    });
    $root.find('.js-ui-dropdown:not(.tooltip__block)').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
    });

    $root.find('.js-ui-accordion').each(function () {
      var $this = $(this);
      var once = $this.attr('data-once') === 'true';
      var focusInOpen = !($this.attr('data-focus-open') === 'false');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-accordion');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('.js-ui-accordion__item').filter(filter);
      var $openers = $this.find('.js-ui-accordion__opener').filter(filter);
      var $layers = $this.find('.js-ui-accordion__layer').filter(filter);

      if ($this.get(0).uiAccordion) {
        $this.uiAccordion('update', {
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      } else {
        $this.uiAccordion({
          item: $items,
          opener: $openers,
          layer: $layers,
          once: once,
          focusInOpen: focusInOpen,
        });
      }
    });

    $root.find('.js-ui-tab-panel').each(function () {
      var $this = $(this);
      var initial = $this.attr('data-initial');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-tab-panel');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('[data-tab]').filter(filter);
      var $openers = $this.find('[data-tab-open]').filter(filter);

      $this.uiTabPanel({
        a11y: true,
        item: $items,
        opener: $openers,
        initialOpen: initial,
      });
    });
  }
  window.uiJSCommon = uiJSCommon;

  // uiJSResize
  function uiJSResize() {
    fixBarSet();
  }
  window.uiJSResize = uiJSResize;

  // area focus
  function areaFocus(area) {
    $doc
      .on('focus.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.addClass('is-focus').trigger('areaFocusIn');
      })
      .on('blur.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.data(
          'areaFocusTimer',
          setTimeout(function () {
            $this.removeClass('is-focus').trigger('areaFocusOut');
          }, 100)
        );
      });
  }
  areaFocus('.ui-input-block');
  areaFocus('.js-ui-dropdown');
  areaFocus('.ui-search');

  // inputed
  function inputedCheck($input, parent) {
    var val = $input.val();
    var $wrap = $input.closest(parent);

    if ($wrap.length) {
      if (typeof val === 'string' && val.length > 0) {
        $wrap.addClass('is-inputed');
      } else {
        $wrap.removeClass('is-inputed');
      }
    }
  }
  $doc.on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.ui-input', function () {
    inputedCheck($(this), '.ui-input-block');
    inputedCheck($(this), '.ui-search');
  });

  // input delete
  $doc
    .on('focus.inputDelete', 'input.ui-input', function () {
      var $this = $(this);
      var $wrap = $this.closest('.ui-input-block');
      var isNoDelete = $wrap.hasClass('ui-input-block--no-delete');
      var type = $this.attr('type');
      var isText = Boolean(type.match(/text|password|search|email|url|number|tel|date|time/));
      var $delete = $wrap.find('.ui-input-delete');
      var isDisabled = $this.is('[readonly]') || $this.is('[disabled]');

      if (isText && !isNoDelete) {
        if (!$delete.length && !isDisabled) {
          $wrap.append('<button type="button" class="ui-button ui-input-delete"><span class="for-a11y">입력 내용 지우기</span></button>');
          $delete = $wrap.find('.ui-input-delete');
        }

        if (isDisabled) {
          $delete.prop('disabled', true).attr('disabled', '');
        } else {
          $delete.prop('disabled', false).removeAttr('disabled', '');
        }
      }
    })
    .on('click.inputDelete', '.ui-input-delete', function () {
      var $this = $(this);
      var $input = $this.closest('.ui-input-block').find('.ui-input');

      $input.val('').trigger('focus');
    });

  // search
  $doc
    .on('click.uiJSSearch', '[data-search-keyword]', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.ui-search');
      var $input = $wrap.find('.js-search-keyword-target');
      var text = $this.attr('data-search-keyword');

      $input.val(text).focus();
      $wrap.removeClass('is-focus');

      e.preventDefault();
    })
    .on('keydown.uiJSSearch', '.ui-search', function (e) {
      var keyCode = e.keyCode;
      var $this = $(this);
      var $links = $this.find('.ui-search__link');
      var $input = $this.find('.ui-search__input .ui-input');
      var $focusTarget = null;

      if ($links.length) {
        $focusTarget = (function () {
          var $focus = $links.filter(':focus');
          var focusIndex = 0;
          var $target = null;

          if ($focus.length) {
            focusIndex = $links.index($focus);

            if (keyCode === 38) {
              if (focusIndex > 0) {
                $target = $links.eq(focusIndex - 1);
              } else {
                $target = $input;
              }
            } else if (keyCode === 40) {
              $target = $links.eq(focusIndex + 1);
            }

            if ($target && $target.length) {
              return $target;
            }
          } else {
            if (keyCode === 40) {
              return $links.eq(0);
            }
          }
        })();

        if ($focusTarget && $focusTarget.length) {
          $focusTarget.focus();
        }
      }

      switch (keyCode) {
        case 38:
        case 40:
          e.preventDefault();
          break;
        default:
          break;
      }
    })
    .on('focus.uiJSSearch keyup.uiJSSearch change.uiJSSearch', '.ui-search__input .ui-input', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.ui-search');
      var $list = $wrap.find('.ui-search__list');
      var options = $this.data('searchOptions');
      var val = $this.val();
      var filterDatas = [];
      var html = '';

      if (e.keyCode === 13) return;

      if (typeof options === 'object' && val.length) {
        filterDatas = $.grep(options.datas, function (data) {
          var reg = new RegExp(val.replace(/([\.\[\]\^\$\(\)\\\*\{\}\?\+\|])/g, '\\$1'), 'g');
          return Boolean(data.keyword.match(reg));
        });

        $.each(filterDatas, function (i, data) {
          html += options.html(data);
        });

        if (!($list.html() === html)) {
          $list.empty().append(html);
        }

        $wrap.addClass('is-focus');
      }
    });

  // dropdown
  $doc
    .on('click.uiJSDropdown', '.js-ui-dropdown__closer', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');

      $wrap.uiDropDown('btnClose');
    })
    .on('click.uiJSDropdown', '[data-dropdown-option]', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');
      var $watch = $wrap.find('.js-ui-dropdown__watch');
      var text = $this.attr('data-dropdown-option');

      $watch.text(text);

      e.preventDefault();
    });

  // layer opened scroll to start
  function layerOpenedScrollToStart($wrap, target) {
    var $scroller = $wrap.find(target);

    if ($scroller.length) {
      $scroller.scrollTop(0).scrollLeft(0);
    }
  }
  $doc
    .on('layerOpened.layerOpenedScrollToStart', '.layer-wrap', function () {
      layerOpenedScrollToStart($(this), '.ui-layer__body');
    })
    .on('uiDropDownOpened.layerOpenedScrollToStart', '.js-ui-dropdown', function () {
      layerOpenedScrollToStart($(this), '.ui-dropdown__contents');
    });

  // invalid
  $.fn.invalid = function (isInvalid, message) {
    message = typeof message === 'string' ? message : '';

    this.each(function () {
      var $this = $(this);
      var $el = (function () {
        if ($this.is('.ui-select, .ui-input, .ui-checkbox, .ui-radio')) {
          return $this.closest('.ui-select-block, .ui-input-block, .ui-checkbox-block, .ui-radio-block');
        } else {
          return $this;
        }
      })();
      var $formFlex = $el.closest('.form-flex');
      var isFlex = Boolean($formFlex.length);
      var $target = (function () {
        if (isFlex) {
          return $formFlex;
        } else {
          return $el;
        }
      })();
      var $message = $target.next('.ui-invalid-message');

      if (typeof isInvalid === 'boolean' && isInvalid) {
        if (!$message.length) {
          $message = $('<p class="ui-invalid-message" aria-role="alert" aria-live="assertive"></p>');
          $target.after($message);
        }

        $this.attr('tabindex', '-1').focus().removeAttr('tabindex');

        $message.html(message.replace(/\n/g, '<br />'));

        $el.addClass('is-invalid');
      } else {
        if ($message.length) {
          $message.remove();
        }

        $el.removeClass('is-invalid');
      }
    });

    return $(this);
  };

  // toast alert
  function toastAlert(wrap, message) {
    var $wrap = $(wrap);
    var $inner = (function () {
      var $el = $wrap.find('.ui-toast-alert-inner');
      if (!$el.length) {
        $wrap.append('<div class="ui-toast-alert-inner"></div>');
        $el = $wrap.find('.ui-toast-alert-inner');
      }
      return $el;
    })();
    var $message = $('<p class="ui-toast-alert-text" aria-role="alert" aria-live="assertive">' + message.replace(/\n/g, '<br />') + '</p>');

    $inner.append($message);

    $message.animate({ opacity: 1 }, 500, function () {
      var timer = setTimeout(function () {
        $message.prop('translateY', 0).animate(
          {
            translateY: -100,
            opacity: 0,
          },
          {
            duration: 500,
            step: function (now, fx) {
              if (fx.prop === 'translateY') {
                $message.css('transform', 'translateY(' + now + '%)');
              }
            },
            complete: function () {
              $message.remove();
              clearTimeout(timer);
            },
          }
        );
      }, 3000);
    });
  }
  window.uiJSToastAlert = toastAlert;

  // toggle edit
  $doc.on('click.toggleEdit', '.js-toggle-edit__button', function () {
    var $this = $(this);
    var $wrap = $this.closest('.js-toggle-edit');
    var $before = $wrap.find('.js-toggle-edit__before');
    var $after = $wrap.find('.js-toggle-edit__after');

    if ($wrap.hasClass('js-toggle-edit--active')) {
      $wrap.removeClass('js-toggle-edit--active');
      $before.eq(0).attr('tabindex', '-1').focus();
    } else {
      $wrap.addClass('js-toggle-edit--active');
      $after.eq(0).attr('tabindex', '-1').focus();
    }
  });

  // chart resize
  function chartResize($charts) {
    $charts.each(function () {
      var $this = $(this);
      var highcharts = $this.data('highcharts');

      if (highcharts && highcharts.reflow) {
        highcharts.reflow();
      }
    });
  }
  $doc
    .on('swiperResize.chartResize', '.section-slide__list', function () {
      var $this = $(this);
      var $charts = $this.find('.chart-box');

      chartResize($charts);
    })
    .on('uiTabPanelChange.chartResize', '.js-ui-tab-panel', function (e, $currentOpener, $currentPanel) {
      var $charts = $currentPanel.find('.chart-box');

      chartResize($charts);
    });

  // map detail
  var mapDetail = {
    show: function () {
      var $detail = $('.map-detail');

      if (!$detail.hasClass('is-show')) {
        $detail.addClass('is-show').trigger('mapDetailShow');
      }
    },
    hide: function () {
      var $detail = $('.map-detail');

      if ($detail.hasClass('is-show')) {
        $detail.removeClass('is-show').trigger('mapDetailHide');
      }

      $('.map-pin').removeClass('is-selected');
    },
    open: function () {
      var $html = $('html');
      var $detail = $('.map-detail');
      var $scroller = $detail.find('.map-detail__body, .ui-table__scroller');

      if (!$detail.hasClass('is-opened')) {
        $html.addClass('is-map-detail-opened');
        $detail.addClass('is-opened').trigger('mapDetailOpened');
        $scroller.scrollTop(0).scrollLeft(0);
      }
    },
    close: function () {
      var $html = $('html');
      var $detail = $('.map-detail');

      if ($detail.hasClass('is-opened')) {
        $html.removeClass('is-map-detail-opened');
        $detail.removeClass('is-opened').trigger('mapDetailClosed');
      }
    },
  };
  window.uiJSMapDetail = mapDetail;

  $doc
    .on('click.mapDetail', '.full-map', function () {
      mapDetail.hide();
    })
    .on('click.mapDetail', '.map-detail__opener', function () {
      mapDetail.open();
    })
    .on('click.mapDetail', '.js-map-detail-close', function () {
      mapDetail.close();
    });

  // alert
  function uiAlert(customOption) {
    var defaultOption = {
      title: '',
      message: '',
      buttons: [{}],
    };
    var defaultButtonsOption = {
      text: '예',
      type: '', // secondary, tertiary, quaternary, quinary
      html: function (options, triggerClassName) {
        var html = '';
        var type = options.type.length ? 'ui-basic-button--' + options.type : '';

        html += '<button type="button" class="ui-button ui-basic-button ui-basic-button--regular ' + type + ' ' + triggerClassName + '">';
        html += '<span class="ui-basic-button__text">' + options.text + '</span>';
        html += '</button>';

        return html;
      },
      callback: function (closeFn) {
        closeFn();
      },
    };
    var options = $.extend({}, defaultOption, customOption);
    var hashCode = uiGetHashCode();
    var html = '';
    var triggerClassName = 'js-ui-alert-button';
    var $buttons = [];
    var $layer = null;
    var layerName = 'ui-alert-' + hashCode;
    var closeFn = function () {
      uiLayer.close(layerName);
    };
    var buttonsCallback = [];
    var $lastFocus = $(':focus');

    $.each(options, function (key, val) {
      if (key === 'buttons') {
        $.each(val, function (i, button) {
          options.buttons[i] = $.extend({}, defaultButtonsOption, button);

          var $el = $(
            '<li class="ui-buttons__item">' +
              options.buttons[i].html(
                {
                  text: options.buttons[i].text,
                  type: options.buttons[i].type,
                },
                triggerClassName
              ) +
              '</li>'
          );

          $el.find('.' + triggerClassName).on('click.uiAlert', function () {
            options.buttons[i].callback(closeFn);
          });

          buttonsCallback[i] = function () {
            options.buttons[i].callback(closeFn);
          };

          $buttons.push($el);
        });
      }
    });

    html += '<div class="layer-wrap layer-alert" data-layer="' + layerName + '">';
    html += '  <div class="layer-container">';
    html += '    <section class="ui-alert">';

    if (options.title.length) {
      html += '      <div class="ui-alert__head">';
      html += '        <h2 class="ui-alert__title">' + options.title + '</h2>';
      html += '      </div>';
    }

    if (options.message.length) {
      html += '      <div class="ui-alert__body">';
      html += '        <div class="ui-alert__body-inner">';
      html += '          <p class="ui-alert__message">' + options.message.replace(/\n/g, '<br />') + '</p>';
      html += '        </div>';
      html += '      </div>';
    }

    html += '      <div class="ui-alert__foot">';
    html += '        <div class="ui-buttons ui-buttons--auto">';
    html += '          <ul class="ui-buttons__list"></ul>';
    html += '        </div>';
    html += '      </div>';
    html += '    </section>';
    html += '  </div>';
    html += '</div>';

    $layer = $(html);

    var $buttonList = $layer.find('.ui-alert__foot .ui-buttons__list');

    $.each($buttons, function (i, $el) {
      $buttonList.append($el);
    });

    $layer.on('layerAfterClosed.uiAlert', function () {
      $layer.remove();
    });

    $('body').append($layer);

    uiLayer.open(layerName, $lastFocus);

    return {
      title: options.title,
      message: options.message,
      layerName: layerName,
      $layer: $layer,
      close: closeFn,
      clear: function () {
        uiLayer.close(layerName, 0);
      },
      buttonsCallback: buttonsCallback,
    };
  }
  window.uiJSAlert = uiAlert;

  // bottom sticky
  function bottomStickyScroll() {
    var $area = $('.bottom-sticky');

    if (!$area.length) return;

    var $footer = $('.footer');

    if (!$footer.length) return;

    var footerY = $footer.offset().top;
    var scrollTop = $win.scrollTop();
    var winH = $win.height();
    var hasClass = $area.hasClass('is-sticky');

    if (scrollTop > footerY - winH) {
      if (!hasClass) {
        $area.addClass('is-sticky');
      }
    } else {
      if (hasClass) {
        $area.removeClass('is-sticky');
      }
    }
  }

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    scrollbarsWidth.set();

    // css set
    if (scrollbarsWidth.width > 0) {
      $body.prepend(
        '<style type="text/css">' +
          '.is-scroll-blocking.is-scrollbars-width #wrap {' +
          'margin-right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-top-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-bottom-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}' +
          '.is-scroll-blocking.is-scrollbars-width .bottom-sticky {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}' +
          '</style>'
      );
    }

    // none support backdrop class
    if (!Boolean($html.css('backdrop-filter'))) {
      $html.addClass('is-none-support-backdrop');
    }

    // init
    uiJSCommon();
    fixBarScroll();
    headerScroll();
    bottomStickyScroll();

    // resize
    uiJSResize();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      uiJSResize();
      mainSection.scroll();
    })
    .on('scroll.uiJS', function () {
      fixBarScroll();
      headerScroll();
      bottomStickyScroll();
      mainSection.scroll();
    })
    .on('resize.uiJS', function () {
      uiJSResize();
      fixBarScroll();
      headerScroll();
      bottomStickyScroll();
      mainSection.scroll();
    })
    .on('orientationchange.uiJS', function () {
      uiJSResize();
      fixBarScroll();
      headerScroll();
      bottomStickyScroll();
      mainSection.scroll();
    });
})(jQuery);
