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

        /* eslint-disable sort-keys */
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
        /* eslint-enable sort-keys */
      })

    const abilityColumns = [
      {
        key: 'name',
        label: 'Name',
        text: true,
        tooltip: 'Name of the ability.'
      },
      {
        key: 'type',
        label: 'Type',
        text: true,
        tooltip: 'Type (direct or over-time) of the ability.'
      },
      {
        key: 'aps',
        label: 'APS',
        tooltip: 'Average amount per active player duration.'
      },
      {
        key: 'apsPct',
        label: 'APS %',
        tooltip: 'Percentage of total amount contributed by a single action.',
        valueSuffix: '%'
      },
      {
        key: 'execute',
        label: 'Execute',
        tooltip: 'Average number of times the action was performed.'
      },
      {
        key: 'interval',
        label: 'Interval',
        tooltip: 'Average amount of time between executes.',
        valueSuffix: 's'
      },
      {
        key: 'ape',
        label: 'APE',
        tooltip: 'Average amount per execute.'
      },
      {
        key: 'apet',
        label: 'APET',
        tooltip: 'Average damage per execute time of an individual action; the amount of damage generated, divided by the time taken to execute the action, including time spent in the GCD.'
      },
      {
        key: 'count',
        label: 'Count',
        tooltip: 'Average number of times an action is executed per iteration.'
      },
      {
        key: 'hit',
        label: 'Hit',
        tooltip: 'Average non-crit amount.'
      },
      {
        key: 'crit',
        label: 'Crit',
        tooltip: 'Average crit amount.'
      },
      {
        key: 'avgHit',
        label: 'Avg',
        tooltip: 'Average direct amount per execution.'
      },
      {
        key: 'critPct',
        label: 'Crit%',
        tooltip: 'Percentage of executes that resulted in critical strikes.',
        valueSuffix: '%'
      },
      {
        key: 'blockPct',
        label: 'B%',
        tooltip: 'Percentage of executes that resulted in a blocked strike.',
        valueSuffix: '%'
      },
      {
        key: 'uptimePct',
        label: 'Up%',
        tooltip: 'Amount of time a periodic effect was active on the target.',
        valueSuffix: '%'
      }
    ]

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
