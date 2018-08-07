import grey from '@material-ui/core/colors/grey'

export default {
  lang: {
    thousandsSep: ','
  },
  credits: {
    enabled: false
  },
  chart: {
    backgroundColor: grey[900],
    spacing: [25, 50, 25, 25],
    style: {
      fontFamily: 'Roboto'
    }
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    bar: {
      borderColor: 'transparent',
      pointPadding: 0.075,
      groupPadding: 0.075,
      dataLabels: {
        defer: false,
        inside: true,
        align: 'left',
        crop: false,
        enabled: true,
        format: '{point.y:,.0f}',
        y: 3,
        style: {
          fontSize: '1rem'
        }
      }
    },
    boxplot: {
      color: grey[50],
      fillColor: 'rgba(255, 255, 255, 0.15)',
      lineWidth: 2,
      whiskerLength: '50%'
    }
  },
  title: {
    style: {
      color: grey[50],
      fontWeight: 'bold'
    }
  },
  tooltip: {
    valueDecimals: 2
  },
  xAxis: {
    labels: {
      style: {
        color: grey[50],
        fontSize: '1rem'
      },
      y: 6
    },
    lineWidth: 0,
    tickLength: 0,
    gridLineColor: 'transparent'
  },
  yAxis: {
    gridLineColor: grey[800],
    title: null
  }
}
