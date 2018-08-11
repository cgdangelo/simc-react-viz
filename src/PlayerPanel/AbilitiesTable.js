import Paper from '@material-ui/core/Paper/Paper'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableRow from '@material-ui/core/TableRow/TableRow'
import Typography from '@material-ui/core/Typography'
import { numberFormat } from 'highcharts'
import PropTypes from 'prop-types'
import * as React from 'react'

const styles = theme => createStyles({
  tableHeadRow: {
    backgroundColor: theme.palette.background.default
  }
})

@withStyles(styles)
class AbilitiesTable extends React.PureComponent {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    fightLength: PropTypes.number.isRequired,
    playerName: PropTypes.string.isRequired
  }

  constructor () {
    super()

    this.state = {
      sortKey: 'name',
      sortAsc: true
    }
  }

  render () {
    const {actions, classes, fightLength, playerName} = this.props

    const damageActions = actions.filter(action => action.type === 'damage' && action.actual_amount && action.actual_amount.mean > 0)

    damageActions.sort((a, b) => {
      if (a.pet === b.pet) {
        if (a.source === b.source) {
          if (a.name === b.name) {
          } else {
            return b.name - a.name
          }
        } else {
          return b.source - a.source
        }
      } else {
        return a.pet - b.pet
      }
    })

    const damageActionsMap = new Map()

    damageActions.forEach(action => {
      const source = action.pet ? action.source.slice(playerName.length + 1) : action.source
      const actions = damageActionsMap.get(source) || []

      actions.push(action)

      damageActionsMap.set(source, actions)
    })

    return (
      <Paper style={{overflowX: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='dense'>Damage Stats</TableCell>
              <TableCell padding='dense'>Type</TableCell>
              <TableCell numeric padding='dense'>DPS</TableCell>
              <TableCell numeric padding='dense'>DPS %</TableCell>
              <TableCell numeric padding='dense'>Execute</TableCell>
              <TableCell numeric padding='dense'>Interval</TableCell>
              <TableCell numeric padding='dense'>DPE</TableCell>
              <TableCell numeric padding='dense'>DPET</TableCell>
              <TableCell numeric padding='dense'>Count</TableCell>
              <TableCell numeric padding='dense'>Hit</TableCell>
              <TableCell numeric padding='dense'>Crit</TableCell>
              <TableCell numeric padding='dense'>Avg</TableCell>
              <TableCell numeric padding='dense'>Crit%</TableCell>
              <TableCell numeric padding='dense'>B%</TableCell>
              <TableCell numeric padding='dense'>Up%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...damageActionsMap].map(([sourceName, actions]) => (
              <React.Fragment>
                <TableRow style={{backgroundColor: '#111'}}>
                  <TableCell
                    className={classes.tableHeadRow}
                    colspan={15}
                    padding='dense'
                    variant='head'
                  >
                    <Typography variant='subheading'>{sourceName}</Typography>
                  </TableCell>
                </TableRow>
                {actions.map(action => {
                  const damageType = !action.tick_results || action.tick_results.mean === 0 ? 'Direct' : 'Periodic'
                  const damageCount = (
                    damageType === 'Direct'
                      ? action.num_direct_results && action.num_direct_results.mean
                      : action.num_tick_results && action.num_tick_results.mean
                  ) || 0
                  const damageResults = action.tick_results || action.direct_results

                  return (
                    <TableRow key={action.name}>
                      <TableCell padding='dense'>{action.name}</TableCell>
                      <TableCell padding='dense'>
                        {damageType}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(action.actual_amount.mean / fightLength)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(action.portion_amount * 100)}%
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(action.num_executes.mean)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat((action.total_intervals || {}).mean)}s
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(action.actual_amount.mean / action.num_executes.mean)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(action.apet)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(damageCount)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(damageResults && damageResults.hit && damageResults.hit.avg_actual_amount.mean)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(damageResults && damageResults.crit && damageResults.crit.avg_actual_amount.mean)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(damageResults && damageResults.hit && damageResults.hit.avg_actual_amount.sum / action.num_executes.count)}
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(damageResults && damageResults.crit && damageResults.crit.pct)}%
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {numberFormat(damageResults && damageResults['hit (blocked)'] && damageResults['hit (blocked)'].pct)}%
                      </TableCell>
                      <TableCell numeric padding='dense'>
                        {(damageType === 'Periodic' && `${numberFormat(action.total_tick_time && action.total_tick_time.mean / fightLength * 100)}%`) || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default AbilitiesTable
