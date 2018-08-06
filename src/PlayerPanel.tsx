/* tslint:disable jsx-no-multiline-js */
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid/Grid'
import Paper from '@material-ui/core/Paper/Paper'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableRow from '@material-ui/core/TableRow/TableRow'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { numberFormat } from 'highcharts'
import * as React from 'react'
import { getPrimaryResourceBySpecialization } from './specializations'

const buildErrorString = (
  confidence: number,
  meanStdDev: number,
  mean: number
) =>
  numberFormat(confidence * meanStdDev, 2) +
  ' / ' +
  numberFormat((confidence * meanStdDev * 100) / mean, 3) +
  '%'

const buildMetricPerResourceString = (
  meanMetric: number,
  resourceLost: { [resourceName: string]: ISampleData },
  specialization: ClassSpecialization
) =>
  (resourceLost &&
    getPrimaryResourceBySpecialization(specialization) &&
    numberFormat(
      meanMetric /
      resourceLost[getPrimaryResourceBySpecialization(specialization)].mean,
      2
    )) ||
  '0'

export interface IPlayerPanelProps {
  player: IActor
  confidence: number
}

const PlayerPanel: React.SFC<IPlayerPanelProps> = ({ player, confidence }) => (
  <ExpansionPanel defaultExpanded={true} key={player.name}>
    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
      <Typography variant='title'>{player.name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Grid container={true} spacing={16}>
        <Grid xs={6} item={true}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant='subheading'>Outgoing Metrics</Typography>
                  </TableCell>
                  <TableCell numeric={true}>Damage</TableCell>
                  <TableCell numeric={true}>Healing</TableCell>
                  <TableCell numeric={true}>Absorb</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Per Second</TableCell>
                  <TableCell numeric={true}>{player.collected_data.dps && numberFormat(player.collected_data.dps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.hps && numberFormat(player.collected_data.hps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.aps && numberFormat(player.collected_data.aps.mean)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second (Effective)</TableCell>
                  <TableCell numeric={true}>{player.collected_data.dpse && numberFormat(player.collected_data.dpse.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.hpse && numberFormat(player.collected_data.hpse.mean)}</TableCell>
                  <TableCell numeric={true}>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Error</TableCell>
                  <TableCell numeric={true}>{player.collected_data.dps && buildErrorString(confidence, player.collected_data.dps.mean_std_dev, player.collected_data.dps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.hps && buildErrorString(confidence, player.collected_data.hps.mean_std_dev, player.collected_data.hps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.aps && buildErrorString(confidence, player.collected_data.aps.mean_std_dev, player.collected_data.aps.mean)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Range</TableCell>
                  <TableCell numeric={true}>N/A</TableCell>
                  <TableCell numeric={true}>N/A</TableCell>
                  <TableCell numeric={true}>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Resource</TableCell>
                  <TableCell numeric={true}>{player.collected_data.dps && buildMetricPerResourceString(player.collected_data.dps.mean, player.collected_data.resource_lost, player.specialization)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.hps && buildMetricPerResourceString(player.collected_data.hps.mean, player.collected_data.resource_lost, player.specialization)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.aps && buildMetricPerResourceString(player.collected_data.aps.mean, player.collected_data.resource_lost, player.specialization)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid xs={6} item={true}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant='subheading'>Incoming Metrics</Typography>
                  </TableCell>
                  <TableCell numeric={true}>Damage</TableCell>
                  <TableCell numeric={true}>Healing</TableCell>
                  <TableCell numeric={true}>Absorb</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Per Second</TableCell>
                  <TableCell numeric={true}>{player.collected_data.dtps && numberFormat(player.collected_data.dtps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.htps && numberFormat(player.collected_data.htps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.atps && numberFormat(player.collected_data.atps.mean)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Error</TableCell>
                  <TableCell numeric={true}>{player.collected_data.dtps && buildErrorString(confidence, player.collected_data.dtps.mean_std_dev, player.collected_data.dtps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.htps && buildErrorString(confidence, player.collected_data.htps.mean_std_dev, player.collected_data.htps.mean)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.atps && buildErrorString(confidence, player.collected_data.atps.mean_std_dev, player.collected_data.atps.mean)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Range</TableCell>
                  <TableCell numeric={true}>N/A</TableCell>
                  <TableCell numeric={true}>N/A</TableCell>
                  <TableCell numeric={true}>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Resource</TableCell>
                  <TableCell numeric={true}>{player.collected_data.dtps && buildMetricPerResourceString(player.collected_data.dtps.mean, player.collected_data.resource_lost, player.specialization)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.htps && buildMetricPerResourceString(player.collected_data.htps.mean, player.collected_data.resource_lost, player.specialization)}</TableCell>
                  <TableCell numeric={true}>{player.collected_data.atps && buildMetricPerResourceString(player.collected_data.atps.mean, player.collected_data.resource_lost, player.specialization)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

export default PlayerPanel
