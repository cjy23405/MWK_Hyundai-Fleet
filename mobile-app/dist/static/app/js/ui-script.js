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
    var $fixBar = $('.fix-top-wrap, .fix-bottom-wrap');
    var scrollX = $('#wrap').scrollLeft() || $win.scrollLeft();

    $fixBar.css('margin-left', -scrollX);
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

    registerClass('page-contents--calendar', 'calendar-page');
  }

  // common js
  function uiJSCommon($root) {
    if (!$root) {
      $root = $doc;
    }

    pageClass();
    checkScrollbars();
    fixBarSet();
  }
  window.uiJSCommon = uiJSCommon;

  // uiJSResize
  function uiJSResize() {
    fixBarSet();
  }
  window.uiJSResize = uiJSResize;

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

    // none support backdrop class
    if (!Boolean($html.css('backdrop-filter'))) {
      $html.addClass('is-none-support-backdrop');
    }

    // init
    uiJSCommon();
    fixBarScroll();

    // resize
    uiJSResize();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      uiJSResize();
    })
    .on('scroll.uiJS', function () {
      fixBarScroll();
    })
    .on('resize.uiJS', function () {
      uiJSResize();
      fixBarScroll();
    })
    .on('orientationchange', function () {
      uiJSResize();
      fixBarScroll();
    });
})(jQuery);
