/* tslint:disable jsx-no-multiline-js */
import { Theme, WithStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper/Paper'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableRow from '@material-ui/core/TableRow/TableRow'
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
  const { raid_hps, total_heal, raid_aps, total_absorb } = report.sim.statistics

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
          totalDamage={report.sim.statistics.total_dmg.mean}
          raidHps={raid_hps && raid_hps.mean}
          totalHeal={total_heal && total_heal.mean}
          raidAps={raid_aps && raid_aps.mean}
          totalAbsorb={total_absorb && total_absorb.mean}
          raidEvents={report.sim.raid_events}
          buildPriorityDpsChart={report.sim.targets.length > 0}
        />

        {report.sim.players.map(player => (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>DPS</TableCell>
                  <TableCell>DPSe</TableCell>
                  <TableCell>DPS Error</TableCell>
                  <TableCell>DPS Range</TableCell>
                  <TableCell>DPR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        ))}
      </main>
    </>
  )
}

export default withStyles(styles)(Report)
