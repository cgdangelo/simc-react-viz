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
import * as React from 'react'

const styles = theme => createStyles({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 300
  }
})

class Navigation extends React.PureComponent {
  constructor () {
    super()

    this.state = {
      raidSummary: false,
      actors: false,
      actorGroup: {}
    }
  }

  toggleNavigationSection (name) {
    return () => this.setState(prevState => ({[name]: !prevState[name]}))
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

  render () {
    const {classes, players} = this.props

    const playersNavigation = players.map(player => (
      <React.Fragment key={player.name}>
        <ListItem dense button onClick={this.toggleActorSection(player.name)}>
          <ListItemText primary={player.name} />
          {this.state.actorGroup[player.name] ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={this.state.actorGroup[player.name]}>
          <List>
            <ListItem dense button>
              <ListItemText primary='DPS Summary' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Results, Spec and Gear' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Charts' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Abilities' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Buffs' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Procs' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Resources' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Benefits & Uptimes' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Statistics & Data Analysis' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Action Priority List' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Stats' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Gear' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Talents' />
            </ListItem>
            <ListItem dense button>
              <ListItemText primary='Profile' />
            </ListItem>

            <Divider />
          </List>
        </Collapse>
      </React.Fragment>
    ))

    return (
      <Drawer open variant='permanent' classes={{paper: classes.drawerPaper}}>
        <div className={classes.toolbar} />

        <List component='nav'>
          <ListItem
            button
            onClick={this.toggleNavigationSection('raidSummary')}
          >
            <ListItemText primary='Raid Summary' />
            {this.state.raidSummary ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.raidSummary} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
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

          <ListItem button onClick={this.toggleNavigationSection('actors')}>
            <ListItemText primary='Actors' />
            {this.state.actors ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.actors} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {playersNavigation}
            </List>

            <Divider />
          </Collapse>
        </List>
      </Drawer>
    )
  }
}

export default withStyles(styles)(Navigation)
