import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableRow from '@material-ui/core/TableRow/TableRow'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import PropTypes from 'prop-types'

const DirectedMetricInfo = ({title, rows}) => (
  <Card raised>
    <CardContent>
      <Typography variant='subheading' gutterBottom>
        {title}
      </Typography>
      <Table>
        <TableBody>
          {rows.map(row => (
            <TableRow>
              <TableCell variant='head'>{row.label}</TableCell>
              <TableCell numeric>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

export default DirectedMetricInfo
