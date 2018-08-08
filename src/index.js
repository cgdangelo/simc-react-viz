import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import * as Highcharts from 'highcharts'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import highchartsConfig from './highcharts.config'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

Highcharts.setOptions(highchartsConfig)
require('highcharts/modules/xrange')(Highcharts)

const theme = createMuiTheme({
  palette: {type: 'dark'}
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker()
