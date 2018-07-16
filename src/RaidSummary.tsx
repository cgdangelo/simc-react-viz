import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Highcharts, { numberFormat } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as React from 'react'
import Chip from './Chip'

const RaidSummary = (props: {
  players: IActor[]
  raidDps: number
  raidEvents: IRaidEvent[]
  totalDamage: number
}) => {
  const playersByDps = props.players.map(player => ({name: player.name, y: player.collected_data.dps.mean}))
  playersByDps.sort((a, b) => b.y - a.y)

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
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                title: {
                  text: 'Raid DPS',
                },
                xAxis: {
                  categories: playersByDps.map(player => player.name),
                },
                series: [{
                  type: 'bar',
                  name: 'Damage per second',
                  data: playersByDps,
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
