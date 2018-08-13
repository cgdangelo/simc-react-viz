import Collapse from '@material-ui/core/Collapse/Collapse'
import Divider from '@material-ui/core/Divider/Divider'
import Drawer from '@material-ui/core/Drawer/Drawer'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import * as React from 'react'

const styles = theme => createStyles({
  drawerPaper: {
    width: 300
  },
  toolbar: theme.mixins.toolbar
})

@withStyles(styles)
class Navigation extends React.PureComponent {
  static propTypes = {
    players: PropTypes.arrayOf(PropTypes.object)
  }

  state = {
    actors: false,
    actorGroup: {},
    raidSummary: false
  }

  toggleActorSection (name) {
    return () =>
      this.setState(prevState => ({
        actorGroup: {
          ...prevState.actorGroup,
          [name]: !prevState.actorGroup[name]
        }
      }))
  }

  toggleNavigationSection (name) {
    return () => this.setState(prevState => ({[name]: !prevState[name]}))
  }

  render () {
    const {classes, players} = this.props

    const playersNavigation = players.map(player => (
      <React.Fragment key={player.name}>
        <ListItem
          button
          dense
          onClick={this.toggleActorSection(player.name)}
        >
          <ListItemText primary={player.name} />

          {this.state.actorGroup[player.name] ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={this.state.actorGroup[player.name]}>
          <List>
            <ListItem button dense>
              <ListItemText primary='DPS Summary' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Results, Spec and Gear' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Charts' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Abilities' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Buffs' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Procs' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Resources' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Benefits & Uptimes' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Statistics & Data Analysis' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Action Priority List' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Stats' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Gear' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Talents' />
            </ListItem>
            <ListItem button dense>
              <ListItemText primary='Profile' />
            </ListItem>

            <Divider />
          </List>
        </Collapse>
      </React.Fragment>
    ))

    return (
      <Drawer
        open
        classes={{paper: classes.drawerPaper}}
        variant='permanent'
      >
        <div className={classes.toolbar} />

        <List component='nav'>
          <ListItem
            button
            onClick={this.toggleNavigationSection('raidSummary')}
          >
            <ListItemText primary='Raid Summary' />
            {this.state.raidSummary ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            unmountOnExit
            in={this.state.raidSummary}
            timeout='auto'
          >
            <List
              disablePadding
              component='div'
            >
              <ListItem button dense>
                <ListItemText primary='Damage per Second' />
              </ListItem>
              <ListItem
                button
                dense
                disabled={!players.some(player => player.role === 'tank')}
              >
                <ListItemText primary='Tank Performance' />
              </ListItem>
              <ListItem button dense>
                <ListItemText primary='Actions per Minute' />
              </ListItem>
              <ListItem button dense>
                <ListItemText primary='DPS Variance' />
              </ListItem>
            </List>

            <Divider />
          </Collapse>

          <ListItem
            button
            onClick={this.toggleNavigationSection('actors')}
          >
            <ListItemText primary='Actors' />

            {this.state.actors ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            unmountOnExit
            in={this.state.actors}
            timeout='auto'
          >
            <List
              disablePadding
              component='div'
            >
              {playersNavigation}
            </List>

            <Divider />
          </Collapse>
        </List>
      </Drawer>
    )
  }
}

export default Navigation
