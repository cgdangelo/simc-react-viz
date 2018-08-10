import grey from '@material-ui/core/colors/grey'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid/Grid'
import Paper from '@material-ui/core/Paper/Paper'
import Step from '@material-ui/core/Step/Step'
import StepLabel from '@material-ui/core/StepLabel/StepLabel'
import Stepper from '@material-ui/core/Stepper/Stepper'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableRow from '@material-ui/core/TableRow/TableRow'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import * as React from 'react'
import ChipMetrics from './ChipMetrics'
import { getColorBySchool, getPrimaryResourceBySpecialization, getTalentTierLevel } from './util'

const {numberFormat} = Highcharts

const emptySampleData = {
  min: 0,
  max: 0,
  mean: 0,
  median: 0,
  data: [],
  variance: 0,
  std_dev: 0,
  mean_variance: 0,
  mean_std_dev: 0,
  distribution: []
}

export const getFilledCollectedDataContainer = (player, collectionPath) => {
  const pathFragments = collectionPath.split('.')
  const collectionData = pathFragments.reduce((p, c) => p[c] || {}, Object.assign({}, player.collected_data))

  return {
    ...emptySampleData,
    ...collectionData
  }
}

const getPrimaryResourceLost = (player) =>
  getFilledCollectedDataContainer(player, `resource_lost.${getPrimaryResourceBySpecialization(player.specialization)}`)

const buildErrorString = (confidenceEstimator, meanStdDev, mean) =>
  `${numberFormat(confidenceEstimator * meanStdDev, 2)} / ${numberFormat((confidenceEstimator * meanStdDev * 100) / mean, 3)}%`

const buildRangeString = (confidence, mean, data) => {
  if (!data || data.length === 0) {
    return `${numberFormat(0, 2)} / ${numberFormat(0, 3)}%`
  }

  const sortedData = [...data]

  sortedData.sort()

  const lower = parseInt((0.5 + confidence / 2) * (sortedData.length - 1))
  const upper = parseInt((0.5 - confidence / 2) * (sortedData.length - 1))
  const range = sortedData[lower] - sortedData[upper]

  return `${numberFormat(range, 2)} / ${numberFormat(range / mean * 100, 3)}%`
}

const buildMetricPerPrimaryResourceString = (totalMetric, player) => numberFormat(totalMetric / getPrimaryResourceLost(player).mean, 2)

const getChangedResourceNames = (player) => {
  const resourceLost = player.collected_data.resource_lost || {}
  const resourceGained = player.collected_data.resource_gained || {}
  const resourceNames = [...new Set([...Object.keys(resourceLost), ...Object.keys(resourceGained)])]

  resourceNames.sort()

  return resourceNames
}

const styles = theme => createStyles({
  summaryContainer: {
    alignItems: 'center',
    margin: '0 !important'
  },
  heading: {
    flexBasis: '25%',
    flexShrink: 0
  },
  talentStep: {
    color: `${grey[900]} !important`,
    marginBottom: theme.spacing.unit,
    transform: 'scale(2.0)'
  },
  paddedPaper: {
    width: '100%'
  }
})

const PlayerPanel = ({classes, player, confidence, confidenceEstimator}) => {
  const fightLength = getFilledCollectedDataContainer(player, 'fight_length')

  const aps = getFilledCollectedDataContainer(player, 'aps')
  const dps = getFilledCollectedDataContainer(player, 'dps')
  const hps = getFilledCollectedDataContainer(player, 'hps')
  const priorityDps = getFilledCollectedDataContainer(player, 'prioritydps')

  const dpse = getFilledCollectedDataContainer(player, 'dpse')
  const hpse = getFilledCollectedDataContainer(player, 'hpse')

  const absorb = getFilledCollectedDataContainer(player, 'absorb')
  const dmg = getFilledCollectedDataContainer(player, 'dmg')
  const heal = getFilledCollectedDataContainer(player, 'heal')

  const atps = getFilledCollectedDataContainer(player, 'atps')
  const dtps = getFilledCollectedDataContainer(player, 'dtps')
  const htps = getFilledCollectedDataContainer(player, 'htps')

  const tmi = getFilledCollectedDataContainer(player, 'theck_meloree_index')
  const etmi = getFilledCollectedDataContainer(player, 'effective_theck_meloree_index')
  const msa = getFilledCollectedDataContainer(player, 'max_spike_amount')

  const actionsByApet = player.stats.filter(action => !action.pet && action.apet > 0)
  actionsByApet.sort((a, b) => b.apet - a.apet)

  const damageSources = player.stats
    .filter(action => action.portion_amount > 0)
    .map(action => ({
      name: action.name,
      pet: action.pet,
      source: action.source,
      y: action.portion_amount * 100,
      color: getColorBySchool(action.school)
    }))

  return (
    <ExpansionPanel
      key={player.name}
      defaultExpanded
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        classes={{content: classes.summaryContainer}}
      >
        <Typography
          variant='title'
          className={classes.heading}
        >
          {player.name}
        </Typography>

        <div>
          <ChipMetrics
            aps={aps.mean}
            dps={dps.mean}
            hps={hps.mean}
            priorityDps={priorityDps.mean}
            tmi={tmi.mean}
            etmi={etmi.mean}
          />
        </div>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <Grid container spacing={24}>
          <Grid xs={6} item>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant='subheading'>Outgoing Metrics</Typography>
                    </TableCell>
                    <TableCell numeric>Damage</TableCell>
                    <TableCell numeric>Healing</TableCell>
                    <TableCell numeric>Absorb</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Per Second</TableCell>
                    <TableCell numeric>{numberFormat(dps.mean)}</TableCell>
                    <TableCell numeric>{numberFormat(hps.mean)}</TableCell>
                    <TableCell numeric>{numberFormat(aps.mean)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Per Second (Effective)</TableCell>
                    <TableCell numeric>{numberFormat(dpse.mean)}</TableCell>
                    <TableCell numeric>{numberFormat(hpse.mean)}</TableCell>
                    <TableCell numeric>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Per Second, Error</TableCell>
                    <TableCell numeric>{buildErrorString(confidenceEstimator, dps.mean_std_dev, dps.mean)}</TableCell>
                    <TableCell numeric>{buildErrorString(confidenceEstimator, hps.mean_std_dev, hps.mean)}</TableCell>
                    <TableCell numeric>{buildErrorString(confidenceEstimator, aps.mean_std_dev, aps.mean)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Per Second, Range</TableCell>
                    <TableCell numeric>{buildRangeString(confidence, dps.mean, dps.data)}</TableCell>
                    <TableCell numeric>{buildRangeString(confidence, hps.mean, hps.data)}</TableCell>
                    <TableCell numeric>{buildRangeString(confidence, aps.mean, aps.data)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Per Resource</TableCell>
                    <TableCell numeric>{buildMetricPerPrimaryResourceString(dmg.mean, player)}</TableCell>
                    <TableCell numeric>{buildMetricPerPrimaryResourceString(heal.mean, player)}</TableCell>
                    <TableCell numeric>{buildMetricPerPrimaryResourceString(absorb.mean, player)}</TableCell>
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
                      <Typography variant='subheading'>Incoming Metrics</Typography>
                    </TableCell>
                    <TableCell numeric>Damage</TableCell>
                    <TableCell numeric>Healing</TableCell>
                    <TableCell numeric>Absorb</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Per Second</TableCell>
                    <TableCell numeric>{numberFormat(dtps.mean)}</TableCell>
                    <TableCell numeric>{numberFormat(htps.mean)}</TableCell>
                    <TableCell numeric>{numberFormat(atps.mean)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Per Second, Error</TableCell>
                    <TableCell numeric>{buildErrorString(confidenceEstimator, dtps.mean_std_dev, dtps.mean)}</TableCell>
                    <TableCell numeric>{buildErrorString(confidenceEstimator, htps.mean_std_dev, htps.mean)}</TableCell>
                    <TableCell numeric>{buildErrorString(confidenceEstimator, atps.mean_std_dev, atps.mean)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Per Second, Range</TableCell>
                    <TableCell numeric>{buildRangeString(confidence, dtps.mean, dtps.data)}</TableCell>
                    <TableCell numeric>{buildRangeString(confidence, htps.mean, htps.data)}</TableCell>
                    <TableCell numeric>{buildRangeString(confidence, atps.mean, atps.data)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant='subheading'>Resources</Typography>
                    </TableCell>

                    {getChangedResourceNames(player).map(resourceName => (
                      <TableCell key={resourceName} numeric>{resourceName}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Spent Per Second</TableCell>

                    {getChangedResourceNames(player).map(resourceName => (
                      <TableCell key={resourceName} numeric>
                        {numberFormat(getFilledCollectedDataContainer(player, `resource_lost.${resourceName}`).mean / fightLength.mean)}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell>Generated Per Second</TableCell>

                    {getChangedResourceNames(player).map(resourceName => (
                      <TableCell key={resourceName} numeric>
                        {numberFormat(getFilledCollectedDataContainer(player, `resource_gained.${resourceName}`).mean / fightLength.mean)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {player.role === 'tank' && (
            <Grid item xs={6}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding='dense'>
                        <Typography variant='subheading'>Tank Metrics</Typography>
                      </TableCell>
                      <TableCell numeric>Theck-Meloree Index</TableCell>
                      <TableCell numeric>Maximum Spike Damage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Minimum</TableCell>
                      <TableCell numeric>{numberFormat(tmi.min)}</TableCell>
                      <TableCell numeric>{numberFormat(msa.min)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Maximum</TableCell>
                      <TableCell numeric>{numberFormat(tmi.max)}%</TableCell>
                      <TableCell numeric>{numberFormat(msa.max)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mean</TableCell>
                      <TableCell numeric>{numberFormat(tmi.mean)}</TableCell>
                      <TableCell numeric>{numberFormat(msa.mean)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Error</TableCell>
                      <TableCell numeric>{buildErrorString(confidenceEstimator, tmi.mean_std_dev, tmi.mean)}</TableCell>
                      <TableCell numeric>N/A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Range</TableCell>
                      <TableCell numeric>{buildRangeString(confidence, tmi.mean, tmi.data)}</TableCell>
                      <TableCell numeric>N/A</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant='title'>Talents</Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>
                <Stepper
                  alternativeLabel
                  className={classes.paddedPaper}
                >
                  {player.talents.map(talent => (
                    <Step
                      key={talent.tier}
                      active
                      connector={null}
                    >
                      <StepLabel
                        StepIconProps={{
                          classes: {
                            root: classes.talentStep
                          }
                        }}
                        icon={getTalentTierLevel(talent.tier)}
                      >
                        {talent.name}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant='title'>Charts</Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        title: {
                          text: 'Damage Per Execute Time'
                        },
                        xAxis: {
                          categories: actionsByApet.map(action => action.name),
                          labels: {
                            formatter () {
                              return `<span style='color: ${getColorBySchool(actionsByApet[this.pos].school)}'>${this.value}</span>`
                            }
                          }
                        },
                        series: [
                          {
                            type: 'bar',
                            name: 'DPET',
                            data: actionsByApet.map(action => ({
                              name: action.name,
                              y: action.apet,
                              color: getColorBySchool(action.school)
                            }))
                          }
                        ]
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        title: {
                          text: 'Damage Sources'
                        },
                        series: [
                          {
                            type: 'pie',
                            data: damageSources,
                            dataLabels: {
                              useHTML: true,
                              formatter () {
                                let dataLabel = ''

                                if (damageSources[this.point.x].pet === true) {
                                  dataLabel = `<b>${damageSources[this.point.x].source}</b><br />`
                                }

                                dataLabel += `<span style='color: ${this.point.color}'>${this.point.name}</span>: ${numberFormat(
                                  this.point.percentage, 1)}%`

                                return dataLabel
                              },
                              filter: {
                                property: 'x',
                                operator: '<',
                                value: 12
                              },
                              style: {
                                color: '#fff',
                                fontSize: '0.8rem',
                                fontWeight: 'normal',
                                textOverflow: 'none'
                              }
                            }
                          }
                        ]
                      }}
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

PlayerPanel.propTypes = {
  confidence: PropTypes.number.isRequired,
  confidenceEstimator: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired
}

export default withStyles(styles)(PlayerPanel)
