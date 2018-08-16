import Paper from '@material-ui/core/Paper/Paper'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableRow from '@material-ui/core/TableRow/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
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
  },

  tooltip: {
    fontSize: theme.typography.pxToRem(14)
  },

  wowheadLink: {
    color: theme.palette.primary.light
  }
})

@withStyles(styles)
class SortableGroupedDataTable extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    spellData: PropTypes.array,
    title: PropTypes.string
  }

  static defaultProps = {
    spellData: []
  }

  state = {
    sortAsc: true,
    sortKey: 'name'
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
    const {classes, columns, data, spellData, title} = this.props
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
                  {column.tooltip
                    ? (
                      <Tooltip
                        classes={{tooltip: classes.tooltip}}
                        title={column.tooltip}
                      >
                        <TableSortLabel
                          active={sortKey === column.key}
                          direction={sortAsc ? 'asc' : 'desc'}
                          style={{whiteSpace: 'nowrap'}}
                          onClick={this.createSortHandler(column.key)}
                        >
                          {column.label}
                        </TableSortLabel>
                      </Tooltip>
                    )
                    : (
                      <TableSortLabel
                        active={sortKey === column.key}
                        direction={sortAsc ? 'asc' : 'desc'}
                        style={{whiteSpace: 'nowrap'}}
                        onClick={this.createSortHandler(column.key)}
                      >
                        {column.label}
                      </TableSortLabel>
                    )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...dataSourceMap].map(([sourceName, actions], i) => (
              <React.Fragment key={`${sourceName}_${i}`}>
                {dataSourceMap.size > 1 && (
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
                {actions.map((action, i) => {
                  const actionColumns = Object.values(action)

                  return (
                    <TableRow hover key={`${action.source}_${action.name}`}>
                      {columns.map((column, j) => (
                        <TableCell
                          key={`${action.name}_${column.key}`}
                          numeric={!column.text}
                          padding='dense'
                        >
                          {spellData.length > 0 && column.key === 'name' ? (
                            <a className={classes.wowheadLink} data-wowhead={`spell=${spellData[i]}`}>
                              {actionColumns[j + 1]}
                            </a>
                          ) : (
                            <React.Fragment>
                              {!column.text ? numberFormat(actionColumns[j + 1]) : actionColumns[j + 1]}
                              {column.valueSuffix}
                            </React.Fragment>
                          )}
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

export default SortableGroupedDataTable
