import { Theme, WithStyles } from '@material-ui/core'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import * as React from 'react'
import Navigation from './Navigation'
import RaidSummary from './RaidSummary'
import TitleBar from './TitleBar'

export interface IReportProps {
  report: IJsonReport
}

const styles = (theme: Theme) => {
  const drawerWidth = 300

  return createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      marginLeft: drawerWidth
    }
  })
}

const Report = ({ report, classes }: IReportProps & WithStyles<typeof styles>) => {
  const versionUsed = report.sim.options.dbc.version_used
  const gameData = report.sim.options.dbc[versionUsed]

  return (
    <>
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
          raidEvents={report.sim.raid_events}
          totalDamage={report.sim.statistics.total_dmg.mean}
        />
      </main>
    </>
  )
}

export default withStyles(styles)(Report)
