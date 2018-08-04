declare type ClassSpecialization =
  'blood death knight' |
  'frost death knight' |
  'unholy death knight' |
  'havoc demon hunter' |
  'guardian druid' |
  'balance druid' |
  'feral druid' |
  'restoration druid' |
  'beast mastery hunter' |
  'marksmanship hunter' |
  'survival hunter' |
  'arcane mage' |
  'fire mage' |
  'frost mage' |
  'brewmaster monk' |
  'windwalker monk' |
  'mistweaver monk' |
  'protection paladin' |
  'retribution paladin' |
  'holy paladin' |
  'shadow priest' |
  'discipline priest' |
  'holy priest' |
  'assassination rogue' |
  'outlaw rogue' |
  'subtlety rogue' |
  'elemental shaman' |
  'enhancement shaman' |
  'restoration shaman' |
  'affliction warlock' |
  'demonology warlock' |
  'destruction warlock' |
  'protection warrior' |
  'arms warrior' |
  'fury warrior' |
  'default'

interface IDbc {
  // FIXME
  Live: {
    build_level: number
    wow_version: string
  }

  Beta: {
    build_level: number
    wow_version: string
  }

  version_used: string
}

declare interface ISimOptions {
  debug: boolean
  max_time: number
  expected_iteration_time: number
  vary_combat_length: number
  iterations: number
  target_error: number
  threads: number
  seed: number
  single_actor_batch: boolean
  queue_lag: number
  queue_lag_stddev: number
  gcd_lag: number
  gcd_lag_stddev: number
  channel_lag: number
  channel_lag_stddev: number
  queue_gcd_reduction: number
  strict_gcd_queue: number
  confidence: number
  confidence_estimator: number
  world_lag: number
  world_lag_stddev: number
  travel_variance: number
  default_skill: number
  reaction_time: number
  regen_periodicity: number
  ignite_sampling_delta: number
  fixed_time: boolean
  optimize_expressions: boolean
  optimal_raid: number
  log: number
  debug_each: number
  auto_ready_trigger: number
  stat_cache: number
  max_aoe_enemies: number
  show_etmi: boolean
  tmi_window_global: number
  tmi_bin_size: number
  enemy_death_pct: number
  challenge_mode: boolean
  timewalk: number
  pvp_crit: boolean
  rng: {
    name: string
  }
  deterministic: number
  average_range: number
  average_gauss: number
  fight_style: string
  default_aura_delay: number
  default_aura_delay_stddev: number
  dbc: IDbc
}

declare interface ISimOverrides {
  mortal_wounds: number
  bleeding: number
  bloodlust: number
  bloodlust_percent: number
  bloodlust_time: number
}

declare const enum ActorRole {
  ATTACK = 'attack',
  DPS = 'dps',
  HEAL = 'heal',
  HYBRID = 'hybrid',
  SPELL = 'spell',
  TANK = 'tank'
}

declare interface ITalent {
  tier: number
  id: number
  spell_id: number
  name: string
}

declare interface IArtifactTrait {
  id: number
  spell_id: number
  name: string
  total_rank: number
  purchased_rank: number
  crucible_rank: number
  relic_rank: number
}

declare interface ISampleData {
  sum: number
  count: number
  mean: number
}

declare interface IExtremaSampleData extends ISampleData {
  min: number
  max: number
}

declare interface IExtendedSampleData extends IExtremaSampleData {
  median: number
  variance: number
  std_dev: number
  mean_variance: number
  mean_std_dev: number
  distribution: number[]

  // Custom
  q1: number
  q3: number
}

declare interface ITimelineData {
  mean: number
  mean_std_dev: number
  min: number
  max: number
  data: number[]
}

declare interface IActionSequenceAction {
  time: number
  name: string
  target: string
  buffs: Array<{
    name: string
    stacks: number
  }>
  resources: {
    [resourceName: string]: number
  }
  resources_max: {
    [resourceName: string]: number
  }
}

declare interface IBuffData {
  name: string
  spell: number
  start_count: number
  refresh_count: number
  interval: number
  trigger: number
  uptime: number
  benefit: number
  overflow_stacks: number
  overflow_total: number
}

declare interface IProcData {
  name: string
  interval: number
  count: number
}

declare interface IGainData {
  name: string

  // FIXME
  mana: {
    actual: number
    overflow: number
    count: number
  }
}

declare interface IActionStat {
  name: string
  school: string
  type: string
  num_executes: ISampleData
  portion_aps: IExtremaSampleData
  portion_apse: IExtremaSampleData
  portion_amount: number
  actual_amount: IExtremaSampleData
  total_amount: IExtremaSampleData
  total_intervals: ISampleData
  num_direct_results: ISampleData
  direct_results: {
    [resultType: string]: {
      actual_amount: IExtremaSampleData
      avg_actual_amount: IExtremaSampleData
      total_amount: ISampleData
      fight_actual_amount: ISampleData
      fight_total_amount: ISampleData
      overkill_pct: ISampleData
      count: ISampleData
      pct: number
    }
  }
}

declare interface IGearPiece {
  name: string
  encoded_item: string
  ilevel: number
  stamina?: number
  agility?: number
  intellect?: number
  strength?: number
  crit_rating?: number
  haste_rating?: number
  mastery_rating?: number
  versatility_rating?: number
}

declare interface IActor {
  name: string
  race: string
  level: number
  role: ActorRole
  specialization: ClassSpecialization
  talents: ITalent[]
  artifact: IArtifactTrait[]
  party: number
  ready_type: number
  bugs: boolean
  scale_player: boolean
  potion_used: boolean
  timeofday: 'DAY_TIME' | 'NIGHT_TIME'
  invert_scaling: number
  reaction_offset: number
  reaction_max: number
  reaction_mean: number
  reaction_stddev: number
  reaction_nu: number
  world_lag: number
  brain_lag: number
  brain_lag_stddev: number
  world_lag_override: boolean
  world_lag_stddev_override: boolean
  dbc: IDbc
  collected_data: {
    fight_length: IExtendedSampleData
    waiting_time: IExtremaSampleData
    executed_foreground_actions: IExtremaSampleData
    dmg: IExtremaSampleData
    compound_dmg: IExtremaSampleData
    timeline_dmg: ITimelineData
    dps: IExtendedSampleData
    dpse: IExtendedSampleData
    prioritydps?: IExtendedSampleData
    resource_lost: {
      [resourceName: string]: ISampleData
    }
    combat_end_resource: {
      [resourceName: string]: IExtremaSampleData
    }
    resource_timelines: {
      [resourceName: string]: ITimelineData
    }
    action_sequence_precombat: IActionSequenceAction[]
    action_sequence: IActionSequenceAction[]
    buffed_stats: {
      attribute: {
        [attributeName: string]: number
      }
      resources: {
        [resourceName: string]: number
      }
      stats: {
        spell_power: number
        spell_crit: number
        attack_crit: number
        spell_haste: number
        attack_haste: number
        spell_speed: number
        attack_speed: number
        mastery_value: number
        damage_versatility: number
        heal_versatility: number
        mitigation_versatility: number
        speed: number
        manareg_per_second: number
        armor: number
        dodge: number
      }
    }
  }
  buffs: IBuffData[]
  procs: IProcData[]
  gains: IGainData[]
  stats: IActionStat[]
  gear: {
    [slotName: string]: IGearPiece
  }
}

declare interface IRaidEvent {
  name: string
  cooldown: number
  cooldown_min: number
  cooldown_max: number
  duration: number
  duration_min: number
  duration_max: number
  saved_duration: number
}

declare interface IJsonReport {
  version: string
  ptr_enabled: number
  build_date: string
  build_time: string
  git_revision: string
  sim: {
    options: ISimOptions
    overrides: ISimOverrides
    players: IActor[]
    targets: IActor[]
    raid_events: IRaidEvent[]
    statistics: {
      elapsed_cpu_seconds: number
      elapsed_time_seconds: number
      init_time_seconds: number
      merge_time_seconds: number
      analyze_time_seconds: number
      simulation_length: IExtendedSampleData
      raid_dps: ISampleData
      total_dmg: ISampleData
      raid_hps?: ISampleData
      total_heal?: ISampleData
      raid_aps?: ISampleData
      total_absorb?: ISampleData
    }
  }
}
