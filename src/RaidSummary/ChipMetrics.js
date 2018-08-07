import { numberFormat } from 'highcharts'
import PropTypes from 'prop-types'
import * as React from 'react'
import Chip from '../Chip'

const ChipMetrics = ({raidDps, totalDamage, raidHps, totalHeal, raidAps, totalAbsorb}) => (
  <React.Fragment>
    <Chip label='DPS' value={numberFormat(raidDps, 0)} />

    <Chip label='Damage' value={numberFormat(totalDamage, 0)} />

    {raidHps && <Chip label='HPS' value={numberFormat(raidHps, 0)} />}

    {totalHeal && <Chip label='Heals' value={numberFormat(totalHeal, 0)} />}

    {raidAps && <Chip label='APS' value={numberFormat(raidAps, 0)} />}

    {totalAbsorb && <Chip label='Absorbs' value={numberFormat(totalAbsorb, 0)} />}
  </React.Fragment>
)

ChipMetrics.propTypes = {
  raidAps: PropTypes.number,
  raidDps: PropTypes.number,
  raidHps: PropTypes.number,
  totalAbsorb: PropTypes.number,
  totalDamage: PropTypes.number,
  totalHeal: PropTypes.number
}

export default ChipMetrics
