import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {numberFormat} from 'highcharts'
import * as React from 'react'
import Chip from './Chip'
import PropTypes from 'prop-types'

const styles = theme =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    }
  })

const TitleBar = props => {
  const minFightLength = props.maxTime * (1 - props.varyCombatLength)
  const maxFightLength = props.maxTime * (1 + props.varyCombatLength)

  let fightLengthString = numberFormat(minFightLength, 0)

  if (minFightLength !== maxFightLength) {
    fightLengthString += ` - ${numberFormat(maxFightLength, 0)}`
  }

  return (
    <AppBar position='fixed' color='default' className={props.classes.appBar}>
      <Toolbar>
        <Typography variant='title' color='inherit'>
          SimulationCraft
          <Typography variant='caption' style={{display: 'inline-block'}}>
            {props.simcVersion} for {props.gameVersion} {props.wowVersion}.{
              props.buildLevel
            }
          </Typography>
        </Typography>
        <Grid container justify='flex-end' wrap='nowrap'>
          <Chip
            label='Timestamp'
            value={`${props.buildDate} ${props.buildTime}`}
          />
          <Chip label='Iterations' value={props.iterations} />
          <Chip label='Target Error' value={props.targetError} />
          <Chip label='Fight Length' value={fightLengthString} />
          <Chip label='Fight Style' value={props.fightStyle} />
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

TitleBar.propTypes = {
  buildDate: PropTypes.string,
  buildLevel: PropTypes.number,
  buildTime: PropTypes.string,
  fightStyle: PropTypes.string,
  gameVersion: PropTypes.string,
  iterations: PropTypes.number,
  maxTime: PropTypes.number,
  simcVersion: PropTypes.string,
  targetError: PropTypes.number,
  varyCombatLength: PropTypes.number,
  wowVersion: PropTypes.string
}

export default withStyles(styles)(TitleBar)
