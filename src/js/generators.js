/* eslint-disable linebreak-style */
import randomInteger from './functions';
/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const randomClass = new allowedTypes[randomInteger(0, allowedTypes.length - 1)]();
  const randomLevel = randomInteger(1, maxLevel);
  randomClass.level = randomLevel;
  for (let i = 1; randomClass.level > i; i += 1) {
    randomClass.levelUp();
    randomClass.level -= 1;
  }
  yield randomClass;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    team.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return team;
}
