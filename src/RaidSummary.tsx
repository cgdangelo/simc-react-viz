import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Highcharts, {numberFormat} from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as React from 'react'
import Chip from './Chip'
import {getColorBySpecialization} from './specializations'

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

function createSortedPlayerList(players: IActor[], accessor: string | ((player: IActor) => any)): IActorBar[] {
  const playersByProperty = players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: typeof accessor === 'string' ? player[accessor] : accessor(player),
  }))

  playersByProperty.sort((a, b) => b.y - a.y)

  return playersByProperty
}

function createStackedActorChart(options: IActorBarChartBuilderOptions) {
  const {series: {data: bars}} = options

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          height: bars.length * 50,
        },
        title: {
          text: options.title,
        },
        xAxis: {
          categories: bars.map(bar => bar.name),
          labels: {
            formatter(this: any) {
              return `<span style="color: ${getColorBySpecialization(options.specLookup[this.value])}">${this.value}</span>`
            },
          },
        },
        series: [{
          type: 'bar',
          name: options.title,
          data: bars,
          dataLabels: {
            format: `{point.y:,.${options.series.dataLabelPrecision || 0}f}`,
          },
        }],
      }}
    />
  )
}

const RaidSummary = (props: {
  players: IActor[]
  raidDps: number
  raidEvents: IRaidEvent[]
  totalDamage: number
}) => {
  const playersByDps = createSortedPlayerList(props.players, (player) => (
    player.collected_data.dps.mean
  ))
  const playersByApm = createSortedPlayerList(props.players, (player) => (
    player.collected_data.executed_foreground_actions.mean / player.collected_data.fight_length.mean * 60
  ))
  const playersByDpsVariance = createSortedPlayerList(props.players, (player) => (
    player.collected_data.dps.std_dev / player.collected_data.dps.mean * 100
  ))

  const specLookup: ISpecializationLookupMap = {}

  props.players.forEach(player => specLookup[player.name] = player.specialization)

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="title">Raid Summary</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid
          container={true}
          spacing={16}
        >
          <Grid
            item={true}
            xs={12}
          >
            <Chip
              label="DPS (Mean)"
              value={numberFormat(props.raidDps, 0)}
            />
            <Chip
              label="Damage (Mean)"
              value={numberFormat(props.totalDamage, 0)}
            />
          </Grid>
          <Grid
            item={true}
            xs={12}
          >
            {createStackedActorChart({
              title: 'Damage per Second',
              series: {name: 'DPS', data: playersByDps},
              specLookup,
            })}
          </Grid>
          <Grid
            item={true}
            xs={6}
          >
            {createStackedActorChart({
              title: 'Actions per Minute',
              series: {name: 'APM', data: playersByApm},
              specLookup,
            })}
          </Grid>
          <Grid
            item={true}
            xs={6}
          >
            {createStackedActorChart({
              title: 'DPS Variance Percentage',
              series: {name: 'Variance (%)', data: playersByDpsVariance, dataLabelPrecision: 2},
              specLookup,
            })}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default RaidSummary
