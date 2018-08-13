import PropTypes from 'prop-types'
import React from 'react'
import SortableGroupedDataTable from './SortableGroupedDataTable'

const BuffsTable = ({buffs, playerName, title}) => (
  <SortableGroupedDataTable
    columns={[
      {key: 'name', label: 'Name', text: true, tooltip: 'Name of the buff.'},
      {key: 'start', label: 'Start', tooltip: 'Average number of times the buff was applied.'},
      {key: 'refresh', label: 'Refresh', tooltip: 'Average number of times the buff was refreshed.'},
      {key: 'interval', label: 'Interval', valueSuffix: 's', tooltip: 'Average time between applications.'},
      {key: 'trigger', label: 'Trigger', valueSuffix: 's', tooltip: 'I honestly do not remember.'},
      {key: 'uptime', label: 'Uptime', valueSuffix: '%', tooltip: 'Amount of time the buff was active.'},
      {key: 'benefit', label: 'Benefit', valueSuffix: '%', tooltip: 'The percentage of times the buff had a actual benefit for its mainly intended purpose, eg. damage buffed / spell executes.'},
      {key: 'overflow', label: 'Overflow', tooltip: 'Average number of times the buff overflowed its maximum stacks, or refreshed.'},
      {key: 'expiry', label: 'Expiry', tooltip: 'Average number of times the buff ran its full duration and expired.'}
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
