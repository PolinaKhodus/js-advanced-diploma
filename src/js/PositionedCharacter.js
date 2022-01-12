/* eslint-disable linebreak-style */
import Character from './Character';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('персонаж должен быть экземпляром Персонажа или его потомков');
    }

    if (typeof position !== 'number') {
      throw new Error('позиция должна быть числомr');
    }

    this.character = character;
    this.position = position;
  }
}
