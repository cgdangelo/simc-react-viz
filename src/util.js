import { brown, deepPurple, grey, indigo, lightBlue, lightGreen, orange, pink, purple, red, teal, yellow } from '@material-ui/core/colors'

export const classColorMap = {
  'blood death knight': red[800],
  'frost death knight': red[800],
  'unholy death knight': red[800],
  'havoc demon hunter': purple[500],
  'vengeance demon hunter': purple[500],
  'guardian druid': orange[500],
  'balance druid': orange[500],
  'feral druid': orange[500],
  'restoration druid': orange[500],
  'beast mastery hunter': lightGreen[500],
  'marksmanship hunter': lightGreen[500],
  'survival hunter': lightGreen[500],
  'arcane mage': lightBlue[500],
  'fire mage': lightBlue[500],
  'frost mage': lightBlue[500],
  'brewmaster monk': teal.A400,
  'windwalker monk': teal.A400,
  'mistweaver monk': teal.A400,
  'protection paladin': pink[200],
  'retribution paladin': pink[200],
  'holy paladin': pink[300],
  'shadow priest': grey[200],
  'discipline priest': grey[200],
  'holy priest': grey[200],
  'assassination rogue': yellow[500],
  'outlaw rogue': yellow[500],
  'subtlety rogue': yellow[500],
  'elemental shaman': indigo.A700,
  'enhancement shaman': indigo.A700,
  'restoration shaman': indigo.A700,
  'affliction warlock': deepPurple[200],
  'demonology warlock': deepPurple[200],
  'destruction warlock': deepPurple[200],
  'protection warrior': brown[500],
  'arms warrior': brown[500],
  'fury warrior': brown[500],

  default: indigo[200]
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

  return indigo[500]
}

export function getPrimaryResourceBySpecialization (specialization) {
  const lowerSpecialization = specialization.toLowerCase()

  if (lowerSpecialization in classResourceMap) {
    return classResourceMap[lowerSpecialization]
  }

  return 'mana'
}

export const getTalentTierLevel = (tier) => tier !== 7 ? tier * 15 : 100

// @TODO Other multi-schools
export const getColorBySchool = (school = '') => {
  switch (school.toLowerCase()) {
    case 'physical':
      return getColorBySpecialization('arms warrior')

    case 'holy':
      return yellow['A200']

    case 'fire':
      return getColorBySpecialization('frost death knight')

    case 'nature':
      return getColorBySpecialization('marksmanship hunter')

    case 'frost':
      return getColorBySpecialization('elemental shaman')

    case 'shadow':
      return deepPurple['A100']

    case 'arcane':
      return getColorBySpecialization('arcane mage')

    case 'elemental':
      return getColorBySpecialization('windwalker monk')

    case 'frostfire':
      return purple['A400']

    case 'chaos':
      return lightGreen['A700']

    default:
      return grey[50]
  }
}
