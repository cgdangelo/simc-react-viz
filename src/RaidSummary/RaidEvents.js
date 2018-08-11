/* eslint-disable */
import grey from '@material-ui/core/colors/grey'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import * as React from 'react'

const RaidEvents = ({maxTime, events}) => {
  const yAxisCategories = events.map(event => event.name || event.type)
  const chartData = []

  events.forEach((event, i) => {
    const first = (event.first > 0 ? event.first : 0) * 1000
    const last = (event.last > 0 ? event.last : maxTime) * 1000

    let duration

    if (event.duration > 0) {
      duration = event.duration
    } else if (event.type === 'movement_distance') {
      duration = (event.move_distance || 7.0) / 7.0
    } else {
      duration = 1
    }

    duration *= 1000

    chartData.push({x: first, x2: first + duration, y: i})

    for (let t = first; t < last; t += event.cooldown * 1000) {
      chartData.push({x: t, x2: t + duration, y: i, originalEvent: event})
    }
  })

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          height: events.length * 75,
          zoomType: 'x'
        },
        series: [
          {
            data: chartData,
            pointWidth: 20,
            type: 'xrange'
          }
        ],
        title: {
          text: 'Raid Events'
        },
        tooltip: {
          formatter () {
            const start = this.series.chart.time.dateFormat('%M:%S', this.x)
            const end = this.series.chart.time.dateFormat('%M:%S', this.x2)
            const options = Object.entries(this.point.originalEvent || {})
              .map(option => option.join(' = '))
              .join('\n')

            return `${start} - ${end}<hr /><h3>${this.yCategory}</h3><pre style='margin: 0'>${options}</pre>`
          },
          outside: true,
          positioner () {
            return {x: this.chart.container.offsetLeft + 295, y: this.chart.container.offsetTop + 75}
          },
          useHTML: true,
          xDateFormat: '%M:%S'
        },
        xAxis: {
          crosshair: {
            snap: false
          },
          dateTimeLabelFormats: {
            day: '%M:%S',
            second: '%M:%S'
          },
          labels: {
            style: {
              color: '#666',
              fontSize: null
            },
            y: null
          },
          max: 300 * 1000,
          min: 0,
          type: 'datetime'
        },
        yAxis: {
          categories: yAxisCategories,
          labels: {
            style: {
              color: grey[50],
              fontSize: '1rem'
            }
          }
        }
      }}
    />
  )
}

RaidEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    cooldown: PropTypes.number,
    cooldown_max: PropTypes.number,
    cooldown_min: PropTypes.number,
    duration: PropTypes.number,
    duration_max: PropTypes.number,
    duration_min: PropTypes.number,
    first: PropTypes.number,
    last: PropTypes.number,
    name: PropTypes.string,
    saved_duration: PropTypes.number,
    type: PropTypes.string
  })).isRequired,
  maxTime: PropTypes.number.isRequired
}

export default RaidEvents
