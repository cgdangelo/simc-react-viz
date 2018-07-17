import { StyleRulesCallback, WithStyles } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse/Collapse'
import Divider from '@material-ui/core/Divider/Divider'
import Drawer from '@material-ui/core/Drawer/Drawer'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import * as React from 'react'

const styles: StyleRulesCallback = theme => createStyles({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 300
  }
})

export interface INavigationProps extends WithStyles<typeof styles> {
  players: IActor[]
}

interface INavigationState {
  raidSummary: boolean
  actors: boolean
}

class Navigation extends React.PureComponent<INavigationProps, INavigationState> {
  constructor (props: INavigationProps) {
    super(props)

    this.state = {
      raidSummary: false,
      actors: false
    }
  }

  toggleNavigationSection (name: string) {
    return () => {
      this.setState({
        // ...
      })
    }
  }

  public render () {
    const { classes, players } = this.props

    const playersNavigation = players.map(player => (
      <React.Fragment key={player.name}>
        <ListItem button={true} onClick={this.toggleNavigationSection(player.name)}>
          <ListItemText primary={player.name} />
        </ListItem>
        <Collapse>
          <List>
            <ListItem dense={true} button={true}>
              <ListItemText primary='DPS Summary' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Results, Spec and Gear' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Charts' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Abilities' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Buffs' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Procs' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Resources' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Benefits & Uptimes' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Statistics & Data Analysis' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Action Priority List' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Stats' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Gear' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Talents' />
            </ListItem>
            <ListItem dense={true} button={true}>
              <ListItemText primary='Profile' />
            </ListItem>
            <Divider />
          </List>
        </Collapse>
      </React.Fragment>
    ))

    return (
      <Drawer
        open={true}
        variant='permanent'
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        <List
          component='nav'
        >
          <ListItem
            button={true}
            onClick={this.toggleNavigationSection('raidSummary')}
          >
            <ListItemText primary='Raid Summary' />
          </ListItem>
          <Collapse
            in={this.state.raidSummary}
            timeout='auto'
            unmountOnExit={true}
          >
            <List
              component='div'
              disablePadding={true}
            >
              <ListItem button={true}>
                <ListItemText primary='Damage per Second' />
              </ListItem>
              <ListItem button={true}>
                <ListItemText primary='Actions per Minute' />
              </ListItem>
              <ListItem button={true}>
                <ListItemText primary='DPS Variance' />
              </ListItem>
            </List>
            <Divider />
          </Collapse>

          <ListItem
            button={true}
            onClick={this.toggleNavigationSection('actors')}
          >
            <ListItemText primary='Actors' />
          </ListItem>
          <Collapse
            in={this.state.actors}
            timeout='auto'
            unmountOnExit={true}
          >
            <List
              component='div'
              disablePadding={true}
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

export default withStyles(styles)(Navigation)
