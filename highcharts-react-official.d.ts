import Highcharts = require('highcharts')
import React = require('react')

declare module 'highcharts-react-official' {
  export interface IHighchartsReactProps {
    highcharts: Highcharts.Static
    options: Highcharts.Options
  }

  export default class HighchartsReact extends React.Component<IHighchartsReactProps> {
  }
}
