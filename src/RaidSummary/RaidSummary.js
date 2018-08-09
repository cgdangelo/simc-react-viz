import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import { darken, fade } from '@material-ui/core/styles/colorManipulator'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import * as React from 'react'
import ChipMetrics from '../ChipMetrics'
import { getColorBySpecialization } from '../specializations'
import RaidEvents from './RaidEvents'
import StackedActorChart from './StackedActorChart'
import TankCharts from './TankCharts'

export const createSortedPlayerList = (players, accessor) => {
  const playersByProperty = players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: typeof accessor === 'string' ? player[accessor] : accessor(player)
  })).filter(player => player.y > 0)

  playersByProperty.sort((a, b) => b.y - a.y)

  return playersByProperty
}

const styles = createStyles({
  summaryContainer: {
    alignItems: 'center',
    margin: '0 !important'
  },
  heading: {
    flexBasis: '25%',
    flexShrink: 0
  }
})

const RaidSummary = ({buildPriorityDpsChart, classes, maxTime, players, raidAps, raidDps, raidEvents, raidHps, totalAbsorb, totalHeal, totalDamage}) => {
  // const playersByDps = createSortedPlayerList(players, player => player.collected_data.dps.mean)
  // const playersByDpsChart = <StackedActorChart title='Damage per Second' series={{name: 'DPS', data: playersByDps}} />
  const playersByMeanDps = [...players]

  playersByMeanDps.sort((a, b) => b.collected_data.dps.mean - a.collected_data.dps.mean)

  const playersByDpsChart = <HighchartsReact
    highcharts={Highcharts}
    options={{
      title: { text: 'Damage per Second' },
      chart: {
        height: Math.max(players.length * 50, 300)
      },
      xAxis: {
        categories: playersByMeanDps.map(player => player.name),
        labels: {
          formatter () {
            return `<span style='color: ${getColorBySpecialization(playersByMeanDps[this.pos].specialization)}'>${this.value}</span>`
          }
        }
      },
      series: [
        {
          type: 'bar',
          name: 'DPS',
          enableMouseTracking: false,
          data: playersByMeanDps.map(player => ({
            name: player.name,
            y: player.collected_data.dps.mean,
            color: getColorBySpecialization(player.specialization)
          }))
        },
        {
          tooltip: {
            pointFormat: `Maximum: <b>{point.high}</b><br/>Upper quartile: <b>{point.q3}</b><br/>Mean: <b>{point.mean:,.1f}</b><br/>Median: <b>{point.median}</b><br/>Lower quartile: <b>{point.q1}</b><br/>Minimum: <b>{point.low}</b><br/>`
          },
          type: 'boxplot',
          data: playersByMeanDps.map((player, x) => ({
            x,
            color: darken(getColorBySpecialization(player.specialization), 0.4),
            fillColor: fade(darken(getColorBySpecialization(player.specialization), 0.75), 0.5),
            low: player.collected_data.dps.min,
            high: player.collected_data.dps.max,
            mean: player.collected_data.dps.mean,
            median: player.collected_data.dps.median,
            q1: player.collected_data.dps.q1,
            q3: player.collected_data.dps.q3
          }))
        }
      ]
    }}
  />

  let playersByPriorityDpsChart

  if (buildPriorityDpsChart) {
    const playersByPriorityDps = createSortedPlayerList(players, player => player.collected_data.prioritydps.mean)

    playersByPriorityDpsChart = <StackedActorChart
      title='Priority Target Damage Per Second'
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

      <ExpansionPanelDetails>
        <Grid container spacing={24}>
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
