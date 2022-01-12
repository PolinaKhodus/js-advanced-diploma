/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
export default class GameState {
  static from(object) {
    if (typeof object === 'object' && !Array.isArray(object)) return object;
       return null;
  }
}
