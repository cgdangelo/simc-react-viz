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
  },

  tableWrapper: {
    overflowX: 'auto',
    width: '100%'
  },

  titleHeadCell: {
    borderBottom: 0
  }
})

@withStyles(styles)
class AbilitiesTable extends React.PureComponent {
  static propTypes = {
    actionType: PropTypes.oneOf(['Absorb', 'Damage', 'Healing']).isRequired,
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

    const metricActions = actions
      .filter(action => action.type === actionType.toLowerCase() && action.actual_amount && action.actual_amount.mean > 0)
      .map(action => {
        const type = !action.tick_results || action.tick_results.mean === 0 ? 'Direct' : 'Periodic'
        const count = (type === 'Direct' ? action.num_direct_results.mean : action.num_tick_results.mean) || 0
        const results = action.tick_results || action.direct_results

        return {
          source: action.source,
          name: action.name,
          type: type,
          aps: action.actual_amount.mean / fightLength,
          apsPct: action.portion_amount * 100,
          execute: action.num_executes.mean,
          interval: (action.total_intervals && action.total_intervals.mean) || 0,
          ape: action.actual_amount.mean / action.num_executes.mean,
          apet: action.apet,
          count: count,
          hit: (results && results.hit && results.hit.avg_actual_amount.mean) || 0,
          crit: (results && results.crit && results.crit.avg_actual_amount.mean) || 0,
          avgHit: (results && results.hit && results.hit.avg_actual_amount.sum / action.num_executes.count) || 0,
          critPct: (results && results.crit && results.crit.pct) || 0,
          blockPct: (results && results['hit (blocked)'] && results['hit (blocked)'].pct) || 0,
          uptimePct: type === 'Periodic' ? action.total_tick_time && action.total_tick_time.mean / fightLength * 100 : 0
        }
      })

    const actionsSourceMap = new Map()

    metricActions.forEach(action => {
      const actions = actionsSourceMap.get(action.source) || []

      actions.push(action)

      actionsSourceMap.set(action.source, actions)
    })

    for (const key of actionsSourceMap.keys()) {
      const actions = actionsSourceMap.get(key)

      actions.sort((a, b) => {
        if (['name', 'type'].indexOf(sortKey) !== -1) {
          return sortAsc ? a[sortKey].localeCompare(b[sortKey]) : b[sortKey].localeCompare(a[sortKey])
        } else {
          return sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
        }
      })

      actionsSourceMap.set(key, actions)
    }

    /* eslint-disable sort-keys */
    const abilityColumns = [
      {key: 'name', label: 'Name', text: true},
      {key: 'type', label: 'Type', text: true},
      {key: 'aps', label: 'APS'},
      {key: 'apsPct', label: 'APS %', valueSuffix: '%'},
      {key: 'execute', label: 'Execute'},
      {key: 'interval', label: 'Interval', valueSuffix: 's'},
      {key: 'ape', label: 'APE'},
      {key: 'apet', label: 'APET'},
      {key: 'count', label: 'Count'},
      {key: 'hit', label: 'Hit'},
      {key: 'crit', label: 'Crit'},
      {key: 'avgHit', label: 'Avg'},
      {key: 'critPct', label: 'Crit%', valueSuffix: '%'},
      {key: 'blockPct', label: 'B%', valueSuffix: '%'},
      {key: 'uptimePct', label: 'Up%', valueSuffix: '%'}
    ]
    /* eslint-enable sort-keys */

    return (
      <Paper className={classes.tableWrapper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                className={classes.titleHeadCell}
                colSpan={15}
              >
                <Typography variant='title'>{actionType} Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
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
            {[...actionsSourceMap].map(([sourceName, actions], i) => (
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
                          {column.valueSuffix}
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
