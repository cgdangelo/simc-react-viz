import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Highcharts from 'highcharts'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import Report from './Report'

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
})

const reportData = require('./report.json') // tslint:disable-line no-var-requires

const theme = createMuiTheme({
  palette: {type: 'dark'},
  typography: {fontFamily: 'Roboto'},
})

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <MuiThemeProvider theme={theme}>
      <Report {...reportData} />
    </MuiThemeProvider>
  </React.Fragment>,
  document.getElementById('root') as HTMLElement,
)
registerServiceWorker()
