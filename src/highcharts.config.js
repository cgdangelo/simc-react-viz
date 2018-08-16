import grey from '@material-ui/core/colors/grey'

const localeNumber = new Intl.NumberFormat().formatToParts(1000.1)

export default {
  chart: {
    backgroundColor: grey[900],
    spacing: [25, 50, 25, 25],
    style: {
      fontFamily: 'Roboto'
    }
  },
  credits: {
    enabled: false
  },
  lang: {
    decimalPoint: localeNumber.find(part => part.type === 'decimal').value,
    thousandsSep: localeNumber.find(part => part.type === 'group').value
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    /* eslint-disable sort-keys */
    series: {
      animation: false,
      turboThreshold: 2000
    },
    /* eslint-enable sort-keys */

    areaspline: {
      fillOpacity: 0.25
    },
    bar: {
      borderColor: 'transparent',
      dataLabels: {
        align: 'left',
        crop: false,
        defer: false,
        enabled: true,
        format: '{point.y:,.0f}',
        inside: true,
        style: {
          fontSize: '1rem'
        },
        y: 3
      },
      groupPadding: 0.075,
      pointPadding: 0.075
    },
    boxplot: {
      medianWidth: 1,
      pointWidth: 25,
      whiskerWidth: 1
    },
    histogram: {
      binsNumber: 50,
      borderColor: '#000',
      tooltip: {
        pointFormat: '{point.x:.0f} to {point.x2:.0f}<br /><b>{series.name}</b>: {point.y}'
      }
    },
    pie: {
      center: ['50%', '50%'],
      dataLabels: {
        useHTML: true,
        style: {
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 'normal',
          textOverflow: 'none'
        }
      },
      minSize: 150
    },
    scatter: {
      enableMouseTracking: false,
      marker: {
        fillColor: 'transparent'
      }
    }
  },
  title: {
    style: {
      color: grey[50],
      fontWeight: 'bold'
    }
  },
  tooltip: {
    valueDecimals: 2,
    xDateFormat: '%M:%S'
  },
  xAxis: {
    dateTimeLabelFormats: {
      day: '%M:%S',
      millisecond: '%M:%S',
      minute: '%M:%S',
      second: '%M:%S'
    },
    gridLineColor: 'transparent',
    labels: {
      style: {
        fontSize: '1rem',
        whiteSpace: 'nowrap'
      },
      y: 5
    },
    lineWidth: 0,
    tickLength: 0
  },
  yAxis: {
    gridLineColor: grey[800],
    title: null
  }
}
