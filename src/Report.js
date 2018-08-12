import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import * as React from 'react'
import PlayerPanel from './PlayerPanel'
import RaidSummary from './RaidSummary'
import TitleBar from './TitleBar'

const styles = theme => createStyles({
  toolbar: theme.mixins.toolbar
})

const Report = ({report, classes}) => {
  const {
    raid_aps: raidAps,
    raid_hps: raidHps,
    total_absorb: totalAbsorb,
    total_heal: totalHeal
  } = report.sim.statistics

  const versionUsed = report.sim.options.dbc.version_used
  const gameData = report.sim.options.dbc[versionUsed]

  return (
    <React.Fragment>
      <TitleBar
        buildDate={report.build_date}
        buildLevel={gameData.build_level}
        buildTime={report.build_time}
        fightStyle={report.sim.options.fight_style}
        gameVersion={versionUsed}
        iterations={report.sim.options.iterations}
        maxTime={report.sim.options.max_time}
        simcVersion={report.version}
        targetError={report.sim.options.target_error}
        varyCombatLength={report.sim.options.vary_combat_length}
        wowVersion={gameData.wow_version}
      />

      <main className={classes.content}>
        <div className={classes.toolbar} />

        <RaidSummary
          buildPriorityDpsChart={report.sim.targets.length > 1}
          maxTime={report.sim.options.max_time}
          players={report.sim.players}
          raidAps={raidAps && raidAps.mean}
          raidDps={report.sim.statistics.raid_dps.mean}
          raidEvents={report.sim.raid_events}
          raidHps={raidHps && raidHps.mean}
          totalAbsorb={totalAbsorb && totalAbsorb.mean}
          totalDamage={report.sim.statistics.total_dmg.mean}
          totalHeal={totalHeal && totalHeal.mean}
        />

        {report.sim.players.map(player => (
          <PlayerPanel
            confidence={report.sim.options.confidence}
            confidenceEstimator={report.sim.options.confidence_estimator}
            key={player.name}
            player={player}
          />
        ))}
      </main>
    </React.Fragment>
  )
}

Report.propTypes = {
  report: PropTypes.object
}

export default withStyles(styles)(Report)
