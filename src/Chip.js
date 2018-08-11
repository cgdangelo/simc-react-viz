import { default as MuiChip } from '@material-ui/core/Chip/Chip'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import PropTypes from 'prop-types'
import * as React from 'react'

const styles = theme => createStyles({
  root: {
    '&:first-child': {marginLeft: 0},
    '&:last-child': {marginRight: 0},
    margin: theme.spacing.unit
  }
})

const Chip = ({label, value, ...muiProps}) => {
  const labelComponent = (
    <Typography>
      <b>{label}</b> {value}
    </Typography>
  )

  return (
    <MuiChip
      {...muiProps}
      label={labelComponent}
    />
  )
}

Chip.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired
}

export default withStyles(styles)(Chip)
