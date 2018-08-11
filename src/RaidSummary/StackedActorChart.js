import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import * as React from 'react'

export const StackedActorChart = ({series: {data, name, precision}, title}) => {
  const chartOptions = {
    chart: {
      height: Math.max(data.length * 50, 300)
    },
    series: [
      {
        data,
        dataLabels: {
          format: `{point.y:,.${precision || 0}f}`
        },
        name,
        type: 'bar'
      }
    ],
    title: {
      text: title
    },
    xAxis: {
      categories: data.map(bar => bar.name),
      labels: {
        formatter () {
          return `<span style='color: ${data[this.pos].color}'>${this.value}</span>`
        }
      }
    }
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
  )
}

StackedActorChart.propTypes = {
  series: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      color: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      y: PropTypes.number.isRequired
    })).isRequired,

    name: PropTypes.string.isRequired,
    precision: PropTypes.number
  }).isRequired,

  title: PropTypes.string.isRequired
}

export default StackedActorChart
