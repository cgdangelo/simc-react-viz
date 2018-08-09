import { numberFormat } from 'highcharts'
import PropTypes from 'prop-types'
import * as React from 'react'
import Chip from './Chip'

const ChipMetrics = ({dps, totalDamage, dtps, etmi, priorityDps, hps, totalHeal, aps, totalAbsorb, tmi}) => (
  <React.Fragment>
    {dps > 0 && <Chip label='DPS' value={numberFormat(dps, 0)} />}

    {priorityDps > 0 && <Chip label='Boss DPS' value={numberFormat(priorityDps, 0)} />}

    {totalDamage > 0 && <Chip label='Damage' value={numberFormat(totalDamage, 0)} />}

    {dtps > 0 && <Chip label='DTPS' value={numberFormat(dtps, 0)} />}

    {hps > 0 && <Chip label='HPS' value={numberFormat(hps, 0)} />}

    {totalHeal > 0 && <Chip label='Heals' value={numberFormat(totalHeal, 0)} />}

    {aps > 0 && <Chip label='APS' value={numberFormat(aps, 0)} />}

    {totalAbsorb > 0 && <Chip label='Absorbs' value={numberFormat(totalAbsorb, 0)} />}

    {tmi > 0 && <Chip label='TMI' value={numberFormat(tmi, 0)} />}

    {etmi > 0 && <Chip label='ETMI' value={numberFormat(tmi, 0)} />}
  </React.Fragment>
)

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

export default ChipMetrics
