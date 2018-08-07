import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import * as React from 'react'
import { getColorBySpecialization } from '../specializations'
import ChipMetrics from './ChipMetrics'

const createSortedPlayerList = (players, accessor) => {
  const playersByProperty = players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: typeof accessor === 'string' ? player[accessor] : accessor(player)
  }))

  playersByProperty.sort((a, b) => b.y - a.y)

  return playersByProperty
}

const createStackedActorChart = options => {
  const chartOptions = {
    chart: {
      height: Math.max(options.series.data.length * 50, 300)
    },
    title: {
      text: options.title
    },
    xAxis: {
      categories: options.series.data.map(bar => bar.name),
      labels: {
        formatter () {
          return `<span style='color: ${getColorBySpecialization(
            options.specLookup[this.value]
          )}'>${this.value}</span>`
        }
      }
    },
    series: [
      {
        type: 'bar',
        name: options.title,
        data: options.series.data,
        dataLabels: {
          format: `{point.y:,.${options.series.dataLabelPrecision || 0}f}`
        }
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

const RaidSummary = props => {
  const specLookup = {}
  props.players.forEach(
    player => (specLookup[player.name] = player.specialization)
  )

  const playersByDps = createSortedPlayerList(
    props.players,
    player => player.collected_data.dps.mean
  )
  const playersByDpsChart = createStackedActorChart({
    title: 'Damage per Second',
    series: {name: 'DPS', data: playersByDps},
    specLookup
  })

  let playersByPriorityDpsChart

  if (props.buildPriorityDpsChart) {
    const playersByPriorityDps = createSortedPlayerList(
      props.players,
      player =>
        player.collected_data.prioritydps &&
        player.collected_data.prioritydps.mean
    )

    playersByPriorityDpsChart = createStackedActorChart({
      title: 'Priority Target/Boss Damage',
      series: {name: 'Priority DPS', data: playersByPriorityDps},
      specLookup
    })
  }

  const playersByApm = createSortedPlayerList(
    props.players,
    player =>
      (player.collected_data.executed_foreground_actions.mean /
        player.collected_data.fight_length.mean) *
      60
  )
  const playersByApmChart = createStackedActorChart({
    title: 'Actions per Minute',
    series: {name: 'APM', data: playersByApm},
    specLookup
  })

  const playersByDpsVariance = createSortedPlayerList(
    props.players,
    player =>
      (player.collected_data.dps.std_dev / player.collected_data.dps.mean) *
      100
  )
  const playersByDpsVarianceChart = createStackedActorChart({
    title: 'DPS Variance Percentage',
    series: {
      name: 'Variance (%)',
      data: playersByDpsVariance,
      dataLabelPrecision: 2
    },
    specLookup
  })

  const tanks = props.players.filter(player => player.role === 'tank')

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant='title'>Raid Summary</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <ChipMetrics
              raidAps={props.raidAps}
              raidDps={props.raidDps}
              raidHps={props.raidHps}
              totalAbsorb={props.totalAbsorb}
              totalDamage={props.totalDamage}
              totalHeal={props.totalHeal}
            />
          </Grid>

          <Grid item xs={playersByPriorityDpsChart ? 6 : 12}>
            {playersByDpsChart}
          </Grid>

          {playersByPriorityDpsChart && (
            <Grid item xs={6}>
              {playersByPriorityDpsChart}
            </Grid>
          )}

          {tanks.length > 0 && (
            <React.Fragment>
              <Grid item xs={4}>
                {createStackedActorChart({
                  title: 'Damage Taken per Second',
                  series: {
                    name: 'DTPS',
                    data: createSortedPlayerList(
                      tanks,
                      player =>
                        player.collected_data.dtps &&
                        player.collected_data.dtps.mean /
                        player.collected_data.fight_length.mean
                    )
                  },
                  specLookup
                })}
              </Grid>

              <Grid item xs={4}>
                {createStackedActorChart({
                  title: 'Heal & Absorb per Second',
                  series: {
                    name: 'H&APS',
                    data: createSortedPlayerList(
                      tanks,
                      player =>
                        ((player.collected_data.hps &&
                          player.collected_data.hps.mean) ||
                          0) +
                        ((player.collected_data.aps &&
                          player.collected_data.aps.mean) ||
                          0)
                    )
                  },
                  specLookup
                })}
              </Grid>

              <Grid item xs={4}>
                {createStackedActorChart({
                  title: 'Theck-Meloree Index',
                  series: {
                    name: 'TMI',
                    data: createSortedPlayerList(
                      tanks,
                      player =>
                        player.collected_data.effective_theck_meloree_index &&
                        player.collected_data.effective_theck_meloree_index.mean
                    )
                  },
                  specLookup
                })}
              </Grid>
            </React.Fragment>
          )}

          <Grid item xs={6}>
            {playersByApmChart}
          </Grid>

          <Grid item xs={6}>
            {playersByDpsVarianceChart}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

RaidSummary.propTypes = {
  buildPriorityDpsChart: PropTypes.bool,
  players: PropTypes.arrayOf(PropTypes.object),
  raidAps: PropTypes.number,
  raidDps: PropTypes.number,
  raidHps: PropTypes.number,
  totalAbsorb: PropTypes.number,
  totalDamage: PropTypes.number,
  totalHeal: PropTypes.number
}

export default RaidSummary
