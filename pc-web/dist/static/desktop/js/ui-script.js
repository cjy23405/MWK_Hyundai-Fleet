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

  // simplebar
  // https://grsmto.github.io/simplebar/
  // init ex: $(element).simplebar({/* customOptions */});
  // method ex: $(element).data('simplebar').recalculate();
  $.fn.simplebar = function (customOption) {
    var defaultOption = {
      //
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('simplebar') || !$.isFunction(window.SimpleBar)) return;

      if (typeof window.SimpleBar === 'function') {
        if (userAgentCheck.ieMode <= 10) {
          $this.css('overflow', 'auto');
        } else {
          var simplebar = new SimpleBar($this.get(0), option);
          $this.data('simplebar', simplebar);
        }
      }
    });

    return $(this);
  };

  // sortable
  // https://github.com/SortableJS/Sortable
  // init ex: $(element).sortable({/* customOptions */});
  // method ex: $(element).data('sortable').destroy();
  $.fn.sortable = function (customOption) {
    var defaultOption = {
      //
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('sortable') || !(typeof window.Sortable === 'function')) return;

      if (typeof window.Sortable === 'function') {
        var sortable = new Sortable($this.get(0), option);
        $this.data('sortable', sortable);
      }
    });

    return $(this);
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

  // UiSelectBox
  var UiSelectBox = function (target, option) {
    var _ = this;
    var $select = $(target).eq(0);

    _.className = {
      wrap: 'uiselectbox',
      box: 'uiselectbox__box',
      head: 'uiselectbox__head',
      text: 'uiselectbox__text',
      opener: 'uiselectbox__opener',
      layer: 'uiselectbox__layer',
      contents: 'uiselectbox__contents',
      list: 'uiselectbox__list',
      item: 'uiselectbox__item',
      option: 'uiselectbox__option',
      disabled: 'uiselectbox--disabled',
      selected: 'uiselectbox__option--selected',
      hover: 'uiselectbox__option--hover',
    };
    _.options = option;
    _.select = $select;
    _.value = $select.val();

    if (Boolean(window.MutationObserver)) {
      _.init();
      _.on();
    }
  };
  $.extend(UiSelectBox.prototype, {
    init: function () {
      var _ = this;

      _.hashCode = uiGetHashCode();

      _.createInit();

      _.box.uiDropDown({
        opener: _.opener,
        layer: _.layer,
      });

      _.setAttr();
      _.setSelected();
    },
    on: function () {
      var _ = this;
      var selectEl = _.select.get(0);

      _.optionObserver = new MutationObserver(function (mutations) {
        _.createItems();
      });
      _.optionObserver.observe(selectEl, {
        childList: true,
      });

      _.attrObserver = new MutationObserver(function (mutations) {
        _.setAttr();
      });
      _.attrObserver.observe(selectEl, {
        attributes: true,
      });

      _.select.on('change.uiSelectBox' + _.hashCode, function () {
        _.setSelected();
      });

      _.box.on('uiDropDownOpened.uiSelectBox' + _.hashCode, function () {
        var $selected = _.select.find('option:selected');
        var i = $selected.index();

        _.hover(i);
      });
    },
    createInit: function () {
      var _ = this;

      _.select.wrap('<div class="' + _.className.wrap + ' ' + _.options.customClassName + '"></div>');
      _.wrap = _.select.parent('.' + _.className.wrap);
      _.wrap.append(
        '<div class="' +
          _.className.box +
          '" aria-hidden="true"><div class="' +
          _.className.head +
          '"><div class="' +
          _.className.text +
          '"></div><div class="' +
          _.className.opener +
          '" tabindex="-1"></div></div><div class="' +
          _.className.layer +
          '"><div class="' +
          _.className.contents +
          '"><div class="' +
          _.className.list +
          '"></div></div></div></div>'
      );
      _.box = _.wrap.find('.' + _.className.box);
      _.head = _.wrap.find('.' + _.className.head);
      _.text = _.wrap.find('.' + _.className.text);
      _.opener = _.wrap.find('.' + _.className.opener);
      _.layer = _.wrap.find('.' + _.className.layer);
      _.contents = _.wrap.find('.' + _.className.contents);
      _.list = _.wrap.find('.' + _.className.list);

      _.createItems();
    },
    createItems: function () {
      var _ = this;
      var html = '';

      if (_.options && _.options.length) {
        _.options.off('click.uiSelectBox' + _.hashCode).off('mouseenter.uiSelectBox' + _.hashCode);
      }

      _.select.find('option').each(function () {
        var $this = $(this);
        var text = $this.text();

        html += '<div class="' + _.className.item + '"><div class="' + _.className.option + '" tabindex="-1">' + text + '</div></div>';
      });

      _.list.html(html);

      _.items = _.list.find('.' + _.className.item);
      _.options = _.list.find('.' + _.className.option);

      _.options
        .on('click.uiSelectBox' + _.hashCode, function () {
          _.change(_.options.index($(this)));
          _.box.uiDropDown('close');
        })
        .on('mouseenter.uiSelectBox' + _.hashCode, function () {
          _.hover(_.options.index($(this)));
        });
    },
    setAttr: function () {
      var _ = this;
      var title = _.select.attr('title');
      var isDisabled = _.select.is('[disabled]');

      _.box.attr('title', title);

      if (isDisabled) {
        _.wrap.addClass(_.className.disabled);
        _.opener.removeAttr('tabindex');
        _.box.uiDropDown('off');
      } else {
        _.wrap.removeClass(_.className.disabled);
        _.opener.attr('tabindex', '-1');
        _.box.uiDropDown('on');
      }
    },
    setSelected: function () {
      var _ = this;
      var $selected = _.select.find('option:selected');
      var i = $selected.index();

      _.options.removeClass(_.className.selected);
      _.options.eq(i).addClass(_.className.selected);
      _.text.text($selected.text());
    },
    change: function (i) {
      var _ = this;

      _.select.find('option').prop('selected', false).removeAttr('selected');
      _.select.find('option').eq(i).prop('selected', true).attr('selected', '');
      _.select.trigger('change');
    },
    hover: function (i) {
      var _ = this;

      _.options.removeClass(_.className.hover);
      _.options.eq(i).addClass(_.className.hover);
    },
    update: function () {
      var _ = this;

      _.createItems();
      _.setAttr();
      _.setSelected();
    },
  });
  $.fn.uiSelectBox = function (custom) {
    var defaultOption = {
      customClassName: '',
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
      var uiSelectBox = this.uiSelectBox;

      if (typeof custom === 'object' && !uiSelectBox) {
        options = $.extend({}, defaultOption, custom);
        this.uiSelectBox = new UiSelectBox(this, options);
      } else if (typeof custom === 'string' && uiSelectBox) {
        switch (custom) {
          case 'update':
            uiSelectBox.update();
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
    var $fixBar = $('.fix-top-wrap, .fix-bottom-wrap, .top-button-area');
    var scrollX = $('#wrap').scrollLeft() || $win.scrollLeft();

    $fixBar.css('margin-left', -scrollX);
  }

  // header scroll
  function headerScroll() {
    var $header = $('.header');
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

  // top button
  var topButton = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      var $btns = $root.find('.js-top-button');
      var $html = $('html');

      $btns.each(function () {
        var $this = $(this);
        var $boardTable = $this.closest('.board-table');
        var $scroller = $boardTable.length ? $boardTable.find('.board-table__tbody-scroller') : $html;

        topButton.update($this, $scroller);
      });
    },
    rootScroll: function () {
      var $btns = $('.js-top-button').filter(function () {
        var $this = $(this);
        var $boardTable = $this.closest('.board-table');

        if ($boardTable.length) {
          return false;
        } else {
          return true;
        }
      });
      var $html = $('html');

      $btns.each(function () {
        var $this = $(this);

        topButton.update($this, $html);
      });
    },
    uiScroll: function ($el) {
      var $scroller = $el.closest('.ui-scroller');
      var $btn = null;

      if ($scroller.hasClass('board-table__tbody-scroller')) {
        $btn = $scroller.closest('.board-table').find('.js-top-button');

        if ($btn.length) {
          topButton.update($btn, $scroller);
        }
      }
    },
    update: function ($btn, $scroller) {
      var timer = null;
      var simplebar = $scroller.data('simplebar');
      var scrollTop = 0;
      var $el = null;

      if ($scroller.is('html')) {
        $el = $scroller;
        scrollTop = $win.scrollTop();
      } else if (simplebar) {
        $el = $(simplebar.getScrollElement());
        scrollTop = $el.scrollTop();
      }

      if ($btn && $btn.length && $el && $el.length) {
        timer = $btn.data('topButtonTimer');

        clearTimeout(timer);

        if (scrollTop > 0) {
          timer = setTimeout(function () {
            clearTimeout(timer);
            $btn.removeAttr('aria-hidden').prop('inert', false).removeAttr('inert').removeAttr('tabindex').addClass('is-show').stop().animate(
              {
                opacity: 1,
              },
              300
            );
          }, 100);
        } else {
          timer = setTimeout(function () {
            clearTimeout(timer);
            $btn
              .attr('aria-hidden', 'true')
              .prop('inert', true)
              .attr('inert', '')
              .attr('tabindex', '-1')
              .stop()
              .animate(
                {
                  opacity: 0,
                },
                300,
                function () {
                  $btn.removeClass('is-show');
                }
              );
          }, 100);
        }

        $btn.data('topButtonTimer', timer);
      }
    },
    action: function ($btn) {
      var $html = $('html');
      var $boardTable = $btn.closest('.board-table');
      var $scroller = $boardTable.length ? $boardTable.find('.board-table__tbody-scroller') : $html;
      var $el = null;
      var simplebar = $scroller.data('simplebar');

      if ($scroller.is('html')) {
        $el = $scroller;
      } else if (simplebar) {
        $el = $(simplebar.getScrollElement());
      }

      if ($el && $el.length) {
        $el.stop().animate(
          {
            scrollTop: 0,
          },
          500,
          function () {
            hashScroll.updateLinkClass();
          }
        );

        if ($el.is('html')) {
          $el.attr('tabindex', '0').focus().removeAttr('tabindex');
        } else {
          $el.attr('tabindex', '0').focus();
        }
      }
    },
  };
  $doc.on('click.uiTopButton', '.js-top-button', function () {
    topButton.action($(this));
  });

  // board table
  var boardTable = {
    headScroll: function ($el) {
      var isCallback = $el.data('boardTableCallback');
      var isNative = typeof isCallback === 'boolean' ? !isCallback : true;
      var scrollLeft = 0;
      var $tbody = null;

      if (isNative) {
        $tbody = $el.siblings('.board-table__tbody').find('.board-table__tbody-scroller .simplebar-content-wrapper').eq(0);
        scrollLeft = $el.scrollLeft();

        $tbody.data('boardTableCallback', true).scrollLeft(scrollLeft);
      }

      $el.data('boardTableCallback', false);
    },
    bodyScroll: function ($el) {
      var isCallback = $el.data('boardTableCallback');
      var isNative = typeof isCallback === 'boolean' ? !isCallback : true;
      var $scroller = $el.closest('.ui-scroller');
      var scrollLeft = 0;
      var $thead = null;

      if ($scroller.hasClass('board-table__tbody-scroller') && isNative) {
        scrollLeft = $el.scrollLeft();
        $thead = $scroller.closest('.board-table__tbody').siblings('.board-table__thead');

        $thead.data('boardTableCallback', true).scrollLeft(scrollLeft);
      }

      $el.data('boardTableCallback', false);
    },
  };

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

  // maxlength
  var maxlength = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-maxlength]').each(function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var length = val.length;
      var max = Number($input.data('maxlength'));

      if (length > max) {
        val = val.substring(0, max);
        $input.val(val);
      }
    },
    on: function () {
      $doc.on('keyup.uiJSMaxlength focusin.uiJSMaxlength focusout.uiJSMaxlength', '[data-maxlength]', function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
  };
  maxlength.on();

  // text count
  var textCount = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-text-count]').each(function () {
        var $this = $(this);
        textCount.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var count = val.length;
      var $count = $($input.data('text-count'));

      $count.text(count);
    },
    on: function () {
      $doc.on('keyup.uiJSTextCount focusin.uiJSTextCount focusout.uiJSTextCount', '[data-text-count]', function () {
        var $this = $(this);
        textCount.update($this);
      });
    },
  };
  textCount.on();

  // file watch
  var fileWatch = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-file-watch]').each(function () {
        var $this = $(this);
        var val = $this.val();

        if (typeof val === 'string' && val.length) {
          fileWatch.update($this);
        }
      });
    },
    update: function ($input) {
      var name = $input.attr('data-file-watch');
      var $target = $('[data-file-watch-target="' + name + '"]');
      var val = $input.val();
      var match = null;

      if (typeof val === 'string' && val.length) {
        match = val.match(/[^\/\\]+$/);
        if (!(typeof match === null)) {
          val = match[0];
        }
        $input.addClass('is-inputed');
      } else {
        val = '';
        $input.removeClass('is-inputed');
      }

      $target.text(val);
    },
  };
  $doc.on('change.fileWatch', '[data-file-watch]', function () {
    fileWatch.update($(this));
  });

  // area disabled
  var areaDisabled = {
    className: {
      disabled: 'is-area-disabled',
    },
    selector: 'input, select, button, textarea, fieldset, optgroup, duet-date-picker',
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[type="checkbox"][data-area-disabled], [type="radio"][data-area-disabled]').each(function () {
        var $this = $(this);
        areaDisabled.eventCall($this);
      });
      $root.find('.js-area-disabled').each(function () {
        var $this = $(this);
        areaDisabled.selectUpdate($this);
      });
    },
    eventCall: function ($this) {
      var isRadio = $this.attr('type') === 'radio';
      var name = $this.attr('name');

      if (isRadio) {
        $('[name="' + name + '"]')
          .not($this)
          .each(function () {
            areaDisabled.update($(this));
          });
      }

      areaDisabled.update($this);
    },
    update: function ($input) {
      var target = $input.attr('data-area-disabled');
      var $sameInput = $('[data-area-disabled="' + target + '"]').not($input);
      var $target = $('[data-area-disabled-target="' + target + '"]');
      var selector = areaDisabled.selector;
      var isChecked = $input.is(':checked') || $sameInput.filter(':checked').length;

      if ($input.attr('data-area-disabled-type') === 'multi') {
        isChecked = $input.is(':checked') && $sameInput.length === $sameInput.filter(':checked').length;
      }

      if (isChecked) {
        $target.removeClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', false).removeAttr('disabled');
        }
        $target.find(selector).prop('disabled', false).removeAttr('disabled');
      } else {
        $target.addClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', true).attr('disabled', '');
        }
        $target.find(selector).prop('disabled', true).attr('disabled', '');
      }
    },
    selectUpdate: function ($select) {
      var $options = $select.find('option');
      var $selectedOption = $options.filter(':selected');
      var target = $selectedOption.attr('data-area-disabled');
      var $target = $('[data-area-disabled-target="' + target + '"]');
      var selector = areaDisabled.selector;

      $options.not($selectedOption).each(function () {
        var $this = $(this);
        var thisTarget = $this.attr('data-area-disabled');
        var $thisTarget = $('[data-area-disabled-target="' + thisTarget + '"]');

        if (thisTarget) {
          $thisTarget.addClass(areaDisabled.className.disabled);
          if ($thisTarget.is(selector)) {
            $thisTarget.prop('disabled', true).attr('disabled', '');
          }
          $thisTarget.find(selector).prop('disabled', true).attr('disabled', '');
        }
      });

      if (target) {
        $target.removeClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', false).removeAttr('disabled');
        }
        $target.find(selector).prop('disabled', false).removeAttr('disabled');
      }
    },
  };
  $doc
    .on('change.areaDisabled', '[type="checkbox"][data-area-disabled], [type="radio"][data-area-disabled]', function () {
      var $this = $(this);
      areaDisabled.eventCall($this);
    })
    .on('change.areaDisabled', '.js-area-disabled', function () {
      var $this = $(this);
      areaDisabled.selectUpdate($this);
    });

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

  // page class
  function pageClass() {
    var $html = $('html');

    function registerClass(pageClassName, className) {
      if ($('.' + pageClassName).length) {
        if (!$html.hasClass(className)) {
          $html.addClass(className);
        }
      } else {
        if ($html.hasClass(className)) {
          $html.removeClass(className);
        }
      }
    }

    registerClass('page-contents--error', 'error-page');
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
        var $video = $this.find('.main-section__visual-video video');

        if (!isBlocking && !$this.hasClass('is-in') && (checkPoint >= offsetTop || (checkPoint < offsetTop && scrollTop >= docH - winH))) {
          $this.addClass('is-in');

          if ($video.length) {
            setTimeout(function () {
              $video.get(0).play();
            }, 400);
          }
        }
      });
    },
  };

  // common js
  function uiJSCommon($root) {
    if (!$root) {
      $root = $doc;
    }

    pageClass();
    checkScrollbars();
    fixBarSet();
    loadingInit($root);
    checkboxTab.init($root);
    datePicker.init($root);
    textCount.init($root);
    fileWatch.init($root);
    areaDisabled.init($root);

    $root.find('.tooltip__block.js-ui-dropdown').each(function () {
      var $this = $(this);
      var align = $this.data('align');

      $this.uiDropDown({
        opener: '.js-ui-dropdown__opener',
        layer: '.js-ui-dropdown__layer',
        align: typeof align === 'string' ? align : 'center',
        defaultVertical: 'top',
      });
    });
    $root.find('.tooltip__block.js-ui-dropdown-hover').each(function () {
      var $this = $(this);
      var align = $this.data('align');

      $this.uiDropDown({
        event: 'hover',
        opener: '.js-ui-dropdown-hover__opener',
        layer: '.js-ui-dropdown-hover__layer',
        align: typeof align === 'string' ? align : 'center',
        defaultVertical: 'top',
      });
    });
    $root.find('.js-ui-dropdown:not(.tooltip__block)').each(function () {
      var $this = $(this);
      var align = $this.data('align');

      if ($this.hasClass('ui-language')) {
        align = 'right';
      }

      $this.uiDropDown({
        opener: '.js-ui-dropdown__opener',
        layer: '.js-ui-dropdown__layer',
        align: typeof align === 'string' ? align : 'left',
      });
    });
    $root.find('.js-ui-dropdown-hover:not(.tooltip__block)').each(function () {
      var $this = $(this);
      var align = $this.data('align');

      if ($this.hasClass('ui-language')) {
        align = 'right';
      }

      $this.uiDropDown({
        opener: '.js-ui-dropdown-hover__opener',
        layer: '.js-ui-dropdown-hover__layer',
        align: typeof align === 'string' ? align : 'left',
      });
    });

    $root.find('.ui-select').uiSelectBox({
      customClassName: 'ui-select-custom',
    });

    $root.find('.ui-dropdown__contents, .uiselectbox__contents').addClass('ui-scroller');

    $root.find('.ui-scroller').simplebar({ autoHide: false });

    $root
      .find('.simplebar-content-wrapper')
      .off('scroll.uiJSCommon')
      .on('scroll.uiJSCommon', function () {
        topButton.uiScroll($(this));
        boardTable.bodyScroll($(this));
      });

    $root
      .find('.board-table__thead')
      .off('scroll.uiJSCommon')
      .on('scroll.uiJSCommon', function () {
        boardTable.headScroll($(this));
      });

    topButton.init($root);

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

    $root.find('.js-sortable').sortable({
      handle: '.js-sortable__handle',
      animation: 250,
      forceFallback: true,
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
  areaFocus('.ui-select-custom');
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
    .on('focus.inputDelete', 'input.ui-input, textarea.ui-input', function () {
      var $this = $(this);
      var $wrap = $this.closest('.ui-input-block');
      var isNoDelete = $wrap.hasClass('ui-input-block--no-delete');
      var type = $this.attr('type') || '';
      var isText = Boolean(type.match(/text|password|search|email|url|number|tel|date|time/)) || $this.is('textarea');
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
    .on('click.uiJSDropdown', '.js-ui-dropdown__closer', function () {
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
    })
    .on('uiDropDownOpened.uiJSDropdown', '.js-ui-dropdown, .uiselectbox__box', function () {
      var $this = $(this);
      var $scroller = $this.find('.ui-scroller');
      var timer = $this.data('uiJSPositionTimer');

      if (!Array.isArray(timer)) {
        timer = [];
      }

      if ($scroller.length) {
        clearTimeout(timer[0]);
        clearTimeout(timer[1]);
        timer[0] = setTimeout(function () {
          clearTimeout(timer[0]);
          $this.uiDropDown('update');
        }, 0);
        timer[1] = setTimeout(function () {
          clearTimeout(timer[1]);
          $this.uiDropDown('update');
        }, 100);
        $this.data('uiJSPositionTimer', timer);
      }
    });

  // layer opened scroll to start
  function layerOpenedScrollToStart($wrap) {
    var scroller = $wrap.find('.ui-scroller').data('simplebar');

    if (scroller) {
      scroller.recalculate();
      scroller.getScrollElement().scrollTop = 0;
      scroller.getScrollElement().scrollLeft = 0;
    }
  }
  $doc
    .on('layerOpened.layerOpenedScrollToStart', '.layer-wrap', function () {
      layerOpenedScrollToStart($(this));
    })
    .on('uiDropDownOpened.layerOpenedScrollToStart', '.js-ui-dropdown', function () {
      layerOpenedScrollToStart($(this));
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
    var timer = null;

    $inner.prepend($message);

    timer = setTimeout(function () {
      clearTimeout(timer);
      $message.addClass('is-show');

      timer = setTimeout(function () {
        clearTimeout(timer);
        $message.removeClass('is-show');

        timer = setTimeout(function () {
          clearTimeout(timer);
          $message.remove();
        }, 500);
      }, 3000);
    }, 100);
  }
  window.uiJSToastAlert = toastAlert;

  // gnb
  $doc
    .on('click.uiGNB', '.gnb__opener', function () {
      var $this = $(this);
      var $gnb = $this.closest('.gnb');

      if ($gnb.hasClass('is-expand')) {
        $gnb.removeClass('is-expand');
        $('.gnb__list').uiAccordion('allClose');
      } else {
        $gnb.addClass('is-expand');
      }
    })
    .on('mouseleave.uiGNB', '.gnb__body', function () {
      var $this = $(this);
      var $gnb = $this.closest('.gnb');

      $gnb.removeClass('is-hover');

      if (!$gnb.hasClass('is-expand')) {
        $('.gnb__list').uiAccordion('allClose');
      }
    })
    .on('mouseenter.uiGNB', '.gnb__body', function () {
      var $this = $(this);
      var $gnb = $this.closest('.gnb');

      $gnb.addClass('is-hover');
    });

  // notice layer
  $doc
    .on('layerOpened.uiNoticeLayer', '.notice-layer', function () {
      var $this = $(this);
      var $otherLayer = $('.notice-layer.js-layer-opened').not($this);

      $otherLayer.each(function () {
        uiLayer.close($(this).attr('data-layer'));
      });
    })
    .on('click.uiNoticeLayer', '.notice-layer', function (e) {
      e.stopPropagation();
    })
    .on('click.uiNoticeLayer', function () {
      var $layer = $('.notice-layer.js-layer-opened');

      $layer.each(function () {
        uiLayer.close($(this).attr('data-layer'));
      });
    });

  // map detail
  var mapDetail = {
    open: function () {
      var $detail = $('.map-detail');
      var timer = null;
      var scroller = $detail.find('.ui-scroller').data('simplebar');

      if (!$detail.hasClass('is-opened')) {
        $detail.stop().css('display', 'block');

        timer = setTimeout(function () {
          clearTimeout(timer);

          $detail
            .addClass('is-opened')
            .animate(
              {
                opacity: 1,
              },
              350
            )
            .trigger('mapDetailOpened');
        }, 0);
      }

      if (scroller) {
        scroller.recalculate();
        scroller.getScrollElement().scrollTop = 0;
        scroller.getScrollElement().scrollLeft = 0;
      }
    },
    close: function () {
      var $detail = $('.map-detail');

      if ($detail.hasClass('is-opened')) {
        $detail
          .stop()
          .removeClass('is-opened')
          .animate(
            {
              opacity: 0,
            },
            350,
            function () {
              $detail.css('display', 'none');
            }
          )
          .trigger('mapDetailClosed');
      }

      $('.map-pin').removeClass('is-selected');
    },
  };
  window.uiJSMapDetail = mapDetail;

  $doc.on('click.mapDetail', '.map-detail__close', function () {
    mapDetail.close();
  });

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

        html += '<button type="button" class="ui-button ui-basic-button ' + type + ' ' + triggerClassName + '">';
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

  // top button area
  function topButtonAreaScroll() {
    var $area = $('.top-button-area');

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

  // getOffsetTop
  function getOffsetTop($target, margin) {
    var $top = $('.fix-top-wrap');
    var $fixTopElements = $('.js-fix-top-element');
    var topH = $top.length ? $top.outerHeight() : 0;
    var offsetTop = $target.is(':visible') ? $target.offset().top : 0;
    var scrollTop = offsetTop - topH - (typeof margin === 'number' ? margin : 0);

    if ($fixTopElements.length) {
      $fixTopElements.each(function () {
        var $this = $(this);
        if (!$this.is(':visible')) {
          return;
        }
        scrollTop -= $this.outerHeight();
      });
    }

    return scrollTop;
  }

  // hash scroll
  var hashScroll = {
    classNames: {
      active: 'is-active',
      link: 'js-hash-scroll-link',
    },
    goToScroll: function (hash) {
      var $target = $(hash);
      var $html = $('html');
      var $scroller = $html;
      var offsetTop = getOffsetTop($target);
      var $links = $('.' + hashScroll.classNames.link);
      var $targetLink = $links.filter('[href="' + hash + '"]');

      $links.removeClass(hashScroll.classNames.active);
      $targetLink.addClass(hashScroll.classNames.active);
      $scroller.stop().animate(
        {
          scrollTop: offsetTop,
        },
        500,
        function () {
          $target.attr('tabindex', '-1').focus();
        }
      );
    },
    updateLinkClass: function () {
      var $html = $('html');
      var $scroller = $html;
      var $links = $('.' + hashScroll.classNames.link);

      if (!$links.length || $scroller.is(':animated') || !$links.eq(0).is(':visible')) {
        return;
      }

      var hashArray = [];
      var scrollTop = $win.scrollTop();
      var maxScrollTop = $('body').get(0).scrollHeight - $win.height();

      $links.each(function () {
        var hash = $(this).attr('href');

        if (hashArray.indexOf(hash) === -1) {
          hashArray.push(hash);
        }
      });

      if (!hashArray.length) {
        return;
      }

      $links.removeClass(hashScroll.classNames.active);

      $.each(hashArray, function (i, v) {
        var $target = $(v);

        if (!$target.length || $target.is(':hidden')) {
          return;
        }

        var offsetTop = getOffsetTop($target);
        var $targetLink = $links.filter('[href="' + v + '"]');

        if (scrollTop >= offsetTop - 1) {
          $links.removeClass(hashScroll.classNames.active);
          $targetLink.addClass(hashScroll.classNames.active);
        }
      });

      if (scrollTop >= maxScrollTop) {
        $links.removeClass(hashScroll.classNames.active);
        $links.filter('[href="' + hashArray[hashArray.length - 1] + '"]').addClass(hashScroll.classNames.active);
      }
    },
  };
  $doc.on('click.hashScroll', '.' + hashScroll.classNames.link, function (e) {
    hashScroll.goToScroll($(this).attr('href'));
  });

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
          '</style>'
      );
    }

    // IE11 CSS Variables Polyfill
    if (userAgentCheck.ieMode === 11) {
      $body.append('<script type="text/javascript" src="/desktop/lib/ie11-custom-properties/ie11CustomProperties.min.js"></script>');
    }

    // Edge class
    if (userAgentCheck.ieMode === 'edge') {
      $html.addClass('is-edge');
    }

    // none support backdrop class
    if (!Boolean($html.css('backdrop-filter'))) {
      $html.addClass('is-none-support-backdrop');
    }

    // init
    uiJSCommon();
    fixBarScroll();
    headerScroll();
    topButton.rootScroll();
    topButtonAreaScroll();
    hashScroll.updateLinkClass();

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
      topButton.rootScroll();
      topButtonAreaScroll();
      hashScroll.updateLinkClass();
      mainSection.scroll();
    })
    .on('resize.uiJS', function () {
      uiJSResize();
      fixBarScroll();
      headerScroll();
      topButton.rootScroll();
      topButtonAreaScroll();
      hashScroll.updateLinkClass();
      mainSection.scroll();
    })
    .on('orientationchange.uiJS', function () {
      uiJSResize();
      fixBarScroll();
      headerScroll();
      topButton.rootScroll();
      topButtonAreaScroll();
      hashScroll.updateLinkClass();
      mainSection.scroll();
    });
})(jQuery);
