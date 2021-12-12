/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const randomIndex = getRandomInt(allowedTypes.length);
  const RandomItemType = allowedTypes[randomIndex];
  yield new RandomItemType(maxLevel);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);

  export function generateTeam(allowedTypes, maxLevel, characterCount) {
    const membersTeam = [];
    while (membersTeam.length !== characterCount) {
      const member = characterGenerator(allowedTypes, maxLevel).next().value;
      membersTeam.push(member);
    }
  
    return membersTeam;
  }
