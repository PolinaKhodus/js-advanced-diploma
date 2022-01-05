/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */

import Character from '../Character';
import Bowman from '../characters/Bowman';
import Deamon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

test('not allowed create new Character', () => {
  const newChar = () => new Character();
  expect(newChar).toThrowError();
});

test('allowed create new class extend Character', () => {
  const newChar = () => new Bowman();
  expect(newChar).not.toThrowError();
});

test('allowed create new class extend Character', () => {
  const newChar = () => new Deamon();
  expect(newChar).not.toThrowError();
});

test('allowed create new class extend Character', () => {
  const newChar = () => new Magician();
  expect(newChar).not.toThrowError();
});

test('allowed create new class extend Character', () => {
  const newChar = () => new Swordsman();
  expect(newChar).not.toThrowError();
});

test('allowed create new class extend Character', () => {
  const newChar = () => new Undead();
  expect(newChar).not.toThrowError();
});

test('allowed create new class extend Character', () => {
  const newChar = () => new Vampire();
  expect(newChar).not.toThrowError();
});
