import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { StyleRulesCallback, WithStyles } from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableRow from '@material-ui/core/TableRow/TableRow'
/* tslint:disable jsx-no-multiline-js */
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { numberFormat } from 'highcharts'
import * as React from 'react'
import Navigation from './Navigation'
import RaidSummary from './RaidSummary'
import { getPrimaryResourceBySpecialization } from './specializations'
import TitleBar from './TitleBar'

export interface IReportProps {
  report: IJsonReport
}

const styles: StyleRulesCallback = theme => createStyles({
  toolbar: theme.mixins.toolbar,
  content: {
    marginLeft: 300
  }
})

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
          buildPriorityDpsChart={report.sim.targets.length > 1}
        />

        {report.sim.players.map(player => (
          <ExpansionPanel defaultExpanded={true} key={player.name}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Typography variant='title'>{player.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container={true} spacing={16}>
                <Grid item={true} xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell numeric={true}>DPS</TableCell>
                        <TableCell numeric={true}>DPSe</TableCell>
                        <TableCell numeric={true}>DPS Error</TableCell>
                        <TableCell numeric={true}>DPS Range</TableCell>
                        <TableCell numeric={true}>DPR</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell numeric={true}>{numberFormat(player.collected_data.dps.mean, 0)}</TableCell>
                        <TableCell numeric={true}>{numberFormat(player.collected_data.dpse.mean, 0)}</TableCell>
                        <TableCell numeric={true}>
                          {numberFormat(report.sim.options.confidence_estimator * player.collected_data.dps.mean_std_dev, 2)}
                          {' / '}
                          {numberFormat(report.sim.options.confidence_estimator * player.collected_data.dps.mean_std_dev * 100 / player.collected_data.dps.mean, 3)}%
                        </TableCell>
                        <TableCell numeric={true}>0</TableCell>
                        <TableCell numeric={true}>{player.collected_data.resource_lost && getPrimaryResourceBySpecialization(player.specialization) && numberFormat(player.collected_data.dmg.mean / player.collected_data.resource_lost[getPrimaryResourceBySpecialization(player.specialization)].mean, 2) || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </main>
    </>
  )
}

export default withStyles(styles)(Report)
