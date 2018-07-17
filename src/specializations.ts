import {
  brown,
  deepPurple,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '@material-ui/core/colors'

export const classColorMap = {
  'blood death knight': red[800],
  'frost death knight': red[800],
  'unholy death knight': red[800],
  'havoc demon hunter': purple[500],
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
  'affliction warlock': deepPurple[500],
  'demonology warlock': deepPurple[500],
  'destruction warlock': deepPurple[500],
  'protection warrior': brown[500],
  'arms warrior': brown[500],
  'fury warrior': brown[500],

  'default': indigo[200],
}

const classResourceMap = {
  'frost death knight': 'runic_power',
  'unholy death knight': 'runic_power',
  'havoc demon hunter': 'fury',
  'balance druid': 'astral_power',
  'feral druid': 'energy',
  'beast mastery hunter': 'focus',
  'marksmanship hunter': 'focus',
  'survival hunter': 'focus',
  'arcane mage': 'mana',
  'fire mage': 'mana',
  'frost mage': 'mana',
  'windwalker monk': 'energy',
  'retribution paladin': 'holy_power',
  'shadow priest': 'insanity',
  'assassination rogue': 'energy',
  'outlaw rogue': 'energy',
  'subtlety rogue': 'energy',
  'elemental shaman': 'maelstrom',
  'enhancement shaman': 'maelstrom',
  'affliction warlock': 'mana',
  'demonology warlock': 'mana',
  'destruction warlock': 'mana',
  'arms warrior': 'rage',
  'fury warrior': 'rage',

  'default': indigo[200],
}

export function getColorBySpecialization(specialization: string) {
  const lowerSpecialization = specialization.toLowerCase()

  if (lowerSpecialization in classColorMap) {
    return classColorMap[lowerSpecialization]
  }

  return indigo[500]
}

export function getPrimaryResourceBySpecialization(specialization: string) {
  const lowerSpecialization = specialization.toLowerCase()

  if (lowerSpecialization in classResourceMap) {
    return classResourceMap[lowerSpecialization]
  }

  return 'mana'
}
