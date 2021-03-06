import grey from '@material-ui/core/colors/grey'
import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import * as Highcharts from 'highcharts'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import highchartsConfig from './highcharts.config'
import registerServiceWorker from './registerServiceWorker'

require('highcharts/highcharts-more')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/modules/histogram-bellcurve')(Highcharts)

Highcharts.setOptions(highchartsConfig)

const theme = createMuiTheme({
  overrides: {
    MuiTableHead: {
      root: {
        backgroundColor: grey[900]
      }
    }
  },
  palette: {
    type: 'dark'
  },
  props: {
    MuiExpansionPanel: {
      elevation: 6
    },
    MuiPaper: {
      elevation: 6
    }
  }
})

ReactDOM.render((
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>
), document.getElementById('root'))

registerServiceWorker()
