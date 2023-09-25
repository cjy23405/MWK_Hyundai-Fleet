// chart-env.js

var UI_CHART = {};

// colors
UI_CHART.COLORS = {
  BLACK: '#000',
  BLACK_RGB: '0, 0, 0',

  WHITE: '#fff',
  WHITE_RGB: '255, 255, 255',

  PRIMARY: '#00bfa5',
  PRIMARY_RGB: '0, 191, 165',
  PRIMARY_GRAD_FROM: '#00bfa5',
  PRIMARY_GRAD_FROM_RGB: '0, 191, 165',
  PRIMARY_GRAD_TO: '#80dc84',
  PRIMARY_GRAD_TO_RGB: '128, 220, 132',
  PRIMARY_DARK: '#174f5a',
  PRIMARY_DARK_RGB: '23, 79, 90',
  PRIMARY_MEDIUM: '#107e84',
  PRIMARY_MEDIUM_RGB: '16, 126, 132',
  PRIMARY_LIGHT: '#5df2d6',
  PRIMARY_LIGHT_RGB: '93, 242, 214',

  SECONDARY: '#2979ff',
  SECONDARY_RGB: '41, 121, 255',
  SECONDARY_GRAD_FROM: '#2979ff',
  SECONDARY_GRAD_FROM_RGB: '41, 121, 255',
  SECONDARY_GRAD_TO: '#26c6da',
  SECONDARY_GRAD_TO_RGB: '38, 198, 218',
  SECONDARY_DARK: '#003c8f',
  SECONDARY_DARK_RGB: '0, 60, 143',
  SECONDARY_MEDIUM: '#0069c0',
  SECONDARY_MEDIUM_RGB: '0, 105, 192',
  SECONDARY_LIGHT: '#90caf9',
  SECONDARY_LIGHT_RGB: '144, 202, 249',

  TERTIARY: '#ff8a80',
  TERTIARY_RGB: '255, 138, 128',
  TERTIARY_GRAD_FROM: '#ff8a80',
  TERTIARY_GRAD_FROM_RGB: '255, 138, 128',
  TERTIARY_GRAD_TO: '#ea80fc',
  TERTIARY_GRAD_TO_RGB: '234, 128, 252',
  TERTIARY_DARK: '#773e52',
  TERTIARY_DARK_RGB: '119, 62, 82',
  TERTIARY_MEDIUM: '#bc5981',
  TERTIARY_MEDIUM_RGB: '188, 89, 129',
  TERTIARY_LIGHT: '#ffb2dd',
  TERTIARY_LIGHT_RGB: '255, 178, 221',

  QUATERNARY: '#f99e15',
  QUATERNARY_RGB: '249, 158, 21',
  QUATERNARY_GRAD_FROM: '#f99e15',
  QUATERNARY_GRAD_FROM_RGB: '249, 158, 21',
  QUATERNARY_GRAD_TO: '#ffbc69',
  QUATERNARY_GRAD_TO_RGB: '255, 188, 105',
  QUATERNARY_MEDIUM: '#af7925',
  QUATERNARY_MEDIUM_RGB: '175, 121, 37',

  ERROR: '#ff878d',
  ERROR_RGB: '255, 135, 141',

  PUSH: '#ff676e',
  PUSH_RGB: '255, 103, 110',

  STATUS_GOOD: '#4f9a94',
  STATUS_GOOD_RGB: '79, 154, 148',
  STATUS_NORMAL: '#5d99c6',
  STATUS_NORMAL_RGB: '93, 153, 198',
  STATUS_DANGER: '#bb848d',
  STATUS_DANGER_RGB: '187, 132, 141',
  STATUS_EMPHASIS: '#f77fa8',
  STATUS_EMPHASIS_RGB: '247, 127, 168',

  GRAY_50: '#eceff1',
  GRAY_50_RGB: '236, 239, 241',
  GRAY_100: '#cfd9de',
  GRAY_100_RGB: '207, 217, 222',
  GRAY_200: '#b0bec5',
  GRAY_200_RGB: '176, 190, 197',
  GRAY_300: '#90a4ae',
  GRAY_300_RGB: '144, 164, 174',
  GRAY_400: '#78909c',
  GRAY_400_RGB: '120, 144, 156',
  GRAY_500: '#607d8b',
  GRAY_500_RGB: '96, 125, 139',
  GRAY_600: '#546e7a',
  GRAY_600_RGB: '84, 110, 122',
  GRAY_700: '#455a64',
  GRAY_700_RGB: '69, 90, 100',
  GRAY_800: '#37474f',
  GRAY_800_RGB: '55, 71, 79',
  GRAY_900: '#263238',
  GRAY_900_RGB: '38, 50, 56',

  LINE_PRIMARY: 'rgba(255, 255, 255, 0.08)',
  LINE_SECONDARY: '#37474f',
  LINE_tertiary: 'rgba(55, 71, 79, 0.6)',

  BG_PRIMARY: '#1b2a34',
  BG_PRIMARY_RGB: '27, 42, 52',
  BG_SECONDARY: '#22313b',
  BG_SECONDARY_RGB: '34, 49, 59',
  BG_TERTIARY: '#1a252c',
  BG_TERTIARY_RGB: '26, 37, 44',
};

// color set
UI_CHART.COLOR_SET = {
  green: [
    UI_CHART.COLORS.PRIMARY_DARK,
    UI_CHART.COLORS.PRIMARY_MEDIUM,
    {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, UI_CHART.COLORS.PRIMARY_GRAD_TO],
        [1, UI_CHART.COLORS.PRIMARY_GRAD_FROM],
      ],
    },
  ],
  blue: [
    UI_CHART.COLORS.SECONDARY_DARK,
    UI_CHART.COLORS.SECONDARY_MEDIUM,
    {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, UI_CHART.COLORS.SECONDARY_GRAD_TO],
        [1, UI_CHART.COLORS.SECONDARY_GRAD_FROM],
      ],
    },
  ],
  red: [
    UI_CHART.COLORS.TERTIARY_DARK,
    UI_CHART.COLORS.TERTIARY_MEDIUM,
    {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, UI_CHART.COLORS.TERTIARY_GRAD_TO],
        [1, UI_CHART.COLORS.TERTIARY_GRAD_FROM],
      ],
    },
  ],
  gray: [
    UI_CHART.COLORS.GRAY_700,
    UI_CHART.COLORS.GRAY_500,
    {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, UI_CHART.COLORS.GRAY_200],
        [1, UI_CHART.COLORS.GRAY_400],
      ],
    },
  ],
};

$.each(UI_CHART.COLOR_SET, function (key, val) {
  var array = [];

  $.each(val, function () {
    if (this instanceof String || typeof this === 'string') {
      array.push(this + '');
    } else {
      array.push($.extend({}, this));
    }
  });

  array.reverse();

  UI_CHART.COLOR_SET[key + 'Reverse'] = array;
});

// number commas
UI_CHART.MAKE_COMMAS = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// tooltip
UI_CHART.TOOLTIP = function (customFormat) {
  if (!(typeof customFormat === 'object')) {
    customFormat = {};
  }

  var defaultFormat = {
    title: '{point.key}',
    key: '{series.name}',
    val: '{point.y}',
  };
  var format = $.extend({}, defaultFormat, customFormat);

  return {
    headerFormat: '<div class="chart-tooltip-title">' + format.title + '<div><dl class="chart-tooltip-list">',
    pointFormat: '<div class="chart-tooltip-item"><dt class="chart-tooltip-key">' + format.key + '</dt><dd class="chart-tooltip-val">' + format.val + '</dd></div>',
    footerFormat: '</dl>',
  };
};

// legend
UI_CHART.LEGEND = {
  TYPE_SAFE: function (unit) {
    return {
      backgroundColor: 'none',
      padding: 0,
      align: 'left',
      y: 30,
      symbolWidth: 8,
      symbolHeight: 8,
      reversed: true,
      useHTML: true,
      labelFormatter: function () {
        return '<span class="chart-legend-text">' + this.name + ' <span class="chart-legend-num">' + this.yData + '</span>' + unit + '</span>';
      },
    };
  },
};

// dataLabels
UI_CHART.DATAlABELS = {
  TYPE_BAR: function (unit) {
    return {
      enabled: true,
      inside: true,
      allowOverlap: true,
      align: 'left',
      verticalAlign: 'bottom',
      y: -16,
      x: 999999,
      useHTML: true,
      padding: 0,
      style: {
        color: UI_CHART.COLORS.WHITE,
        fontSize: '26px',
        lineHeight: '34px',
        fontWeight: '400',
      },
      formatter: function () {
        var y = this.y;

        if (this.series.name !== 'bg') {
          return '<span class="chart-data-labels">' + (y < 0 ? '-' : UI_CHART.MAKE_COMMAS(y)) + '<span class="chart-data-labels-unit">' + unit + '</span></span>';
        }
      },
    };
  },
};

// labels
UI_CHART.LABELS = {
  TYPE_BAR: {
    align: 'left',
    padding: 0,
    x: 0,
    y: -17,
    style: {
      color: UI_CHART.COLORS.GRAY_200,
      fontSize: '18px',
      lineHeight: '26px',
      whiteSpace: 'nowrap',
    },
  },
};

// global set
Highcharts.setOptions({
  chart: {
    backgroundColor: 'transparent',
    spacing: 0,
    marginTop: 56,
    style: {
      fontFamily: 'inherit',
      ltterSpcing: '-0.025em',
    },
  },
  title: {
    text: '',
  },
  legend: {
    floating: true,
    backgroundColor: 'rgba(' + UI_CHART.COLORS.WHITE_RGB + ', 0.04)',
    borderRadius: 4,
    margin: 0,
    padding: 11,
    align: 'right',
    verticalAlign: 'top',
    itemHoverStyle: {
      color: UI_CHART.COLORS.GRAY_200,
    },
    itemStyle: {
      color: UI_CHART.COLORS.GRAY_200,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '400',
      cursor: 'auto',
    },
    itemMarginTop: -3,
    symbolRadius: 4,
    symbolWidth: 16,
    symbolHeight: 16,
    symbolPadding: 4,
    itemDistance: 12,
  },
  tooltip: {
    shared: true,
    useHTML: true,
    shadow: false,
    padding: 10,
    borderRadius: 3,
    borderWidth: 0,
    backgroundColor: UI_CHART.COLORS.WHITE,
  },
  xAxis: {
    lineColor: UI_CHART.COLORS.GRAY_600,
    labels: {
      style: {
        color: UI_CHART.COLORS.GRAY_100,
        fontSize: '16px',
        lineHeight: '24px',
      },
    },
    padding: 0,
  },
  yAxis: {
    title: {
      text: '',
    },
    lineColor: UI_CHART.COLORS.GRAY_200,
    lineWidth: 1,
    gridLineColor: 'rgba(' + UI_CHART.COLORS.GRAY_800_RGB + ', 0.4)',
    tickPixelInterval: 50,
    labels: {
      style: {
        color: UI_CHART.COLORS.GRAY_200,
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
  },
  symbols: ['circle', 'square', 'diamond', 'triangle', 'triangle-down'],
  plotOptions: {
    // line
    line: {
      connectorAllowed: false,
      events: {
        legendItemClick: function () {
          return false;
        },
      },
      lineWidth: 1,
      states: {
        hover: {
          enabled: false,
        },
      },
      marker: {
        radius: 4,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },

    // column
    column: {
      events: {
        legendItemClick: function () {
          return false;
        },
      },
      pointWidth: 10,
      borderWidth: 0,
    },

    // bar
    bar: {
      events: {
        legendItemClick: function () {
          return false;
        },
      },
      enableMouseTracking: false,
      pointWidth: 10,
      borderWidth: 0,
    },

    // solidgauge
    solidgauge: {
      events: {
        legendItemClick: function () {
          return false;
        },
      },
      lineWidth: 0,
      dataLabels: {
        enabled: false,
      },
    },

    // area
    area: {
      events: {
        legendItemClick: function () {
          return false;
        },
      },
      states: {
        hover: {
          enabled: false,
        },
      },
      marker: {
        radius: 5,
        fillColor: UI_CHART.COLORS.WHITE,
        lineWidth: 2,
        lineColor: UI_CHART.COLORS.GRAY_200,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      lineWidth: 3,
      lineColor: UI_CHART.COLORS.PRIMARY_LIGHT,
      dashStyle: 'ShortDash',
      fillOpacity: 1,
      fillColor: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, 'rgba(65, 165, 180, 0.3)'],
          [1, 'rgba(65, 165, 180, 0)'],
        ],
      },
    },
  },
});
