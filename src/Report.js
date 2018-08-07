/* tslint:disable jsx-no-multiline-js */
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import * as React from 'react'
import Navigation from './Navigation'
import PlayerPanel from './PlayerPanel'
import RaidSummary from './RaidSummary'
import TitleBar from './TitleBar'

const styles = theme =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      marginLeft: 300,
    },
  })

const Report = ({report, classes}) => {
  const versionUsed = report.sim.options.dbc.version_used
  const gameData = report.sim.options.dbc[versionUsed]
  const {
    raid_hps,
    total_heal,
    raid_aps,
    total_absorb,
  } = report.sim.statistics

  return (
    <React.Fragment>
      <TitleBar
        simcVersion={report.version}
        gameVersion={versionUsed}
        wowVersion={gameData.wow_version}
        buildLevel={gameData.build_level}
        buildDate={report.build_date}
        buildTime={report.build_time}
        fightStyle={report.sim.options.fight_style}
        iterations={report.sim.options.iterations}
        maxTime={report.sim.options.max_time}
        targetError={report.sim.options.target_error}
        varyCombatLength={report.sim.options.vary_combat_length}
      />

      <Navigation players={report.sim.players} />

      <main className={classes.content}>
        <div className={classes.toolbar} />

        <RaidSummary
          players={report.sim.players}
          raidDps={report.sim.statistics.raid_dps.mean}
          totalDamage={report.sim.statistics.total_dmg.mean}
          raidHps={raid_hps && raid_hps.mean}
          totalHeal={total_heal && total_heal.mean}
          raidAps={raid_aps && raid_aps.mean}
          totalAbsorb={total_absorb && total_absorb.mean}
          raidEvents={report.sim.raid_events}
          buildPriorityDpsChart={report.sim.targets.length > 1}
        />

        {report.sim.players.map(player => (
          <PlayerPanel
            key={player.name}
            confidence={report.sim.options.confidence_estimator}
            player={player}
          />
        ))}
      </main>
    </React.Fragment>
  )
}

export default withStyles(styles)(Report)
