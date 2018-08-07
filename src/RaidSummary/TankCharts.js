import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import * as React from 'react'
import { createSortedPlayerList } from './RaidSummary'
import StackedActorChart from './StackedActorChart'

const TankCharts = ({players}) => (
  <React.Fragment>
    <Grid item xs={4}>
      <StackedActorChart
        title='Damage Taken per Second'
        series={{
          name: 'DTPS',
          data: createSortedPlayerList(players, player => player.collected_data.dtps.mean / player.collected_data.fight_length.mean)
        }}
      />
    </Grid>

    <Grid item xs={4}>
      <StackedActorChart
        title='Heal & Absorb per Second'
        series={{
          name: 'H&APS',
          data: createSortedPlayerList(
            players,
            player =>
              ((player.collected_data.hps && player.collected_data.hps.mean) || 0) +
              ((player.collected_data.aps && player.collected_data.aps.mean) || 0)
          )
        }}
      />
    </Grid>

    <Grid item xs={4}>
      <StackedActorChart
        title='Theck-Meloree Index'
        series={{
          name: 'TMI',
          data: createSortedPlayerList(players, player => player.collected_data.effective_theck_meloree_index.mean)
        }}
      />
    </Grid>
  </React.Fragment>
)

TankCharts.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TankCharts
