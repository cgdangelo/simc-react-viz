import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { numberFormat } from 'highcharts'
import PropTypes from 'prop-types'
import * as React from 'react'
import Chip from './Chip'

const styles = createStyles({
  chip: {
    cursor: 'pointer'
  }
})

const ChipMetrics = (props) => {
  const {
    aps,
    classes,
    dps,
    dtps,
    etmi,
    hps,
    priorityDps,
    tmi,
    totalAbsorb,
    totalDamage,
    totalHeal
  } = props

  return (
    <React.Fragment>
      {dps > 0 && (
        <Chip
          className={classes.chip}
          label='DPS'
          value={numberFormat(dps, 0)}
        />
      )}

      {priorityDps > 0 && (
        <Chip
          className={classes.chip}
          label='Priority DPS'
          value={numberFormat(priorityDps, 0)}
        />
      )}

      {totalDamage > 0 && (
        <Chip
          className={classes.chip}
          label='Damage'
          value={numberFormat(totalDamage, 0)}
        />
      )}

      {dtps > 0 && (
        <Chip
          className={classes.chip}
          label='DTPS'
          value={numberFormat(dtps, 0)}
        />
      )}

      {hps > 0 && (
        <Chip
          className={classes.chip}
          label='HPS'
          value={numberFormat(hps, 0)}
        />
      )}

      {totalHeal > 0 && (
        <Chip
          className={classes.chip}
          label='Heals'
          value={numberFormat(totalHeal, 0)}
        />
      )}

      {aps > 0 && (
        <Chip
          className={classes.chip}
          label='APS'
          value={numberFormat(aps, 0)}
        />
      )}

      {totalAbsorb > 0 && (
        <Chip
          className={classes.chip}
          label='Absorbs'
          value={numberFormat(totalAbsorb, 0)}
        />
      )}

      {tmi > 0 && (
        <Chip
          className={classes.chip}
          label='TMI'
          value={numberFormat(tmi, 0)}
        />
      )}

      {etmi > 0 && (
        <Chip
          className={classes.chip}
          label='ETMI'
          value={numberFormat(tmi, 0)}
        />
      )}
    </React.Fragment>
  )
}

ChipMetrics.propTypes = {
  aps: PropTypes.number,
  dps: PropTypes.number,
  dtps: PropTypes.number,
  etmi: PropTypes.number,
  hps: PropTypes.number,
  priorityDps: PropTypes.number,
  tmi: PropTypes.number,
  totalAbsorb: PropTypes.number,
  totalDamage: PropTypes.number,
  totalHeal: PropTypes.number
}

export default withStyles(styles)(ChipMetrics)
