import {ChipProps, default as MuiChip} from '@material-ui/core/Chip'
import {Theme} from '@material-ui/core/styles/createMuiTheme'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'

const Chip = ({label, value, ...muiProps}: ChipProps & {value: any}) => (
  <MuiChip
    label={
      <Typography>
        <b>{label}</b> {value}
      </Typography>
    }
    {...muiProps}
  />
)

const styles = ((theme: Theme) => ({
  root: {
    '&:first-child': {marginLeft: 0},
    '&:last-child': {marginRight: 0},
    margin: theme.spacing.unit,
  },
}))

export default withStyles(styles)(Chip)
