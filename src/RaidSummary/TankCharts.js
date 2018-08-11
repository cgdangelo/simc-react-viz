import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import * as React from 'react'
import { getFilledCollectedDataContainer } from '../PlayerPanel'
import { createSortedPlayerList } from './RaidSummary'
import StackedActorChart from './StackedActorChart'

const TankCharts = ({players}) => (
  <React.Fragment>
    <Grid item xs={4}>
      <StackedActorChart
        series={{
          name: 'DTPS',
          data: createSortedPlayerList(
            players,
            player => getFilledCollectedDataContainer(player, 'dmg_taken').mean / getFilledCollectedDataContainer(player, 'fight_length').mean
          )
        }}
        title='Damage Taken per Second'
      />
    </Grid>

    <Grid item xs={4}>
      <StackedActorChart
        series={{
          name: 'H&APS',
          data: createSortedPlayerList(
            players,
            player => getFilledCollectedDataContainer(player, 'hps').mean + getFilledCollectedDataContainer(player, 'aps').mean
          )
        }}
        title='Heal & Absorb per Second'
      />
    </Grid>

    <Grid item xs={4}>
      <StackedActorChart
        series={{
          name: 'TMI',
          data: createSortedPlayerList(
            players,
            player => getFilledCollectedDataContainer(player, 'theck_meloree_index').mean
          )
        }}
        title='Theck-Meloree Index'
      />
    </Grid>
  </React.Fragment>
)

TankCharts.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TankCharts
