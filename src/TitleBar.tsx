import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {numberFormat} from 'highcharts'
import * as React from 'react'
import Chip from './Chip'

function TitleBar(props: {
  simcVersion: string
  gameVersion: string
  wowVersion: string
  buildLevel: string
  buildDate: string
  buildTime: string
  fightStyle: string
  iterations: number
  maxTime: number
  targetError: number
  varyCombatLength: number
}) {
  const minFightLength = props.maxTime * (1 - props.varyCombatLength)
  const maxFightLength = props.maxTime * (1 + props.varyCombatLength)

  let fightLengthString = numberFormat(minFightLength, 0)

  if (minFightLength !== maxFightLength) {
    fightLengthString += ` - ${numberFormat(maxFightLength, 0)}`
  }

  return (
    <AppBar
      position="static"
      color="default"
    >
      <Toolbar>
        <Typography
          variant="title"
          color="inherit"
        >
          SimulationCraft
          <Typography
            variant="caption"
            style={{display: 'inline-block'}}
          >
            {props.simcVersion} for {props.gameVersion} {props.wowVersion}.{props.buildLevel}
          </Typography>
        </Typography>
        <Grid
          container={true}
          justify="flex-end"
        >
          <Chip
            label="Timestamp"
            value={`${props.buildDate} ${props.buildTime}`}
          />
          <Chip
            label="Iterations"
            value={props.iterations}
          />
          <Chip
            label="Target Error"
            value={props.targetError}
          />
          <Chip
            label="Fight Length"
            value={fightLengthString}
          />
          <Chip
            label="Fight Style"
            value={props.fightStyle}
          />
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default TitleBar
