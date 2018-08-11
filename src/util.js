/* eslint-disable sort-keys */
import { decomposeColor, recomposeColor } from '@material-ui/core/styles/colorManipulator'

export const classColorMap = {
  'blood death knight': '#C41F3B',
  'frost death knight': '#C41F3B',
  'unholy death knight': '#C41F3B',
  'havoc demon hunter': '#A330C9',
  'vengeance demon hunter': '#A330C9',
  'guardian druid': '#FF7D0A',
  'balance druid': '#FF7D0A',
  'feral druid': '#FF7D0A',
  'restoration druid': '#FF7D0A',
  'beast mastery hunter': '#ABD473',
  'marksmanship hunter': '#ABD473',
  'survival hunter': '#ABD473',
  'arcane mage': '#69CCF0',
  'fire mage': '#69CCF0',
  'frost mage': '#69CCF0',
  'brewmaster monk': '#00FF96',
  'windwalker monk': '#00FF96',
  'mistweaver monk': '#00FF96',
  'protection paladin': '#F58CBA',
  'retribution paladin': '#F58CBA',
  'holy paladin': '#F58CBA',
  'shadow priest': '#FFFFFF',
  'discipline priest': '#FFFFFF',
  'holy priest': '#FFFFFF',
  'assassination rogue': '#FFF569',
  'outlaw rogue': '#FFF569',
  'subtlety rogue': '#FFF569',
  'elemental shaman': '#0070DE',
  'enhancement shaman': '#0070DE',
  'restoration shaman': '#0070DE',
  'affliction warlock': '#9482C9',
  'demonology warlock': '#9482C9',
  'destruction warlock': '#9482C9',
  'protection warrior': '#C79C6E',
  'arms warrior': '#C79C6E',
  'fury warrior': '#C79C6E',

  default: '#FFFFFF'
}

const classResourceMap = {
  'blood death knight': 'runic_power',
  'frost death knight': 'runic_power',
  'unholy death knight': 'runic_power',
  'havoc demon hunter': 'fury',
  'vengeance demon hunter': 'pain',
  'guardian druid': 'rage',
  'balance druid': 'astral_power',
  'feral druid': 'energy',
  'restoration druid': 'mana',
  'beast mastery hunter': 'focus',
  'marksmanship hunter': 'focus',
  'survival hunter': 'focus',
  'arcane mage': 'mana',
  'fire mage': 'mana',
  'frost mage': 'mana',
  'brewmaster monk': 'energy',
  'windwalker monk': 'energy',
  'mistweaver monk': 'mana',
  // 'protection paladin': 'mana',
  'protection paladin': null,
  'retribution paladin': 'holy_power',
  'holy paladin': 'mana',
  'shadow priest': 'insanity',
  'discipline priest': 'mana',
  'holy priest': 'mana',
  'assassination rogue': 'energy',
  'outlaw rogue': 'energy',
  'subtlety rogue': 'energy',
  'elemental shaman': 'maelstrom',
  'enhancement shaman': 'maelstrom',
  'restoration shaman': 'mana',
  'affliction warlock': 'mana',
  'demonology warlock': 'mana',
  'destruction warlock': 'mana',
  'protection warrior': 'rage',
  'arms warrior': 'rage',
  'fury warrior': 'rage',

  default: 'mana'
}

export function getColorBySpecialization (specialization) {
  const lowerSpecialization = specialization.toLowerCase()

  if (lowerSpecialization in classColorMap) {
    return classColorMap[lowerSpecialization]
  }

  return '#FFFFFF'
}

export function getPrimaryResourceBySpecialization (specialization) {
  const lowerSpecialization = specialization.toLowerCase()

  if (lowerSpecialization in classResourceMap) {
    return classResourceMap[lowerSpecialization]
  }

  return 'mana'
}

export const getTalentTierLevel = (tier) => tier !== 7 ? tier * 15 : 100

export const getColorBySchool = (school = '') => {
  switch (school.toLowerCase()) {
    case 'physical':
      return getColorBySpecialization('arms warrior')

    case 'holy':
      return '#FFCC00'

    case 'fire':
      return getColorBySpecialization('frost death knight')

    case 'nature':
      return getColorBySpecialization('marksmanship hunter')

    case 'frost':
      return getColorBySpecialization('elemental shaman')

    case 'shadow':
      return '#9482C9'

    case 'arcane':
      return getColorBySpecialization('arcane mage')

    case 'elemental':
      return getColorBySpecialization('windwalker monk')

    case 'frostfire':
      return '#9900CC'

    case 'chaos':
      return '#00C800'

    case 'flamestrike':
      return mixColors(getColorBySchool('physical'), getColorBySchool('fire'))

    case 'froststrike':
      return mixColors(getColorBySchool('physical'), getColorBySchool('frost'))

    case 'spellstrike':
      return mixColors(getColorBySchool('physical'), getColorBySchool('arcane'))

    case 'stormstrike':
      return mixColors(getColorBySchool('physical'), getColorBySchool('nature'))

    case 'shadowstrike':
      return mixColors(getColorBySchool('physical'), getColorBySchool('shadow'))

    case 'holystrike':
      return mixColors(getColorBySchool('physical'), getColorBySchool('holystrike'))

    case 'spellfire':
      return mixColors(getColorBySchool('fire'), getColorBySchool('nature'))

    case 'shadowflame':
      return mixColors(getColorBySchool('shadow'), getColorBySchool('fire'))

    case 'holyfire':
      return mixColors(getColorBySchool('holy'), getColorBySchool('fire'))

    case 'spellfrost':
      return mixColors(getColorBySchool('arcane'), getColorBySchool('frost'))

    case 'froststorm':
      return mixColors(getColorBySchool('frost'), getColorBySchool('nature'))

    case 'shadowfrost':
      return mixColors(getColorBySchool('shadow'), getColorBySchool('frost'))

    case 'holyfrost':
      return mixColors(getColorBySchool('holy'), getColorBySchool('frost'))

    case 'astral':
      return mixColors(getColorBySchool('arcane'), getColorBySchool('nature'))

    case 'spellshadow':
      return mixColors(getColorBySchool('arcane'), getColorBySchool('shadow'))

    case 'divine':
      return mixColors(getColorBySchool('arcane'), getColorBySchool('holy'))

    case 'shadowstorm':
      return mixColors(getColorBySchool('shadow'), getColorBySchool('nature'))

    case 'holystorm':
      return mixColors(getColorBySchool('holy'), getColorBySchool('nature'))

    case 'shadowlight':
      return mixColors(getColorBySchool('shadow'), getColorBySchool('holy'))

    case 'chromatic':
      return mixColors(
        getColorBySchool('fire'),
        getColorBySchool('frost'),
        getColorBySchool('arcane'),
        getColorBySchool('nature'),
        getColorBySchool('shadow')
      )

    case 'magic':
      return mixColors(getColorBySchool('chromatic'), getColorBySchool('holy'))

    default:
      return '#666666'
  }
}

export const getColorByResource = (resource = '') => {
  switch (resource.toLowerCase()) {
    case 'health':
      return getColorBySpecialization('marksmanship hunter')

    case 'mana':
      return getColorBySpecialization('elemental shaman')

    case 'energy':
    case 'focus':
    case 'combo_point':
      return getColorBySpecialization('subtlety rogue')

    case 'rage':
    case 'runic_power':
      return getColorBySpecialization('frost death knight')

    case 'holy_power':
      return getColorBySpecialization('retribution paladin')

    case 'soul_shard':
      return getColorBySpecialization('affliction warlock')

    case 'astral_power':
      return getColorBySpecialization('balance druid')

    case 'chi':
      return getColorBySpecialization('windwalker monk')

    case 'maelstrom':
      return '#FF9900'

    case 'rune':
      return getColorBySpecialization('arcane mage')

    case 'none':
    default:
      return '#666666'
  }
}

export const mixColors = (...colors) => {
  if (colors.length > 2) {
    return colors.reduce((p, c) => mixColors(p, c), colors[0])
  }

  const [c1, c2] = colors
  const [c1r, c1g, c1b] = decomposeColor(c1).values
  const [c2r, c2g, c2b] = decomposeColor(c2).values

  return recomposeColor({
    type: 'rgb',
    values: [
      (c1r + c2r) / 2,
      (c1g + c2g) / 2,
      (c1b + c2b) / 2
    ]
  })
}
