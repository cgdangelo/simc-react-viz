import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Grid from '@material-ui/core/Grid/Grid'
import * as React from 'react'
import Report from './Report'

class App extends React.PureComponent {
  constructor () {
    super()

    this.state = {reportData: null}
  }

  componentDidMount () {
    const reportData = require('./report.json')

    this.setState({reportData})
  }

  render () {
    if (this.state.reportData) {
      return <Report report={this.state.reportData} />
    }

    return (
      <Grid
        container
        alignItems='center'
        justify='center'
        style={{height: '100vh', width: '100vw'}}
      >
        <CircularProgress size={200} color='secondary' />
      </Grid>
    )
  }
}

export default App
