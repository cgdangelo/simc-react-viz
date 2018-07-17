import { ChipProps as MuiChipProps, default as MuiChip } from '@material-ui/core/Chip'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { StyleRulesCallback, WithStyles } from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'

export interface IChipProps extends MuiChipProps {
  value: any
}

const styles: StyleRulesCallback = theme => createStyles({
  root: {
    '&:first-child': { marginLeft: 0 },
    '&:last-child': { marginRight: 0 },
    margin: theme.spacing.unit
  }
})

const Chip: React.SFC<IChipProps & WithStyles<typeof styles>> = ({ label, value, ...muiProps }) => {
  const labelComponent = (
    <Typography>
      <b>{label}</b> {value}
    </Typography>
  )

  return (
    <MuiChip
      label={labelComponent}
      {...muiProps}
    />
  )
}

export default withStyles(styles)(Chip)
