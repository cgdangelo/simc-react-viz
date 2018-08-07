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
import PropTypes from 'prop-types'

const buildErrorString = (confidence, meanStdDev, mean) =>
  numberFormat(confidence * meanStdDev, 2) +
  ' / ' +
  numberFormat((confidence * meanStdDev * 100) / mean, 3) + '%'

const buildMetricPerResourceString = (
  meanMetric, resourceLost, specialization
) => (
  resourceLost &&
  getPrimaryResourceBySpecialization(specialization) &&
  numberFormat(
    meanMetric /
    resourceLost[getPrimaryResourceBySpecialization(specialization)].mean, 2
  )) || '0'

const PlayerPanel = ({player, confidence}) => (
  <ExpansionPanel defaultExpanded key={player.name}>
    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
      <Typography variant='title'>{player.name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Grid container spacing={16}>
        <Grid xs={6} item>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant='subheading'>
                      Outgoing Metrics
                    </Typography>
                  </TableCell>
                  <TableCell numeric>Damage</TableCell>
                  <TableCell numeric>Healing</TableCell>
                  <TableCell numeric>Absorb</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Per Second</TableCell>
                  <TableCell numeric>
                    {player.collected_data.dps &&
                    numberFormat(player.collected_data.dps.mean)}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.hps &&
                    numberFormat(player.collected_data.hps.mean)}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.aps &&
                    numberFormat(player.collected_data.aps.mean)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second (Effective)</TableCell>
                  <TableCell numeric>
                    {player.collected_data.dpse &&
                    numberFormat(player.collected_data.dpse.mean)}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.hpse &&
                    numberFormat(player.collected_data.hpse.mean)}
                  </TableCell>
                  <TableCell numeric>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Error</TableCell>
                  <TableCell numeric>
                    {player.collected_data.dps &&
                    buildErrorString(
                      confidence,
                      player.collected_data.dps.mean_std_dev,
                      player.collected_data.dps.mean
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.hps &&
                    buildErrorString(
                      confidence,
                      player.collected_data.hps.mean_std_dev,
                      player.collected_data.hps.mean
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.aps &&
                    buildErrorString(
                      confidence,
                      player.collected_data.aps.mean_std_dev,
                      player.collected_data.aps.mean
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Range</TableCell>
                  <TableCell numeric>N/A</TableCell>
                  <TableCell numeric>N/A</TableCell>
                  <TableCell numeric>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Resource</TableCell>
                  <TableCell numeric>
                    {player.collected_data.dps &&
                    buildMetricPerResourceString(
                      player.collected_data.dps.mean,
                      player.collected_data.resource_lost,
                      player.specialization
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.hps &&
                    buildMetricPerResourceString(
                      player.collected_data.hps.mean,
                      player.collected_data.resource_lost,
                      player.specialization
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.aps &&
                    buildMetricPerResourceString(
                      player.collected_data.aps.mean,
                      player.collected_data.resource_lost,
                      player.specialization
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid xs={6} item>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant='subheading'>
                      Incoming Metrics
                    </Typography>
                  </TableCell>
                  <TableCell numeric>Damage</TableCell>
                  <TableCell numeric>Healing</TableCell>
                  <TableCell numeric>Absorb</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Per Second</TableCell>
                  <TableCell numeric>
                    {player.collected_data.dtps &&
                    numberFormat(player.collected_data.dtps.mean)}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.htps &&
                    numberFormat(player.collected_data.htps.mean)}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.atps &&
                    numberFormat(player.collected_data.atps.mean)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Error</TableCell>
                  <TableCell numeric>
                    {player.collected_data.dtps &&
                    buildErrorString(
                      confidence,
                      player.collected_data.dtps.mean_std_dev,
                      player.collected_data.dtps.mean
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.htps &&
                    buildErrorString(
                      confidence,
                      player.collected_data.htps.mean_std_dev,
                      player.collected_data.htps.mean
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.atps &&
                    buildErrorString(
                      confidence,
                      player.collected_data.atps.mean_std_dev,
                      player.collected_data.atps.mean
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Second, Range</TableCell>
                  <TableCell numeric>N/A</TableCell>
                  <TableCell numeric>N/A</TableCell>
                  <TableCell numeric>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per Resource</TableCell>
                  <TableCell numeric>
                    {player.collected_data.dtps &&
                    buildMetricPerResourceString(
                      player.collected_data.dtps.mean,
                      player.collected_data.resource_lost,
                      player.specialization
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.htps &&
                    buildMetricPerResourceString(
                      player.collected_data.htps.mean,
                      player.collected_data.resource_lost,
                      player.specialization
                    )}
                  </TableCell>
                  <TableCell numeric>
                    {player.collected_data.atps &&
                    buildMetricPerResourceString(
                      player.collected_data.atps.mean,
                      player.collected_data.resource_lost,
                      player.specialization
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {player.role === 'tank' && (
          <Grid item xs={12}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant='subheading'>Tank Metrics</Typography>
                    </TableCell>
                    <TableCell>Theck-Meloree Index</TableCell>
                    <TableCell>Maximum Spike Damage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Minimum</TableCell>
                    <TableCell>
                      {player.collected_data.effective_theck_meloree_index &&
                      numberFormat(
                        player.collected_data.effective_theck_meloree_index.min
                      )}
                    </TableCell>
                    <TableCell>
                      {player.collected_data.max_spike_amount &&
                      numberFormat(
                        player.collected_data.max_spike_amount.min
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maximum</TableCell>
                    <TableCell>
                      {player.collected_data.effective_theck_meloree_index &&
                      numberFormat(
                        player.collected_data.effective_theck_meloree_index.max
                      )}
                    </TableCell>
                    <TableCell>
                      {player.collected_data.max_spike_amount &&
                      numberFormat(
                        player.collected_data.max_spike_amount.max
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mean</TableCell>
                    <TableCell>
                      {player.collected_data.effective_theck_meloree_index &&
                      numberFormat(
                        player.collected_data.effective_theck_meloree_index.mean
                      )}
                    </TableCell>
                    <TableCell>
                      {player.collected_data.max_spike_amount &&
                      numberFormat(
                        player.collected_data.max_spike_amount.mean
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Error</TableCell>
                    <TableCell>
                      {player.collected_data.effective_theck_meloree_index &&
                      buildErrorString(
                        confidence,
                        player.collected_data.effective_theck_meloree_index.mean_std_dev,
                        player.collected_data.effective_theck_meloree_index.mean
                      )}
                    </TableCell>
                    <TableCell>
                      {player.collected_data.max_spike_amount &&
                      buildErrorString(
                        confidence,
                        player.collected_data.max_spike_amount.mean_std_dev,
                        player.collected_data.max_spike_amount.mean
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Range</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        )}

        <Grid item>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant='subheading'>Resources</Typography>
                  </TableCell>
                  {Object.entries(player.collected_data.resource_lost).map(
                    ([resourceName]) => (
                      <TableCell numeric>{resourceName}</TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Spent Per Second</TableCell>
                  {Object.entries(player.collected_data.resource_lost).map(
                    ([, sampleData]) => (
                      <TableCell numeric>
                        {numberFormat(
                          sampleData.mean /
                          player.collected_data.fight_length.mean
                        )}
                      </TableCell>
                    )
                  )}
                </TableRow>
                <TableRow>
                  <TableCell>Generated Per Second</TableCell>
                  {Object.entries(player.collected_data.resource_lost).map(
                    ([, sampleData]) => (
                      <TableCell numeric>
                        {numberFormat(
                          sampleData.mean /
                          player.collected_data.fight_length.mean
                        )}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

PlayerPanel.propTypes = {
  confidence: PropTypes.number,
  player: PropTypes.object
}

export default PlayerPanel
