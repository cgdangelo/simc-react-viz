import AppBar from '@material-ui/core/AppBar/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { ExpandMore } from '@material-ui/icons'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Chip from './Chip'
import registerServiceWorker from './registerServiceWorker'

// TODO: Remove when Highcharts is in.
const numberFormat = (n: any, ...args: any[]) => n.toLocaleString()

const reportData = require('./report.json') // tslint:disable-line no-var-requires

const theme = createMuiTheme({
  palette: {type: 'dark'},
  typography: {fontFamily: 'Roboto'},
})

const Report = (report: IJsonReport) => (
  <React.Fragment>
    <TitleBar
      buildDate={report.build_date}
      buildTime={report.build_time}
      fightStyle={report.sim.options.fight_style}
      iterations={report.sim.options.iterations}
      maxTime={report.sim.options.max_time}
      targetError={report.sim.options.target_error}
      varyCombatLength={report.sim.options.vary_combat_length}
    />

    <RaidSummary
      players={report.sim.players}
      raidDps={report.sim.statistics.raid_dps.mean}
      raidEvents={report.sim.raid_events}
      totalDamage={report.sim.statistics.total_dmg.mean}
    />
  </React.Fragment>
)

const TitleBar = (props: {
  buildDate: string
  buildTime: string
  fightStyle: string
  iterations: number
  maxTime: number
  targetError: number
  varyCombatLength: number
}) => {
  const minFightLength = props.maxTime * (1 - props.varyCombatLength)
  const maxFightLength = props.maxTime * (1 + props.varyCombatLength)

  let fightLengthString = numberFormat(minFightLength, 0)

  if (minFightLength !== maxFightLength) {
    fightLengthString += ` - ${numberFormat(maxFightLength, 0)}`
  }

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="title" color="inherit">SimulationCraft</Typography>
        <Grid container={true} justify="flex-end">
          <Chip label="Timestamp" value={`${props.buildDate} ${props.buildTime}`} />
          <Chip label="Iterations" value={props.iterations} />
          <Chip label="Target Error" value={props.targetError} />
          <Chip label="Fight Length" value={fightLengthString} />
          <Chip label="Fight Style" value={props.fightStyle} />
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

const RaidSummary = (props: {
  players: IActor[]
  raidDps: number
  raidEvents: IRaidEvent[]
  totalDamage: number
}) => (
  <ExpansionPanel defaultExpanded={true}>
    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
      <Typography variant="title">Raid Summary</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Chip label="Damage (Mean)" value={numberFormat(props.totalDamage, 0)} />
          <Chip label="DPS (Mean)" value={numberFormat(props.raidDps, 0)} />
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

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
