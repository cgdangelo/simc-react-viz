import * as React from 'react'
import RaidSummary from './RaidSummary'
import TitleBar from './TitleBar'

const Report = (report: IJsonReport) => (
  <React.Fragment>
    <TitleBar
      buildDate={report.build_date}
      buildTime={report.build_time}
      fightStyle={report.sim.options.fight_style}
      iterations={report.sim.options.iterations}
      maxTime={report.sim.options.max_time}
      targetError={report.sim.options.target_error}
      varyCombatLength={report.sim.options.vary_combat_length}
    />

    <RaidSummary
      players={report.sim.players}
      raidDps={report.sim.statistics.raid_dps.mean}
      raidEvents={report.sim.raid_events}
      totalDamage={report.sim.statistics.total_dmg.mean}
    />
  </React.Fragment>
)

export default Report
