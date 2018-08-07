import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import * as React from 'react'
import { getColorBySpecialization } from '../specializations'
import ChipMetrics from './ChipMetrics'
import StackedActorChart from './StackedActorChart'

const createSortedPlayerList = (players, accessor) => {
  const playersByProperty = players.map(player => ({
    name: player.name,
    color: getColorBySpecialization(player.specialization),
    y: typeof accessor === 'string' ? player[accessor] : accessor(player)
  }))

  playersByProperty.sort((a, b) => b.y - a.y)

  return playersByProperty
}

const RaidSummary = ({buildPriorityDpsChart, players, raidAps, raidDps, raidHps, totalAbsorb, totalHeal, totalDamage}) => {
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
  const playersByApmChart = <StackedActorChart title='Actions per Minute' series={{name: 'APM', data: playersByApm}} />

  const playersByDpsVariance = createSortedPlayerList(
    players,
    player =>
      (player.collected_data.dps.std_dev / player.collected_data.dps.mean) *
      100
  )
  const playersByDpsVarianceChart = <StackedActorChart
    title='DPS Variance Percentage'
    series={{
      name: 'Variance (%)',
      data: playersByDpsVariance,
      dataLabelPrecision: 2
    }}
  />

  const tanks = players.filter(player => player.role === 'tank')

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant='title'>Raid Summary</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <ChipMetrics
              raidAps={raidAps}
              raidDps={raidDps}
              raidHps={raidHps}
              totalAbsorb={totalAbsorb}
              totalDamage={totalDamage}
              totalHeal={totalHeal}
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
                <StackedActorChart
                  title='Damage Taken per Second'
                  series={{
                    name: 'DTPS',
                    data: createSortedPlayerList(
                      tanks,
                      player =>
                        player.collected_data.dtps &&
                        player.collected_data.dtps.mean /
                        player.collected_data.fight_length.mean
                    )
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <StackedActorChart
                  title='Heal & Absorb per Second'
                  series={{
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
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <StackedActorChart
                  title='Theck-Meloree Index'
                  series={{
                    name: 'TMI',
                    data: createSortedPlayerList(
                      tanks,
                      player =>
                        player.collected_data.effective_theck_meloree_index &&
                        player.collected_data.effective_theck_meloree_index.mean
                    )
                  }}
                />
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
