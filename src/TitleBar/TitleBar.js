import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { numberFormat } from 'highcharts'
import PropTypes from 'prop-types'
import * as React from 'react'
import ChipOptions from './ChipOptions'

const styles = theme => createStyles({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  }
})

const buildFightLengthString = (maxTime, varyCombatLength) => {
  const minFightLength = maxTime * (1 - varyCombatLength)
  const maxFightLength = maxTime * (1 + varyCombatLength)

  let fightLength = numberFormat(minFightLength, 0)

  if (minFightLength !== maxFightLength) {
    fightLength += ` - ${numberFormat(maxFightLength, 0)}`
  }

  return fightLength
}

const TitleBar = (props) => {
  const {
    buildDate,
    buildLevel,
    buildTime,
    classes,
    fightStyle,
    gameVersion,
    iterations,
    maxTime,
    simcVersion,
    targetError,
    varyCombatLength,
    wowVersion
  } = props

  return (
    <AppBar
      className={classes.appBar}
      color='default'
      position='fixed'
    >
      <Toolbar>
        <Typography
          color='inherit'
          variant='title'
        >
          SimulationCraft

          <Typography
            style={{
              display: 'inline-block'
            }}
            variant='caption'
          >
            {simcVersion} for {gameVersion} {wowVersion}.{buildLevel}
          </Typography>
        </Typography>

        <Grid
          container
          justify='flex-end'
          wrap='nowrap'
        >
          <ChipOptions
            buildTimestamp={`${buildDate} ${buildTime}`}
            fightLength={buildFightLengthString(maxTime, varyCombatLength)}
            fightStyle={fightStyle}
            iterations={iterations}
            targetError={targetError}
          />
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

TitleBar.propTypes = {
  buildDate: PropTypes.string.isRequired,
  buildLevel: PropTypes.number.isRequired,
  buildTime: PropTypes.string.isRequired,
  fightStyle: PropTypes.string.isRequired,
  gameVersion: PropTypes.string.isRequired,
  iterations: PropTypes.number.isRequired,
  maxTime: PropTypes.number.isRequired,
  simcVersion: PropTypes.string.isRequired,
  targetError: PropTypes.number.isRequired,
  varyCombatLength: PropTypes.number.isRequired,
  wowVersion: PropTypes.string.isRequired
}

export default withStyles(styles)(TitleBar)
