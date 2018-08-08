import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import * as React from 'react'

const RaidEvents = ({classes, maxTime, events}) => {
  const yAxisCategories = events.map(event => event.name || event.type)
  const chartData = []

  events.forEach((event, i) => {
    const first = (event.first > 0 ? event.first : 0) * 1000
    const duration = (event.duration > 0 ? event.duration : 1) * 1000
    const last = (event.last > 0 ? event.last : maxTime) * 1000

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
        title: {
          text: 'Raid Events'
        },
        tooltip: {
          followPointer: true,
          formatter () {
            console.log(this)

            const start = this.series.chart.time.dateFormat('%M:%S', this.x)
            const end = this.series.chart.time.dateFormat('%M:%S', this.x2)
            const options = Object.entries(this.point.originalEvent)
              .map(option => option.join(' = '))
              .join('\n')

            console.log(options)

            return `${start} - ${end}<hr /><h3>${this.yCategory}</h3><pre style='margin: 0'>${options}</pre>`
          },
          useHTML: true,
          xDateFormat: '%M:%S'
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            day: '%M:%S',
            second: '%M:%S'
          },
          max: 300 * 1000,
          min: 0
        },
        yAxis: {
          categories: yAxisCategories,
          reversed: true
        },
        series: [
          {
            type: 'xrange',
            pointWidth: 20,
            data: chartData
          }
        ]
      }}
    />
  )
}

RaidEvents.propTypes = {
  maxTime: PropTypes.number.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    first: PropTypes.number,
    last: PropTypes.number,
    cooldown: PropTypes.number,
    cooldown_min: PropTypes.number,
    cooldown_max: PropTypes.number,
    duration: PropTypes.number,
    duration_min: PropTypes.number,
    duration_max: PropTypes.number,
    saved_duration: PropTypes.number
  })).isRequired
}

export default RaidEvents
