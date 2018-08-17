import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import * as React from 'react'

const {numberFormat} = Highcharts

export const StackedActorChart = ({boxPlot, series: {data, name, precision = 0}, title}) => {
  const benchMetric = data.slice(-1).shift().y

  const chartOptions = {
    chart: {
      height: Math.max(data.length * 50, 300)
    },
    series: [
      {
        data,
        dataLabels: {
          format: `{point.y:,.${precision}f}`
        },
        name,
        type: 'bar'
      }
    ],
    title: {
      text: title
    },
    xAxis: {
      categories: data.map(bar => {
        if (bar.y === benchMetric) {
          return bar.name
        }

        const relativeDifference = (bar.y - benchMetric) / benchMetric * 100

        return `${bar.name} (${numberFormat(relativeDifference)}%)`
      }),
      labels: {
        formatter () {
          return `<span style='color: ${data[this.pos].color}'>${this.value}</span>`
        }
      }
    }
  }

  if (boxPlot) {
    chartOptions.series.push({
      data: boxPlot,
      name,
      tooltip: {
        pointFormat: `Maximum: <b>{point.high}</b><br/>Upper quartile: <b>{point.q3}</b><br/>Mean: <b>{point.mean:,.1f}</b><br/>Median: <b>{point.median}</b><br/>Lower quartile: <b>{point.q1}</b><br/>Minimum: <b>{point.low}</b><br/>`
      },
      type: 'boxplot'
    })
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
  )
}

StackedActorChart.propTypes = {
  boxPlot: PropTypes.array,

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
