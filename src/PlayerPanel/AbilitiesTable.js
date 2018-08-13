import PropTypes from 'prop-types'
import * as React from 'react'
import SortableGroupedDataTable from './SortableGroupedDataTable'

class AbilitiesTable extends React.PureComponent {
  static propTypes = {
    actionType: PropTypes.oneOf(['Absorb', 'Damage', 'Heal']).isRequired,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    fightLength: PropTypes.number.isRequired
  }

  render () {
    const {actions, actionType, fightLength} = this.props

    const metricActions = actions
      .filter(action => action.type === actionType.toLowerCase() && action.actual_amount && action.actual_amount.mean > 0)
      .map(action => {
        const type = !action.tick_results || action.tick_results.mean === 0 ? 'Direct' : 'Periodic'
        const count = (type === 'Direct' ? action.num_direct_results.mean : action.num_tick_results.mean) || 0
        const results = action.tick_results || action.direct_results

        return {
          source: action.source,
          name: action.name,
          type: type,
          aps: action.actual_amount.mean / fightLength,
          apsPct: action.portion_amount * 100,
          execute: action.num_executes.mean,
          interval: (action.total_intervals && action.total_intervals.mean) || 0,
          ape: action.actual_amount.mean / action.num_executes.mean,
          apet: action.apet,
          count: count,
          hit: (results && results.hit && results.hit.avg_actual_amount.mean) || 0,
          crit: (results && results.crit && results.crit.avg_actual_amount.mean) || 0,
          avgHit: (results && results.hit && results.hit.avg_actual_amount.sum / action.num_executes.count) || 0,
          critPct: (results && results.crit && results.crit.pct) || 0,
          blockPct: (results && results['hit (blocked)'] && results['hit (blocked)'].pct) || 0,
          uptimePct: type === 'Periodic' ? action.total_tick_time && action.total_tick_time.mean / fightLength * 100 : 0
        }
      })

    /* eslint-disable sort-keys */
    const abilityColumns = [
      {key: 'name', label: 'Name', text: true},
      {key: 'type', label: 'Type', text: true},
      {key: 'aps', label: 'APS'},
      {key: 'apsPct', label: 'APS %', valueSuffix: '%'},
      {key: 'execute', label: 'Execute'},
      {key: 'interval', label: 'Interval', valueSuffix: 's'},
      {key: 'ape', label: 'APE'},
      {key: 'apet', label: 'APET'},
      {key: 'count', label: 'Count'},
      {key: 'hit', label: 'Hit'},
      {key: 'crit', label: 'Crit'},
      {key: 'avgHit', label: 'Avg'},
      {key: 'critPct', label: 'Crit%', valueSuffix: '%'},
      {key: 'blockPct', label: 'B%', valueSuffix: '%'},
      {key: 'uptimePct', label: 'Up%', valueSuffix: '%'}
    ]
    /* eslint-enable sort-keys */

    return (
      <SortableGroupedDataTable
        columns={abilityColumns}
        data={metricActions}
        title={`${actionType} Actions`}
      />
    )
  }
}

export default AbilitiesTable
