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
    overflowX: 'auto'
  },

  titleHeadCell: {
    borderBottom: 0
  }
})

@withStyles(styles)
class SortableTable extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    title: PropTypes.string
  }

  constructor (props) {
    super(props)

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
    const {classes, columns, data, title} = this.props
    const {sortAsc, sortKey} = this.state

    const dataSourceMap = new Map()

    data.forEach(action => {
      const actions = dataSourceMap.get(action.source) || []

      actions.push(action)

      dataSourceMap.set(action.source, actions)
    })

    for (const source of dataSourceMap.keys()) {
      const data = dataSourceMap.get(source)

      data.sort((a, b) => {
        if (typeof a[sortKey] !== 'number' && typeof b[sortKey] !== 'number') {
          return sortAsc ? a[sortKey].localeCompare(b[sortKey]) : b[sortKey].localeCompare(a[sortKey])
        } else {
          return sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
        }
      })

      dataSourceMap.set(source, data)
    }

    return (
      <Paper className={classes.tableWrapper}>
        <Table>
          {title && (
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.titleHeadCell}
                  colSpan={15}
                >
                  <Typography variant='title'>
                    {title}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableHead>
            <TableRow>
              {columns.map(column => (
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
            {[...dataSourceMap].map(([sourceName, actions], i) => (
              <React.Fragment key={`${sourceName}_${i}`}>
                {Object.keys(dataSourceMap).length > 1 && (
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
                )}
                {actions.map(action => {
                  const actionColumns = Object.values(action)

                  return (
                    <TableRow key={`${action.source}_${action.name}`}>
                      {columns.map((column, i) => (
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

export default SortableTable
