import Character from '../Character';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';


test('should return error if user use "new Character()"', () => {
  const expected = 'Character should created through type';
  expect(() => new Character(1)).toThrow(expected);
});

test('should not return an error', () => {
  expect(() => new Bowman(1)).not.toThrow();
});

test('should not return an error', () => {
  expect(() => new Daemon(1)).not.toThrow();
});

test('should not return an error', () => {
  expect(() => new Magician(1)).not.toThrow();
});

vtest('should not return an error', () => {
  expect(() => new Swordsman(1)).not.toThrow();
});

test('should not return an error', () => {
  expect(() => new Undead(1)).not.toThrow();
});

test('should not return an error', () => {
  expect(() => new Vampire(1)).not.toThrow();
});
