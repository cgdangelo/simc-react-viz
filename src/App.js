import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Grid from '@material-ui/core/Grid/Grid'
import * as React from 'react'
import Report from './Report'

class App extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      reportData: null
    }
  }

  async componentDidMount () {
    const reportData = window.reportData ? window.reportData : await import('./report.json')

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
        style={{
          height: '100vh',
          width: '100vw'
        }}
      >
        <CircularProgress
          color='secondary'
          size={200}
        />
      </Grid>
    )
  }
}

export default App
