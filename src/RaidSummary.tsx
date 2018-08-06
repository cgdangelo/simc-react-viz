import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as React from 'react'
import Chip from './Chip'
import { getColorBySpecialization } from './specializations'

const { numberFormat } = Highcharts

interface ISpecializationLookupMap {
  [name: string]: ClassSpecialization
}

interface IActorBar {
  name: string
  color: string
  y: number
}

interface IActorBarChartBuilderOptions {
  title: string
  series: {
    name: string
    data: IActorBar[]
    dataLabelPrecision?: number
  }
  specLookup: ISpecializationLookupMap
}

const createSortedPlayerList = (players: IActor[], accessor: string | ((player: IActor) => any)): IActorBar[] => {
  const playersByProperty = players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: typeof accessor === 'string' ? player[accessor] : accessor(player)
  }))

  playersByProperty.sort((a, b) => b.y - a.y)

  return playersByProperty
}

const createStackedActorChart = (options: IActorBarChartBuilderOptions) => {
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
        formatter (this: any) {
          return `<span style='color: ${getColorBySpecialization(options.specLookup[this.value])}'>${this.value}</span>`
        }
      }
    },
    series: [{
      type: 'bar',
      name: options.title,
      data: options.series.data,
      dataLabels: {
        format: `{point.y:,.${options.series.dataLabelPrecision || 0}f}`
      }
    }]
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
  )
}

export interface IRaidSummaryProps {
  players: IActor[]
  raidDps: number
  totalDamage: number
  raidHps?: number
  totalHeal?: number
  raidAps?: number
  totalAbsorb?: number
  buildPriorityDpsChart: boolean
  raidEvents: IRaidEvent[]
}

const RaidSummary: React.SFC<IRaidSummaryProps> = props => {
  const specLookup: ISpecializationLookupMap = {}
  props.players.forEach(player => specLookup[player.name] = player.specialization)

  const playersByDps = createSortedPlayerList(props.players, player => (
    player.collected_data.dps.mean
  ))
  const playersByDpsChart = createStackedActorChart({
    title: 'Damage per Second',
    series: { name: 'DPS', data: playersByDps },
    specLookup
  })

  let playersByPriorityDpsChart

  if (props.buildPriorityDpsChart) {
    const playersByPriorityDps = createSortedPlayerList(props.players, player => player.collected_data.prioritydps && player.collected_data.prioritydps.mean)

    playersByPriorityDpsChart = createStackedActorChart({
      title: 'Priority Target/Boss Damage',
      series: { name: 'Priority DPS', data: playersByPriorityDps },
      specLookup
    })
  }

  const playersByApm = createSortedPlayerList(props.players, player => (
    player.collected_data.executed_foreground_actions.mean / player.collected_data.fight_length.mean * 60
  ))
  const playersByApmChart = createStackedActorChart({
    title: 'Actions per Minute',
    series: { name: 'APM', data: playersByApm },
    specLookup
  })

  const playersByDpsVariance = createSortedPlayerList(props.players, player => (
    player.collected_data.dps.std_dev / player.collected_data.dps.mean * 100
  ))
  const playersByDpsVarianceChart = createStackedActorChart({
    title: 'DPS Variance Percentage',
    series: { name: 'Variance (%)', data: playersByDpsVariance, dataLabelPrecision: 2 },
    specLookup
  })

  const tanks = props.players.filter(player => player.role === 'tank')

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant='title'>Raid Summary</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container={true} spacing={16}>
          <Grid item={true} xs={12}>
            <Chip label='DPS' value={numberFormat(props.raidDps, 0)} />
            <Chip label='Damage' value={numberFormat(props.totalDamage, 0)} />
            {props.raidHps && (
              <Chip label='HPS' value={numberFormat(props.raidHps, 0)} />
            )}
            {props.totalHeal && (
              <Chip label='Heals' value={numberFormat(props.totalHeal, 0)} />
            )}
            {props.raidAps && (
              <Chip label='APS' value={numberFormat(props.raidAps, 0)} />
            )}
            {props.totalAbsorb && (
              <Chip label='Absorbs' value={numberFormat(props.totalAbsorb, 0)} />
            )}
          </Grid>

          <Grid item={true} xs={playersByPriorityDpsChart ? 6 : 12}>
            {playersByDpsChart}
          </Grid>

          {playersByPriorityDpsChart && (
            <Grid item={true} xs={6}>
              {playersByPriorityDpsChart}
            </Grid>
          )}

          {tanks.length > 0 && (
            <>
              <Grid item={true} xs={4}>
                {createStackedActorChart({
                  title: 'Damage Taken per Second',
                  series: {
                    name: 'DTPS',
                    data: createSortedPlayerList(tanks, player => player.collected_data.dtps && player.collected_data.dtps.mean / player.collected_data.fight_length.mean)
                  },
                  specLookup
                })}
              </Grid>

              <Grid item={true} xs={4}>
                {createStackedActorChart({
                  title: 'Heal & Absorb per Second',
                  series: {
                    name: 'H&APS',
                    data: createSortedPlayerList(tanks, player => ((player.collected_data.hps && player.collected_data.hps.mean) || 0) + ((player.collected_data.aps && player.collected_data.aps.mean) || 0))
                  },
                  specLookup
                })}
              </Grid>

              <Grid item={true} xs={4}>
                {createStackedActorChart({
                  title: 'Theck-Meloree Index',
                  series: {
                    name: 'TMI',
                    data: createSortedPlayerList(tanks, player => player.collected_data.effective_theck_meloree_index && player.collected_data.effective_theck_meloree_index.mean)
                  },
                  specLookup
                })}
              </Grid>
            </>
          )}
          <Grid item={true} xs={6}>
            {playersByApmChart}
          </Grid>

          <Grid item={true} xs={6}>
            {playersByDpsVarianceChart}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default RaidSummary
