/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.attackRange = 1;
    this.moveRange = 1;

    if (new.target.name === 'Character') throw new Error('You cannot create new object of Character. Please, use inherited classesr');
  }

    levelUp() {
      this.level += 1;
      this.attack = +(Math.max(this.attack, this.attack * (1.8 - (1 - this.health / 100)))
        .toFixed(1));
      this.defence = +(Math.max(this.defence, this.defence * (1.8 - (1 - this.health / 100)))
        .toFixed(1));
      this.health += 80;
      if (this.health > 100) this.health = 100;
  }
}
