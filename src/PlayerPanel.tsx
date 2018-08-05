/* tslint:disable jsx-no-multiline-js */
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid/Grid'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { numberFormat } from 'highcharts'
import * as React from 'react'
import DirectedMetricInfo from './DirectedMetricInfo'
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
        {player.collected_data.dps &&
        player.collected_data.dpse && (
          <Grid item={true}>
            <DirectedMetricInfo
              title='Outgoing Damage'
              rows={[
                {
                  label: 'DPS',
                  value: numberFormat(player.collected_data.dps.mean)
                },
                {
                  label: 'DPSe',
                  value: numberFormat(player.collected_data.dpse.mean)
                },
                {
                  label: 'DPS Error',
                  value: buildErrorString(
                    confidence,
                    player.collected_data.dps.mean_std_dev,
                    player.collected_data.dps.mean
                  )
                },
                { label: 'DPS Range', value: '0' },
                {
                  label: 'DPR',
                  value: buildMetricPerResourceString(
                    player.collected_data.dps.mean,
                    player.collected_data.resource_lost,
                    player.specialization
                  )
                }
              ]}
            />
          </Grid>
        )}

        {player.collected_data.dtps && (
          <Grid item={true}>
            <DirectedMetricInfo
              title='Incoming Damage'
              rows={[
                {
                  label: 'DTPS',
                  value: numberFormat(player.collected_data.dtps.mean)
                },
                {
                  label: 'DTPS Error',
                  value: buildErrorString(
                    confidence,
                    player.collected_data.dtps.mean_std_dev,
                    player.collected_data.dtps.mean
                  )
                },
                { label: 'DPS Range', value: '0' }
              ]}
            />
          </Grid>
        )}

        {player.collected_data.hps &&
        player.collected_data.hpse && (
          <Grid item={true}>
            <DirectedMetricInfo
              title='Outgoing Healing'
              rows={[
                {
                  label: 'HPS',
                  value: numberFormat(player.collected_data.hps.mean)
                },
                {
                  label: 'HPSe',
                  value: numberFormat(player.collected_data.hpse.mean)
                },
                {
                  label: 'HPS Error',
                  value: buildErrorString(
                    confidence,
                    player.collected_data.hps.mean_std_dev,
                    player.collected_data.hps.mean
                  )
                },
                { label: 'HPS Range', value: '0' },
                {
                  label: 'HPR',
                  value: buildMetricPerResourceString(
                    player.collected_data.hps.mean,
                    player.collected_data.resource_lost,
                    player.specialization
                  )
                }
              ]}
            />
          </Grid>
        )}

        {player.collected_data.htps && (
          <Grid item={true}>
            <DirectedMetricInfo
              title='Incoming Healing'
              rows={[
                {
                  label: 'HTPS',
                  value: numberFormat(player.collected_data.htps.mean)
                },
                {
                  label: 'HTPS Error',
                  value: buildErrorString(
                    confidence,
                    player.collected_data.htps.mean_std_dev,
                    player.collected_data.htps.mean
                  )
                },
                { label: 'HTPS Range', value: '0' }
              ]}
            />
          </Grid>
        )}

        {player.collected_data.aps && (
          <Grid item={true}>
            <DirectedMetricInfo
              title='Outgoing Absorbs'
              rows={[
                {
                  label: 'APS',
                  value: numberFormat(player.collected_data.aps.mean)
                },
                {
                  label: 'APS Error',
                  value: buildErrorString(
                    confidence,
                    player.collected_data.aps.mean_std_dev,
                    player.collected_data.aps.mean
                  )
                },
                { label: 'APS Range', value: '0' },
                {
                  label: 'APR',
                  value: buildMetricPerResourceString(
                    player.collected_data.aps.mean,
                    player.collected_data.resource_lost,
                    player.specialization
                  )
                }
              ]}
            />
          </Grid>
        )}

        {player.collected_data.atps && (
          <Grid item={true}>
            <DirectedMetricInfo
              title='Incoming Absorbs'
              rows={[
                {
                  label: 'ATPS',
                  value: numberFormat(player.collected_data.atps.mean)
                },
                {
                  label: 'ATPS Error',
                  value: buildErrorString(
                    confidence,
                    player.collected_data.atps.mean_std_dev,
                    player.collected_data.atps.mean
                  )
                },
                { label: 'ATPS Range', value: '0' }
              ]}
            />
          </Grid>
        )}
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

export default PlayerPanel
