import { grey } from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import * as Highcharts from 'highcharts'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import Report from './Report'

const reportData = require('./report.json') // tslint:disable-line no-var-requires

Highcharts.setOptions({
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
})

const theme = createMuiTheme({
  palette: { type: 'dark' }
})

// @ts-ignore
window.report = reportData

ReactDOM.render(
  <>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Report report={reportData} />
    </MuiThemeProvider>
  </>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
