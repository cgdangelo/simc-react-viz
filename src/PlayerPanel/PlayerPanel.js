import grey from '@material-ui/core/colors/grey'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid/Grid'
import Paper from '@material-ui/core/Paper/Paper'
import Step from '@material-ui/core/Step/Step'
import StepLabel from '@material-ui/core/StepLabel/StepLabel'
import Stepper from '@material-ui/core/Stepper/Stepper'
import { lighten } from '@material-ui/core/styles/colorManipulator'
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
import * as sma from 'sma'
import ChipMetrics from '../ChipMetrics'
import { getColorByResource, getColorBySchool, getColorBySpecialization, getPrimaryResourceBySpecialization, getTalentTierLevel } from '../util'
import AbilitiesTable from './AbilitiesTable'
import BuffsTable from './BuffsTable'
import SortableTable from './SortableTable'

const {numberFormat} = Highcharts

const emptySampleData = {
  data: [],
  distribution: [],
  max: 0,
  mean: 0,
  mean_std_dev: 0,
  mean_variance: 0,
  median: 0,
  min: 0,
  std_dev: 0,
  variance: 0
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
  flexColumnItem: {
    marginBottom: 24
  },
  heading: {
    flexBasis: '25%',
    flexShrink: 0
  },
  paddedPaper: {
    width: '100%'
  },
  talentStep: {
    color: `${grey[900]} !important`,
    marginBottom: theme.spacing.unit,
    transform: 'scale(2.0)'
  },
  summaryContainer: {
    alignItems: 'center',
    margin: '0 !important'
  }
})

class PlayerPanel extends React.PureComponent {
  setLazyRenderState = (event, expanded) => {
    this.setState((prevState) => ({
      expanded,
      rendered: prevState.rendered ? true : expanded
    }))
  }

  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      rendered: false
    }
  }

  render () {
    const {
      classes,
      confidence,
      confidenceEstimator,
      player,
      raidBuffs
    } = this.props

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
      .filter(action => action.type === 'damage' && action.portion_amount > 0)
      .map(action => ({
        name: action.name,
        pet: action.pet,
        source: action.source,
        y: action.portion_amount * 100,
        color: getColorBySchool(action.school)
      }))

    const healingSources = player.stats
      .filter(action => (action.type === 'heal' || action.type === 'absorb') && action.portion_amount > 0)
      .map(action => ({
        name: action.name,
        y: action.portion_amount * 100,
        color: getColorBySchool(action.school)
      }))

    const spentTime = player.stats
      .filter(action => !action.background && !action.quiet && !action.pet && action.total_time > 0)
      .map(action => ({
        name: action.name,
        y: action.total_time,
        color: getColorBySchool(action.school)
      }))

    spentTime.push({
      name: 'Waiting',
      y: getFilledCollectedDataContainer(player, 'waiting_time').mean,
      color: '#fff'
    })

    return (
      <ExpansionPanel
        defaultExpanded={this.state.expanded}
        key={player.name}
        onChange={this.setLazyRenderState}
      >
        <ExpansionPanelSummary
          classes={{content: classes.summaryContainer}}
          expandIcon={<ExpandMore />}
        >
          <Typography
            className={classes.heading}
            variant='headline'
          >
            {player.name}
          </Typography>

          <div>
            <ChipMetrics
              aps={aps.mean}
              dps={dps.mean}
              etmi={etmi.mean}
              hps={hps.mean}
              priorityDps={priorityDps.mean}
              tmi={tmi.mean}
            />
          </div>
        </ExpansionPanelSummary>

        {(this.state.expanded || this.state.rendered) && (
          <ExpansionPanelDetails>
            <Grid container>
              <Grid item xs={12}>
                <ExpansionPanel defaultExpanded>
                  <ExpansionPanelSummary>
                    <Typography variant='title'>Results</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
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

                      <Grid item xs={6}>
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
                                  <TableCell numeric key={resourceName}>
                                    {resourceName}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Spent Per Second</TableCell>

                                {getChangedResourceNames(player).map(resourceName => (
                                  <TableCell numeric key={resourceName}>
                                    {numberFormat(getFilledCollectedDataContainer(player, `resource_lost.${resourceName}`).mean / fightLength.mean)}
                                  </TableCell>
                                ))}
                              </TableRow>

                              <TableRow>
                                <TableCell>Generated Per Second</TableCell>

                                {getChangedResourceNames(player).map(resourceName => (
                                  <TableCell numeric key={resourceName}>
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
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

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
                          active
                          connector={null}
                          key={talent.tier}
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
                      <Grid
                        container
                        item
                        direction='column'
                        xs={6}
                      >
                        <Grid item className={classes.flexColumnItem}>
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                              series: [
                                {
                                  data: actionsByApet.map(action => ({
                                    color: getColorBySchool(action.school),
                                    name: action.name,
                                    y: action.apet
                                  })),
                                  name: 'DPET',
                                  type: 'bar'
                                }
                              ],
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
                              }
                            }}
                          />
                        </Grid>

                        {damageSources.length > 0 && (
                          <Grid item className={classes.flexColumnItem}>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                series: [
                                  {
                                    data: damageSources,
                                    dataLabels: {
                                      formatter () {
                                        let dataLabel = ''

                                        if (this.series.data[this.point.x].pet === true) {
                                          dataLabel = `<b>${this.series.data[this.point.x].source}</b><br />`
                                        }

                                        dataLabel += `<span style='color: ${this.point.color}'>${this.point.name}</span><br />${numberFormat(this.point.y, 1)}%`

                                        return dataLabel
                                      }
                                    },
                                    name: 'Damage',
                                    type: 'pie'
                                  }
                                ],
                                title: {
                                  text: 'Damage Sources'
                                }
                              }}
                            />
                          </Grid>
                        )}

                        {healingSources.length > 0 && (
                          <Grid item className={classes.flexColumnItem}>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                series: [
                                  {
                                    data: healingSources,
                                    dataLabels: {
                                      formatter () {
                                        return `<span style='color: ${this.point.color}'>${this.point.name}</span><br />${numberFormat(this.point.y, 1)}%`
                                      }
                                    },
                                    name: 'Healing',
                                    type: 'pie'
                                  }
                                ],
                                title: {
                                  text: 'Healing Sources'
                                }
                              }}
                            />
                          </Grid>
                        )}

                        <Grid item className={classes.flexColumnItem}>
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                              series: [
                                {
                                  data: spentTime,
                                  dataLabels: {
                                    formatter () {
                                      return `<span style='color: ${this.point.color}'>${this.point.name}</span><br />${numberFormat(this.point.y, 1)}s`
                                    }
                                  },
                                  name: 'Time',
                                  type: 'pie'
                                }
                              ],
                              title: {
                                text: 'Spent Time'
                              }
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        item
                        direction='column'
                        xs={6}
                      >
                        {dps.mean > 0 && (
                          <Grid item className={classes.flexColumnItem}>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                chart: {
                                  zoomType: 'x'
                                },
                                series: [
                                  {
                                    color: getColorBySpecialization(player.specialization),
                                    data: sma(getFilledCollectedDataContainer(player, 'timeline_dmg').data, 20, n => n).map((y, i) => [i * 1000, y]),
                                    name: 'DPS',
                                    type: 'areaspline'
                                  }
                                ],
                                title: {
                                  text: 'Damage Per Second'
                                },
                                xAxis: {
                                  type: 'datetime',
                                  crosshair: true,
                                  labels: {
                                    style: {
                                      fontSize: null
                                    },
                                    y: null
                                  }
                                },
                                yAxis: {
                                  plotLines: [
                                    {
                                      color: lighten(getColorBySpecialization(player.specialization), 0.5),
                                      label: {
                                        align: 'right',
                                        style: {
                                          color: lighten(getColorBySpecialization(player.specialization), 0.5),
                                          fontSize: '1rem',
                                          fontWeight: 'bold',
                                          textShadow: '2px 2px 1px rgba(0, 0, 0, 1)'
                                        },
                                        text: `Mean: ${numberFormat(dps.mean)}`,
                                        textAlign: 'right'
                                      },
                                      value: dps.mean,
                                      width: 1,
                                      zIndex: 5
                                    }
                                  ]
                                }
                              }}
                            />
                          </Grid>
                        )}

                        {dtps.mean > 0 && (
                          <Grid item className={classes.flexColumnItem}>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                chart: {
                                  zoomType: 'x'
                                },
                                series: [
                                  {
                                    color: getColorByResource('health'),
                                    data: sma(getFilledCollectedDataContainer(player, 'timeline_dmg_taken').data, 20, n => n).map((y, i) => [i * 1000, y]),
                                    name: 'DTPS',
                                    type: 'areaspline'
                                  }
                                ],
                                title: {
                                  text: 'Damage Taken Per Second'
                                },
                                xAxis: {
                                  type: 'datetime',
                                  crosshair: true,
                                  labels: {
                                    style: {
                                      fontSize: null
                                    },
                                    y: null
                                  }
                                }
                              }}
                            />
                          </Grid>
                        )}

                        {htps.mean > 0 && (
                          <Grid item className={classes.flexColumnItem}>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                chart: {
                                  zoomType: 'x'
                                },
                                series: [
                                  {
                                    color: getColorByResource('health'),
                                    data: sma(getFilledCollectedDataContainer(player, 'timeline_healing_taken').data, 20, n => n).map((y, i) => [i * 1000, y]),
                                    name: 'HTPS',
                                    type: 'areaspline'
                                  }
                                ],
                                title: {
                                  text: 'Healing Taken Per Second'
                                },
                                xAxis: {
                                  crosshair: true,
                                  labels: {
                                    style: {
                                      fontSize: null
                                    },
                                    y: null
                                  },
                                  type: 'datetime'
                                }
                              }}
                            />
                          </Grid>
                        )}

                        {dps.data.length > 0 && (
                          <Grid item className={classes.flexColumnItem}>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                series: [
                                  {
                                    baseSeries: 's1',
                                    color: getColorBySpecialization(player.specialization),
                                    name: 'Iterations',
                                    type: 'histogram',
                                    xAxis: 1,
                                    yAxis: 1
                                  },
                                  {
                                    data: dps.data,
                                    id: 's1',
                                    name: 'DPS',
                                    type: 'scatter'
                                  }
                                ],
                                title: {
                                  text: 'DPS Distribution'
                                },
                                xAxis: [
                                  {
                                    labels: false,
                                    opposite: true
                                  },
                                  {
                                    labels: {
                                      style: {
                                        fontSize: null
                                      },
                                      y: null
                                    },
                                    title: {
                                      text: 'DPS'
                                    }
                                  }
                                ],
                                yAxis: [
                                  {
                                    labels: false,
                                    opposite: true
                                  },
                                  {
                                    title: {
                                      text: 'Iterations'
                                    }
                                  }
                                ]
                              }}
                            />
                          </Grid>
                        )}

                        {hps.data.length > 0 && (
                          <Grid item className={classes.flexColumnItem}>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                series: [
                                  {
                                    baseSeries: 's1',
                                    color: getColorByResource('health'),
                                    name: 'Iterations',
                                    type: 'histogram',
                                    xAxis: 1,
                                    yAxis: 1
                                  },
                                  {
                                    data: hps.data,
                                    id: 's1',
                                    name: 'HPS',
                                    type: 'scatter'
                                  }
                                ],
                                title: {
                                  text: 'HPS Distribution'
                                },
                                xAxis: [
                                  {
                                    labels: false,
                                    opposite: true
                                  },
                                  {
                                    labels: {
                                      style: {
                                        fontSize: null
                                      },
                                      y: null
                                    },
                                    title: {
                                      text: 'HPS'
                                    }
                                  }
                                ],
                                yAxis: [
                                  {
                                    labels: false,
                                    opposite: true
                                  },
                                  {
                                    title: {
                                      text: 'Iterations'
                                    }
                                  }
                                ]
                              }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel defaultExpanded>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant='title'>Abilities</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <AbilitiesTable
                          actionType='Damage'
                          actions={player.stats}
                          fightLength={fightLength.mean}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <AbilitiesTable
                          actionType='Heal'
                          actions={player.stats}
                          fightLength={fightLength.mean}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <AbilitiesTable
                          actionType='Absorb'
                          actions={player.stats}
                          fightLength={fightLength.mean}
                        />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel defaultExpanded>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant='title'>Buffs</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <BuffsTable
                          buffs={player.buffs}
                          playerName={player.name}
                          title='Dynamic Buffs'
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <BuffsTable
                          buffs={raidBuffs}
                          playerName={player.name}
                          title='Dynamic Buffs'
                        />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                {player.procs && player.procs.length > 0 && (
                  <ExpansionPanel defaultExpanded>
                    <ExpansionPanelSummary>
                      <Typography variant='title'>Procs</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <SortableTable
                        columns={[
                          {key: 'name', label: 'Name', text: true},
                          {key: 'count', label: 'Count'},
                          {key: 'interval', label: 'Interval', valueSuffix: 's'}
                        ]}
                        data={player.procs.map(proc => ({
                          source: null,
                          ...proc
                        }))}
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                )}
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        )}
      </ExpansionPanel>
    )
  }
}

PlayerPanel.propTypes = {
  confidence: PropTypes.number.isRequired,
  confidenceEstimator: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  raidBuffs: PropTypes.array.isRequired
}

export default withStyles(styles)(PlayerPanel)
