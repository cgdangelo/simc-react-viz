import * as React from 'react'
import RaidSummary from './RaidSummary'
import TitleBar from './TitleBar'

const Report = (report: IJsonReport) => {
  const versionUsed = report.sim.options.dbc.version_used
  const gameData = report.sim.options.dbc[versionUsed]

  return (
    <>
      <TitleBar
        simcVersion={report.version}
        gameVersion={versionUsed}
        wowVersion={gameData.wow_version}
        buildLevel={gameData.build_level}
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
    </>
  )
}

export default Report
