/* eslint-disable linebreak-style */
import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
    this.attackRange = 4;
    this.moveRange = 1;
  }
}
