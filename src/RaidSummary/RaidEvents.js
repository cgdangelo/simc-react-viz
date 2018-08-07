import Paper from '@material-ui/core/Paper/Paper'
import Step from '@material-ui/core/Step/Step'
import StepContent from '@material-ui/core/StepContent/StepContent'
import StepLabel from '@material-ui/core/StepLabel/StepLabel'
import Stepper from '@material-ui/core/Stepper/Stepper'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import PropTypes from 'prop-types'
import * as React from 'react'

const styles = theme => createStyles({
  container: {
    padding: theme.spacing.unit * 2
  },
  stepper: {
    alignItems: 'start',
    justifyContent: 'space-between',
    overflowX: 'auto',
    paddingLeft: 0,
    paddingRight: 0
  },
  eventSettings: {
    fontFamily: '"Roboto Mono"',
    lineHeight: 1.75,
    whiteSpace: 'pre'
  },
  lastEvent: {
    borderLeft: `1px solid ${theme.palette.grey[600]}`
  }
})

const RaidEvents = ({classes, events}) => (
  <Paper classes={{root: classes.container}}>
    <Typography variant='title' paragraph>Raid Events</Typography>

    <Stepper connector={null} classes={{root: classes.stepper}}>
      {events.concat(events).concat(events).concat(events).map((event, i) => (
        <Step key={i} active>
          <StepLabel>
            <Typography variant='subheading'>{event.type}</Typography>
          </StepLabel>
          <StepContent classes={{last: classes.lastEvent}}>
            <Typography variant='caption' classes={{root: classes.eventSettings}}>
              {Object.entries(event).map(event => event.join(' = ')).join('\n')}
            </Typography>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  </Paper>
)

RaidEvents.propTypes = {
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
  }))
}

export default withStyles(styles)(RaidEvents)
