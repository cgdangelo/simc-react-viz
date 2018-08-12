import Paper from '@material-ui/core/Paper/Paper'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableRow from '@material-ui/core/TableRow/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel/TableSortLabel'
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
    actionType: PropTypes.oneOf('absorb', 'damage', 'healing').isRequired,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    fightLength: PropTypes.number.isRequired
  }

  constructor () {
    super()

    this.state = {
      sortKey: 'name',
      sortAsc: true
    }
  }

  createSortHandler (key) {
    return () => {
      if (this.state.sortKey === key) {
        this.setState(prevState => ({sortAsc: !prevState.sortAsc}))
      } else {
        this.setState({sortKey: key})
      }
    }
  }

  render () {
    const {actions, actionType, classes, fightLength} = this.props
    const {sortAsc, sortKey} = this.state

    const damageActions = actions
      .filter(action => action.type === actionType && action.actual_amount && action.actual_amount.mean > 0)
      .map(action => {
        const damageType = !action.tick_results || action.tick_results.mean === 0 ? 'Direct' : 'Periodic'
        const damageCount = (
          damageType === 'Direct'
            ? action.num_direct_results && action.num_direct_results.mean
            : action.num_tick_results && action.num_tick_results.mean
        ) || 0
        const damageResults = action.tick_results || action.direct_results

        return {
          source: action.source,
          name: action.name,
          type: damageType,
          dps: action.actual_amount.mean / fightLength,
          dpsPct: action.portion_amount * 100,
          execute: action.num_executes.mean,
          interval: (action.total_intervals && action.total_intervals.mean) || 0,
          dpe: action.actual_amount.mean / action.num_executes.mean,
          dpet: action.apet,
          count: damageCount,
          hit: damageResults && damageResults.hit && damageResults.hit.avg_actual_amount.mean,
          crit: damageResults && damageResults.crit && damageResults.crit.avg_actual_amount.mean,
          avgHit: damageResults && damageResults.hit && damageResults.hit.avg_actual_amount.sum / action.num_executes.count,
          critPct: damageResults && damageResults.crit && damageResults.crit.pct,
          blockPct: damageResults && damageResults['hit (blocked)'] && damageResults['hit (blocked)'].pct,
          uptimePct: damageType === 'Periodic' ? action.total_tick_time && action.total_tick_time.mean / fightLength * 100 : 0
        }
      })

    damageActions.sort((a, b) => {
      if (a.pet === b.pet) {
        if (a.source === b.source) {
          if (['name', 'type'].indexOf(sortKey) !== -1) {
            return sortAsc ? a[sortKey].localeCompare(b[sortKey]) : b[sortKey].localeCompare(a[sortKey])
          } else {
            return sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
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
      const actions = damageActionsMap.get(action.source) || []

      actions.push(action)

      damageActionsMap.set(action.source, actions)
    })

    const abilityColumns = [
      {key: 'name', label: 'Name', text: true},
      {key: 'type', label: 'Type', text: true},
      {key: 'dps', label: 'DPS'},
      {key: 'dpsPct', label: 'DPS %'},
      {key: 'execute', label: 'Execute'},
      {key: 'interval', label: 'Interval'},
      {key: 'dpe', label: 'DPE'},
      {key: 'dpet', label: 'DPET'},
      {key: 'count', label: 'Count'},
      {key: 'hit', label: 'Hit'},
      {key: 'crit', label: 'Crit'},
      {key: 'avgHit', label: 'Avg'},
      {key: 'critPct', label: 'Crit%'},
      {key: 'blockPct', label: 'B%'},
      {key: 'uptimePct', label: 'Up%'}
    ]

    return (
      <Paper style={{overflowX: 'auto', width: '100%'}}>
        <Table>
          <TableHead>
            <TableRow>
              {abilityColumns.map(column => (
                <TableCell
                  key={column.label}
                  numeric={!column.text}
                  padding='dense'
                >
                  <TableSortLabel
                    active={sortKey === column.key}
                    direction={sortAsc ? 'asc' : 'desc'}
                    style={{whiteSpace: 'nowrap'}}
                    onClick={this.createSortHandler(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...damageActionsMap].map(([sourceName, actions], i) => (
              <React.Fragment key={`${sourceName}_${i}`}>
                <TableRow>
                  <TableCell
                    className={classes.tableHeadRow}
                    colSpan={15}
                    padding='dense'
                    variant='head'
                  >
                    <Typography variant='subheading'>{sourceName}</Typography>
                  </TableCell>
                </TableRow>
                {actions.map(action => {
                  const actionColumns = Object.values(action)

                  return (
                    <TableRow key={`${action.source}_${action.name}`}>
                      {abilityColumns.map((column, i) => (
                        <TableCell
                          key={`${action.name}_${column.key}`}
                          numeric={!column.text}
                          padding='dense'
                        >
                          {!column.text ? numberFormat(actionColumns[i + 1]) : actionColumns[i + 1]}
                        </TableCell>
                      ))}
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
