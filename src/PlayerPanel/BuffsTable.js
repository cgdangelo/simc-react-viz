import PropTypes from 'prop-types'
import React from 'react'
import SortableTable from './SortableTable'

const BuffsTable = ({buffs, playerName, title}) => (
  <SortableTable
    columns={[
      {key: 'name', label: 'Name', text: true},
      {key: 'start', label: 'Start'},
      {key: 'refresh', label: 'Refresh'},
      {key: 'interval', label: 'Interval', valueSuffix: 's'},
      {key: 'trigger', label: 'Trigger', valueSuffix: 's'},
      {key: 'uptime', label: 'Uptime', valueSuffix: '%'},
      {key: 'benefit', label: 'Benefit', valueSuffix: '%'},
      {key: 'overflow', label: 'Overflow'},
      {key: 'expiry', label: 'Expiry'}
    ]}
    data={buffs.map(buff => ({
      source: buff.source || playerName,
      name: buff.name,
      start: buff.start_count || 0,
      refresh: buff.refresh_count || 0,
      interval: buff.interval || 0,
      trigger: buff.trigger || 0,
      uptime: buff.uptime || 0,
      benefit: buff.benefit || 0,
      overflow: buff.overflow_total || 0,
      expiry: buff.expire_count || 0
    }))}
    title={title}
  />
)

BuffsTable.propTypes = {
  buffs: PropTypes.array.isRequired,
  playerName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default BuffsTable
