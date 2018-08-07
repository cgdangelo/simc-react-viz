/* tslint:disable jsx-no-multiline-js */
import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TableRow from '@material-ui/core/TableRow/TableRow'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'

const DirectedMetricInfo = ({title, rows}) => (
  <Card raised={true}>
    <CardContent>
      <Typography variant='subheading' gutterBottom={true}>
        {title}
      </Typography>
      <Table>
        <TableBody>
          {rows.map(row => (
            <TableRow>
              <TableCell variant='head'>{row.label}</TableCell>
              <TableCell numeric={true}>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

export default DirectedMetricInfo
