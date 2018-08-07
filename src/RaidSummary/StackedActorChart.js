/* eslint-disable */
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as React from 'react'

export const StackedActorChart = ({title, series: {name, data, precision}}) => {
  const chartOptions = {
    chart: {
      height: Math.max(data.length * 50, 300)
    },
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
    },
    series: [
      {
        type: 'bar',
        name,
        data,
        dataLabels: {
          format: `{point.y:,.${precision || 0}f}`
        }
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

export default StackedActorChart
