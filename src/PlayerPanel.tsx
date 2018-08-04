/* tslint:disable jsx-no-multiline-js */
import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid/Grid'
import Paper from '@material-ui/core/Paper/Paper'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableRow from '@material-ui/core/TableRow/TableRow'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { numberFormat } from 'highcharts'
import * as React from 'react'
import { getPrimaryResourceBySpecialization } from './specializations'

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
        {player.collected_data.dps && (
          <Grid item={true}>
            <Paper elevation={6}>
              <Card>
                <CardContent>
                  <Typography variant='subheading' gutterBottom={true}>
                    Outgoing Damage
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell variant='head'>DPS</TableCell>
                        <TableCell numeric={true}>{player.collected_data.dps && numberFormat(player.collected_data.dps.mean, 0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>DPSe</TableCell>
                        <TableCell numeric={true}>{player.collected_data.dpse && numberFormat(player.collected_data.dpse.mean, 0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>DPS Error</TableCell>
                        <TableCell numeric={true}>
                          {numberFormat(confidence * player.collected_data.dps.mean_std_dev, 2)}
                          {' / '}
                          {numberFormat(confidence * player.collected_data.dps.mean_std_dev * 100 / player.collected_data.dps.mean, 3)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>DPS Range</TableCell>
                        <TableCell numeric={true}>0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>DPR</TableCell>
                        <TableCell numeric={true}>{player.collected_data.resource_lost && getPrimaryResourceBySpecialization(player.specialization) && numberFormat(player.collected_data.dmg.mean / player.collected_data.resource_lost[getPrimaryResourceBySpecialization(player.specialization)].mean, 2) || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        )}

        {player.collected_data.dtps && (
          <Grid item={true}>
            <Paper elevation={6}>
              <Card>
                <CardContent>
                  <Typography variant='subheading' gutterBottom={true}>
                    Incoming Damage
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell variant='head'>DTPS</TableCell>
                        <TableCell numeric={true}>{player.collected_data.dtps && numberFormat(player.collected_data.dtps.mean / player.collected_data.fight_length.mean, 0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>DTPS Error</TableCell>
                        <TableCell numeric={true}>
                          {numberFormat(confidence * player.collected_data.dtps.mean_std_dev, 2)}
                          {' / '}
                          {numberFormat(confidence * player.collected_data.dtps.mean_std_dev * 100 / player.collected_data.dtps.mean, 3)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>DTPS Range</TableCell>
                        <TableCell numeric={true}>0</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        )}

        {player.collected_data.hps && (
          <Grid item={true}>
            <Paper elevation={6}>
              <Card>
                <CardContent>
                  <Typography variant='subheading' gutterBottom={true}>
                    Outgoing Healing
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell variant='head'>HPS</TableCell>
                        <TableCell numeric={true}>{player.collected_data.hps && numberFormat(player.collected_data.hps.mean, 0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>HPSe</TableCell>
                        <TableCell numeric={true}>{player.collected_data.hpse && numberFormat(player.collected_data.hpse.mean, 0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>HPS Error</TableCell>
                        <TableCell numeric={true}>
                          {numberFormat(confidence * player.collected_data.hps.mean_std_dev, 2)}
                          {' / '}
                          {numberFormat(confidence * player.collected_data.hps.mean_std_dev * 100 / player.collected_data.hps.mean, 3)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>HPS Range</TableCell>
                        <TableCell numeric={true}>0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>HPR</TableCell>
                        <TableCell numeric={true}>{player.collected_data.resource_lost && player.collected_data.heal && getPrimaryResourceBySpecialization(player.specialization) && numberFormat(player.collected_data.heal.mean / player.collected_data.resource_lost[getPrimaryResourceBySpecialization(player.specialization)].mean, 2) || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        )}

        {player.collected_data.htps && (
          <Grid item={true}>
            <Paper elevation={6}>
              <Card>
                <CardContent>
                  <Typography variant='subheading' gutterBottom={true}>
                    Incoming Damage
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell variant='head'>HTPS</TableCell>
                        <TableCell numeric={true}>{player.collected_data.htps && numberFormat(player.collected_data.htps.mean / player.collected_data.fight_length.mean, 0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>HTPS Error</TableCell>
                        <TableCell numeric={true}>
                          {numberFormat(confidence * player.collected_data.htps.mean_std_dev, 2)}
                          {' / '}
                          {numberFormat(confidence * player.collected_data.htps.mean_std_dev * 100 / player.collected_data.htps.mean, 3)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>HTPS Range</TableCell>
                        <TableCell numeric={true}>0</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        )}
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

export default PlayerPanel
