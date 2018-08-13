import PropTypes from 'prop-types'
import * as React from 'react'
import Chip from '../Chip'

const ChipOptions = ({buildTimestamp, fightLength, fightStyle, iterations, targetError}) => (
  <React.Fragment>
    <Chip
      label='Timestamp'
      value={buildTimestamp}
    />

    <Chip
      label='Iterations'
      value={iterations}
    />

    {targetError > 0 && (
      <Chip
        label='Target Error'
        value={targetError}
      />
    )}

    <Chip
      label='Fight Length'
      value={fightLength}
    />

    <Chip
      label='Fight Style'
      value={fightStyle}
    />
  </React.Fragment>
)

ChipOptions.propTypes = {
  buildTimestamp: PropTypes.string.isRequired,
  iterations: PropTypes.number.isRequired,
  fightLength: PropTypes.string.isRequired,
  fightStyle: PropTypes.oneOf([
    'Patchwerk',
    'Ultraxion',
    'CleaveAdd',
    'HelterSkelter',
    'LightMovement',
    'HeavyMovement',
    'HecticAddCleave',
    'Beastlord',
    'CastingPatchwerk'
  ]).isRequired,
  targetError: PropTypes.number.isRequired
}

export default ChipOptions
