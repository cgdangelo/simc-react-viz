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

const RaidSummary = (props: {
  players: IActor[]
  raidDps: number
  raidEvents: IRaidEvent[]
  totalDamage: number
}) => {
  const playersByDps = props.players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: player.collected_data.dps.mean,
  }))
  playersByDps.sort((a, b) => b.y - a.y)

  const playersByApm = props.players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: player.collected_data.executed_foreground_actions.mean / player.collected_data.fight_length.mean * 60,
  }))
  playersByApm.sort((a, b) => b.y - a.y)

  const playersByDpsVariance = props.players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: player.collected_data.dps.std_dev / player.collected_data.dps.mean * 100,
  }))
  playersByDpsVariance.sort((a, b) => b.y - a.y)

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
            <div style={{width: '100%', overflowX: 'hidden'}}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    height: props.players.length * 50,
                  },
                  title: {
                    text: 'Raid DPS',
                  },
                  xAxis: {
                    categories: playersByDps.map(player => player.name),
                  },
                  series: [{
                    type: 'bar',
                    name: 'DPS',
                    data: playersByDps,
                  }],
                }}
              />
            </div>
          </Grid>
          <Grid
            item={true}
            xs={6}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  height: props.players.length * 50,
                },
                title: {
                  text: 'Actions per Minute',
                },
                xAxis: {
                  categories: playersByApm.map(player => player.name),
                },
                series: [{
                  type: 'bar',
                  dataLabels: {
                    format: '{point.y:,.2f}',
                  },
                  name: 'APM',
                  data: playersByApm,
                }],
              }}
            />
          </Grid>
          <Grid
            item={true}
            xs={6}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  height: props.players.length * 50,
                },
                title: {
                  text: 'DPS Variance Percentage',
                },
                xAxis: {
                  categories: playersByDpsVariance.map(player => player.name),
                },
                series: [{
                  type: 'bar',
                  dataLabels: {
                    format: '{point.y:,.2f}',
                  },
                  name: 'Variance (%)',
                  data: playersByDpsVariance,
                }],
              }}
            />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default RaidSummary
