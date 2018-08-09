import Divider from '@material-ui/core/Divider/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import * as React from 'react'
import { getColorBySpecialization } from '../specializations'
import ChipMetrics from '../ChipMetrics'
import RaidEvents from './RaidEvents'
import StackedActorChart from './StackedActorChart'
import TankCharts from './TankCharts'

export const createSortedPlayerList = (players, accessor) => {
  const playersByProperty = players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: typeof accessor === 'string' ? player[accessor] : accessor(player)
  }))

  playersByProperty.sort((a, b) => b.y - a.y)

  return playersByProperty
}

const styles = theme => createStyles({
  summaryContainer: {
    alignItems: 'center',
    margin: '0 !important'
  },
  heading: {
    flexBasis: '25%',
    flexShrink: 0
  },
  raidDetails: {
    padding: theme.spacing.unit * 3
  }
})

const RaidSummary = ({buildPriorityDpsChart, classes, maxTime, players, raidAps, raidDps, raidEvents, raidHps, totalAbsorb, totalHeal, totalDamage}) => {
  const playersByDps = createSortedPlayerList(players, player => player.collected_data.dps.mean)
  const playersByDpsChart = <StackedActorChart title='Damage per Second' series={{name: 'DPS', data: playersByDps}} />

  let playersByPriorityDpsChart

  if (buildPriorityDpsChart) {
    const playersByPriorityDps = createSortedPlayerList(players, player => player.collected_data.prioritydps.mean)

    playersByPriorityDpsChart = <StackedActorChart
      title='Priority Target/Boss Damage'
      series={{name: 'Priority DPS', data: playersByPriorityDps}}
    />
  }

  const playersByApm = createSortedPlayerList(
    players,
    player => (player.collected_data.executed_foreground_actions.mean / player.collected_data.fight_length.mean) * 60
  )
  const playersByApmChart = <StackedActorChart
    title='Actions per Minute'
    series={{name: 'APM', data: playersByApm, precision: 2}}
  />

  const playersByDpsVariance = createSortedPlayerList(
    players,
    player => (player.collected_data.dps.std_dev / player.collected_data.dps.mean) * 100
  )
  const playersByDpsVarianceChart = <StackedActorChart
    title='DPS Variance Percentage'
    series={{name: 'Variance (%)', data: playersByDpsVariance, precision: 2}}
  />

  const tanks = players.filter(player => player.role === 'tank')

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        classes={{content: classes.summaryContainer}}
      >
        <Typography
          variant='title'
          className={classes.heading}
        >
          Raid Summary
        </Typography>

        <div>
          <ChipMetrics
            aps={raidAps}
            dps={raidDps}
            hps={raidHps}
            totalAbsorb={totalAbsorb}
            totalDamage={totalDamage}
            totalHeal={totalHeal}
          />
        </div>
      </ExpansionPanelSummary>

      <Divider />

      <ExpansionPanelDetails className={classes.raidDetails}>
        <Grid container spacing={16}>
          <Grid item xs={playersByPriorityDpsChart ? 6 : 12}>
            {playersByDpsChart}
          </Grid>

          {playersByPriorityDpsChart && (
            <Grid item xs={6}>
              {playersByPriorityDpsChart}
            </Grid>
          )}

          {tanks.length > 0 && <TankCharts players={tanks} />}

          {playersByApmChart && (
            <Grid item xs={6}>
              {playersByApmChart}
            </Grid>
          )}

          {playersByDpsVarianceChart && (
            <Grid item xs={6}>
              {playersByDpsVarianceChart}
            </Grid>
          )}

          <Grid item xs={12}>
            <RaidEvents events={raidEvents} maxTime={maxTime} />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

RaidSummary.propTypes = {
  buildPriorityDpsChart: PropTypes.bool,
  maxTime: PropTypes.number.isRequired,
  players: PropTypes.arrayOf(PropTypes.object),
  raidAps: PropTypes.number,
  raidDps: PropTypes.number,
  raidEvents: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    first: PropTypes.number,
    last: PropTypes.number,
    cooldown: PropTypes.number,
    cooldown_min: PropTypes.number,
    cooldown_max: PropTypes.number,
    duration: PropTypes.number,
    duration_min: PropTypes.number,
    duration_max: PropTypes.number,
    saved_duration: PropTypes.number
  })),
  raidHps: PropTypes.number,
  totalAbsorb: PropTypes.number,
  totalDamage: PropTypes.number,
  totalHeal: PropTypes.number
}

export default withStyles(styles)(RaidSummary)
