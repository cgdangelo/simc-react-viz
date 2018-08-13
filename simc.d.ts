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
  Beta: {
    build_level: number
    wow_version: string
  }

  Live: {
    build_level: number
    wow_version: string
  }

  version_used: string
}

declare interface ISimOptions {
  auto_ready_trigger: number
  average_gauss: number
  average_range: number
  challenge_mode: boolean
  channel_lag: number
  channel_lag_stddev: number
  confidence: number
  confidence_estimator: number
  dbc: IDbc
  debug: boolean
  debug_each: number
  default_aura_delay: number
  default_aura_delay_stddev: number
  default_skill: number
  deterministic: number
  enemy_death_pct: number
  expected_iteration_time: number
  fight_style: string
  fixed_time: boolean
  gcd_lag: number
  gcd_lag_stddev: number
  ignite_sampling_delta: number
  iterations: number
  log: number
  max_aoe_enemies: number
  max_time: number
  optimal_raid: number
  optimize_expressions: boolean
  pvp_crit: boolean
  queue_gcd_reduction: number
  queue_lag: number
  queue_lag_stddev: number
  reaction_time: number
  regen_periodicity: number
  rng: {
    name: string
  }
  seed: number
  show_etmi: boolean
  single_actor_batch: boolean
  stat_cache: number
  strict_gcd_queue: number
  target_error: number
  threads: number
  timewalk: number
  tmi_bin_size: number
  tmi_window_global: number
  travel_variance: number
  vary_combat_length: number
  world_lag: number
  world_lag_stddev: number
}

declare interface ISimOverrides {
  bleeding: number
  bloodlust: number
  bloodlust_percent: number
  bloodlust_time: number
  mortal_wounds: number
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
  id: number
  name: string
  spell_id: number
  tier: number
}

/** @deprecated */
declare interface IArtifactTrait {
  crucible_rank: number
  id: number
  name: string
  purchased_rank: number
  relic_rank: number
  spell_id: number
  total_rank: number
}

declare interface ISampleData {
  count: number
  mean: number
  sum: number
}

declare interface IExtremaSampleData extends ISampleData {
  max: number
  min: number
}

declare interface IExtendedSampleData extends IExtremaSampleData {
  distribution: number[]
  mean_std_dev: number
  mean_variance: number
  median: number
  q1: number
  q3: number
  std_dev: number
  variance: number
}

declare interface ITimelineData {
  data: number[]
  max: number
  mean: number
  mean_std_dev: number
  min: number
}

declare interface IActionSequenceAction {
  buffs: {
    name: string
    stacks: number
  }[]
  name: string
  resources: {
    [resourceName: string]: number
  }
  resources_max: {
    [resourceName: string]: number
  }
  target: string
  time: number
}

declare interface IBuffData {
  benefit: number
  interval: number
  name: string
  overflow_stacks: number
  overflow_total: number
  refresh_count: number
  spell: number
  start_count: number
  trigger: number
  uptime: number
}

declare interface IProcData {
  count: number
  name: string
  interval: number
}

declare interface IGainData {
  name: string

  // FIXME
  mana: {
    actual: number
    count: number
    overflow: number
  }
}

declare interface IActionResult {
  [resultType: string]: {
    actual_amount: IExtremaSampleData
    avg_actual_amount: IExtremaSampleData
    count: ISampleData
    fight_actual_amount: ISampleData
    fight_total_amount: ISampleData
    overkill_pct: ISampleData
    pct: number
    total_amount: ISampleData
  }
}

declare interface IActionStat {
  actual_amount: IExtremaSampleData
  direct_results: IActionResult
  name: string
  num_direct_results: ISampleData
  num_executes: ISampleData
  portion_amount: number
  portion_aps: IExtremaSampleData
  portion_apse: IExtremaSampleData
  school: string
  tick_results?: IActionResult
  total_amount: IExtremaSampleData
  total_intervals: ISampleData
  type: string
}

declare interface IGearPiece {
  agility?: number
  crit_rating?: number
  encoded_item: string
  haste_rating?: number
  ilevel: number
  intellect?: number
  mastery_rating?: number
  name: string
  stamina?: number
  strength?: number
  versatility_rating?: number
}

declare interface IActor {
  artifact: IArtifactTrait[]
  brain_lag: number
  brain_lag_stddev: number
  buffs: IBuffData[]
  bugs: boolean
  collected_data: {
    absorb?: IExtremaSampleData
    absorb_taken?: IExtremaSampleData
    action_sequence: IActionSequenceAction[]
    action_sequence_precombat: IActionSequenceAction[]
    aps?: IExtendedSampleData
    atps?: IExtendedSampleData
    buffed_stats: {
      attribute: {
        [attributeName: string]: number
      }
      resources: {
        [resourceName: string]: number
      }
      stats: {
        armor: number
        attack_crit: number
        attack_haste: number
        attack_speed: number
        damage_versatility: number
        dodge: number
        heal_versatility: number
        manareg_per_second: number
        mastery_value: number
        mitigation_versatility: number
        speed: number
        spell_crit: number
        spell_haste: number
        spell_power: number
        spell_speed: number
      }
    }
    combat_end_resource: {
      [resourceName: string]: IExtremaSampleData
    }
    compound_dmg: IExtremaSampleData
    dmg: IExtremaSampleData
    dps: IExtendedSampleData
    dpse: IExtendedSampleData
    dtps?: IExtendedSampleData
    effective_theck_meloree_index?: IExtendedSampleData
    executed_foreground_actions: IExtremaSampleData
    fight_length: IExtendedSampleData
    heal?: IExtremaSampleData
    heal_taken?: IExtremaSampleData
    hps?: IExtendedSampleData
    hpse?: IExtendedSampleData
    htps?: IExtendedSampleData
    max_spike_amount?: IExtendedSampleData
    prioritydps?: IExtendedSampleData
    resource_lost: {
      [resourceName: string]: ISampleData
    }
    resource_timelines: {
      [resourceName: string]: ITimelineData
    }
    theck_meloree_index?: IExtendedSampleData
    timeline_dmg: ITimelineData
    waiting_time: IExtremaSampleData
  }
  dbc: IDbc
  gains: IGainData[]
  gear: {
    [slotName: string]: IGearPiece
  }
  invert_scaling: number
  level: number
  name: string
  party: number
  potion_used: boolean
  procs: IProcData[]
  race: string
  reaction_max: number
  reaction_mean: number
  reaction_nu: number
  reaction_offset: number
  reaction_stddev: number
  ready_type: number
  role: ActorRole
  scale_player: boolean
  specialization: ClassSpecialization
  stats: IActionStat[]
  talents: ITalent[]
  timeofday: 'DAY_TIME' | 'NIGHT_TIME'
  world_lag: number
  world_lag_override: boolean
  world_lag_stddev_override: boolean
}

declare interface IRaidEvent {
  cooldown: number
  cooldown_max: number
  cooldown_min: number
  duration: number
  duration_max: number
  duration_min: number
  name: string
  saved_duration: number
}

declare interface IJsonReport {
  analyze_time_seconds: number
  build_date: string
  build_time: string
  elapsed_cpu_seconds: number
  elapsed_time_seconds: number
  git_revision: string
  init_time_seconds: number
  merge_time_seconds: number
  options: ISimOptions
  overrides: ISimOverrides
  players: IActor[]
  ptr_enabled: number
  raid_aps?: ISampleData
  raid_dps: ISampleData
  raid_events: IRaidEvent[]
  raid_hps?: ISampleData
  sim: {
    simulation_length: IExtendedSampleData
    statistics: {
      targets: IActor[]
      total_absorb?: ISampleData
      total_dmg: ISampleData
      total_heal?: ISampleData
      version: string
    }
  }
}
