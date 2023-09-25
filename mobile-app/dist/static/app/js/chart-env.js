// chart-env.js

var UI_CHART = {};

// colors
UI_CHART.COLORS = {
  BLACK: '#000',
  BLACK_RGB: '0, 0, 0',

  WHITE: '#fff',
  WHITE_RGB: '255, 255, 255',

  PRIMARY: '#479eec',
  PRIMARY_RGB: '71, 158, 236',

  GRAY_PRIMARY: '#999',
  GRAY_PRIMARY_RGB: '153, 153, 153',
  GRAY_SECONDARY: '#666',
  GRAY_SECONDARY_RGB: '102, 102, 102',
  GRAY_TERTIARY: '#e0e0e0',
  GRAY_TERTIARY_RGB: '224, 224, 224',
  GRAY_QUATERNARY: '#aaa',
  GRAY_QUATERNARY_RGB: '170, 170, 170',
  GRAY_QUINARY: '#eee',
  GRAY_QUINARY_RGB: '238, 238, 238',

  LINE_PRIMARY: '#dcdcdc',
  LINE_SECONDARY: '#e1e1e2',

  BG_PRIMARY: '#fafafa',
  BG_PRIMARY_RGB: '250, 250, 250',
  BG_SECONDARY: '#f8f8f9',
  BG_SECONDARY_RGB: '248, 248, 249',
};

// global set
Highcharts.setOptions({
  chart: {
    backgroundColor: 'transparent',
    spacing: 0,
    style: {
      fontFamily: 'inherit',
      ltterSpcing: '-0.025em',
    },
    events: {
      load: function () {
        var height = this.chartHeight - this.plotHeight + 122;

        this.setSize(null, height, 0);
      },
    },
  },
  title: {
    text: '',
  },
  legend: {
    backgroundColor: 'transparent',
    margin: 24,
    padding: 0,
    align: 'right',
    verticalAlign: 'top',
    itemHoverStyle: {
      color: UI_CHART.COLORS.BLACK,
    },
    itemStyle: {
      color: UI_CHART.COLORS.BLACK,
      fontSize: '10px',
      lineHeight: '16px',
      fontWeight: '400',
      cursor: 'auto',
    },
    itemMarginTop: 0,
    itemMarginBottom: 4,
    symbolRadius: 4,
    symbolWidth: 9,
    symbolHeight: 9,
    symbolPadding: 2,
    itemDistance: 12,
  },
  tooltip: {
    enabled: false,
  },
  xAxis: {
    lineColor: UI_CHART.COLORS.LINE_SECONDARY,
    gridLineColor: UI_CHART.COLORS.LINE_SECONDARY,
    gridLineWidth: 1,
    tickmarkPlacement: 'on',
    labels: {
      useHTML: true,
      style: {
        color: UI_CHART.COLORS.GRAY_PRIMARY,
        fontSize: '10px',
        lineHeight: '16px',
        zIndex: 0,
      },
    },
  },
  yAxis: {
    title: {
      text: '',
    },
    visible: false,
  },
  symbols: ['circle', 'square', 'diamond', 'triangle', 'triangle-down'],
  plotOptions: {
    // spline
    spline: {
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
        lineWidth: 1,
        lineColor: UI_CHART.COLORS.WHITE,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      lineWidth: 2,
    },

    // areaspline
    areaspline: {
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
        lineWidth: 1,
        lineColor: UI_CHART.COLORS.WHITE,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      lineWidth: 0,
      fillOpacity: 1,
    },
  },
});
