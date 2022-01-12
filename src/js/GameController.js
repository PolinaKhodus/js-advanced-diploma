/* eslint-disable linebreak-style */
/* eslint-disable prefer-const */
/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
import { Math } from 'core-js';
import themes from './themes';
import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import GamePlay from './GamePlay';
import randomInteger, { matrix, wait, allowed } from './functions';
import GameState from './GameState';

import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.charArr = [];
    this.selectedChar = null;
    this.matrix = null;
    this.state = null;
    this.currentLevel = 1;
    this.whoisTurn = 'man';
  }

  init() {
    this.gamePlayClearListner();

    const light = [Magician, Swordsman, Bowman];
    const dark = [Vampire, Undead, Daemon];
    this.gamePlay.drawUi(themes.prairie);
    this.matrix = matrix(this.gamePlay.cells.length);

    const { cells } = this.gamePlay;

    const cellIndexs = (cell) => cells.indexOf(cell) % 8;

    const lightCells = () => {
      const cellsArr = [];
      cells.forEach((elem) => {
        if (cellIndexs(elem) === 0 || cellIndexs(elem) === 1) {
          cellsArr.push(cells.indexOf(elem));
        }
      });
      return cellsArr;
    };

    const darkCells = () => {
      const cellsArr = [];
      cells.forEach((elem) => {
        if (cellIndexs(elem) === 7 || cellIndexs(elem) === 7) {
          cellsArr.push(cells.indexOf(elem));
        }
      });
      return cellsArr;
    };

    const getPos = (cellsArr, team) => {
      const set = new Set();

      const reverted = () => {
        set.add(randomInteger(0, cellsArr.length - 1));
        if (set.size !== team.length) return reverted();
        return set;
      };
      reverted();

      const unSet = [...set];
      const positionsArr = [];
      unSet.forEach((e) => {
        positionsArr.push(new PositionedCharacter(team[unSet.indexOf(e)], cellsArr[e]));
      });
      return positionsArr;
    };

    const drawTheme = () => {
      const theme = {
        1: themes.prairie,
        2: themes.desert,
        3: themes.arctic,
        4: themes.mountain,
      }[this.currentLevel];
      return this.gamePlay.drawUi(theme);
    };

    if (this.currentLevel > 1 && this.stateService.load().status === undefined) {
      drawTheme();
      const newCharCount = (this.currentLevel === 2) ? 1 : 2;
      const newLightArr = this.charArr.map((e) => {
        e.character.levelUp();
        return e.character;
      });

      this.charArr = [];
      getPos(lightCells(), newLightArr.concat(generateTeam(light, this.currentLevel - 1,
        newCharCount)))
        .forEach((e) => this.charArr.push(e));

      const darkSize = this.charArr.length;
      getPos(darkCells(), generateTeam(dark, this.currentLevel - 1,
        darkSize))
        .forEach((e) => this.charArr.push(e));
    } else {
      getPos(lightCells(), generateTeam(light, 1, 2)).forEach((e) => this.charArr.push(e));
      getPos(darkCells(), generateTeam(dark, 1, 2)).forEach((e) => this.charArr.push(e));

      const checkPoints = this.stateService.load();
      if (checkPoints === null || checkPoints.points === undefined) {
        const newPoints = { points: 0 };
        this.stateService.save(newPoints);
      }

      if (this.stateService.load().status !== undefined) {
        this.charArr = [];
        const load = this.stateService.load();
        this.currentLevel = load.currentLevel;

        load.arrOfChar.forEach((e) => {
          light.concat(dark).forEach((Class) => {
            const newChar = new Class();
            if (e.character.type === newChar.type) {
              Object.entries(e.character).forEach((elem) => {
                 newChar[elem[0]] = elem[1];
              });
              this.charArr.push(new PositionedCharacter(newChar, e.position));
            }
          });
        });
        this.whoisTurn = load.whoisTurn;
        this.saveAndLoad();
      }
      drawTheme();
    }

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.redrawPositions(this.charArr);

    this.gamePlay.addNewGameListener(() => {
      this.saveAndLoad('new game');
      this.clean();
      this.charArr = [];
      this.currentLevel = 1;
      this.init();
    });

    this.gamePlay.addSaveGameListener(() => {
      this.saveAndLoad();
      alert('Игра сохранена!');
    });

    this.gamePlay.addLoadGameListener(() => {
      this.saveAndLoad('load');
      this.init();
      alert('Игра загружена!');
    });
  }

  onCellClick(index) {
    if (this.gamePlay.boardEl.style.cursor === 'not-allowed') GamePlay.showError('Недопустимое действие');
    this.charArr.forEach((char) => {
      if (char.position === index) {
        if (char.character.type === 'swordsman' || char.character.type === 'magician' || char.character.type === 'bowman') {
          if (this.selectedChar !== null
             && this.selectedChar.position === index) {
            this.gamePlay.deselectCell(this.selectedChar.position);
            this.selectedChar = null;
          } else {
            if (this.selectedChar !== null) this.gamePlay.deselectCell(this.selectedChar.position);
            this.gamePlay.selectCell(index);
            this.selectedChar = char;
          }
        } else if (this.state !== null && this.state.status === 'attack') {
          const go = (async () => {
            const attack = await wait.call(this);
            const test = await this.clean();
            const bot = await this.AI();
            return null;
          })();
        } else {
          GamePlay.showError('Это игрок компьютера');
        }
      }
    });
    if (this.state !== null && this.state.status === 'walk') {
      this.charArr.forEach((e) => {
        if (e === this.selectedChar) {
          this.gamePlay.deselectCell(this.selectedChar.position);
          e.position = index;
          this.gamePlay.redrawPositions(this.charArr);
          this.clean();
          this.AI();
        }
      });
    }
  }

  onCellEnter(index) {
    (async () => {
      this.state = null;
      const charbase = {
        medal: '\ud83c\udf96',
        swords: '\u2694',
        defense: '\ud83d\udee1',
        health: '\u2764',
      };
      this.gamePlay.setCursor('auto');
      this.charArr.forEach((e) => {
        if (e.position === index) {
          const message = `${charbase.medal}${e.character.level} `
        + `${charbase.swords}${e.character.attack} `
        + `${charbase.defense}${e.character.defence} `
        + `${charbase.health}${e.character.health} `;

          this.gamePlay.showCellTooltip(message, index);
          this.gamePlay.setCursor('pointer');
        }
      });
      if (this.selectedChar !== null) {
        let moveRange = this.selectedChar.character.moveRange;
        const goArr = this.allowedArr(this.selectedChar.position, moveRange);
        if (goArr.indexOf(index) !== -1) {
          this.gamePlay.setCursor('pointer');
          this.gamePlay.selectCell(index, 'green');
          this.state = { status: 'walk', index };
        } else {
          this.gamePlay.setCursor('not-allowed');
          this.state = null;
        }
        let attackRange = this.selectedChar.character.attackRange;
        const attackArr = this.allowedArr(this.selectedChar.position, attackRange, 'attack');

        this.charArr.forEach((e) => {
          if (e.character.type === 'daemon' || e.character.type === 'vampire' || e.character.type === 'undead') {
            if (attackArr.indexOf(e.position) !== -1 && index === e.position) {
              this.gamePlay.setCursor('crosshair');
              this.gamePlay.selectCell(index, 'red');
              this.state = { status: 'attack', target: e };
            }
          } else if (e.position === index) {
            this.gamePlay.setCursor('pointer');
          }
        });
      }
    })();
  }

  onCellLeave(index) {
    if (this.selectedChar !== null
      && this.selectedChar.position !== index) this.gamePlay.deselectCell(index);
  }

  saveAndLoad(type = 'save') {
    const saveObj = this.stateService.load();
    if (type === 'save') {
      saveObj.arrOfChar = this.charArr;
      saveObj.currentLevel = this.currentLevel;
      saveObj.whoisTurn = this.whoisTurn;
      delete saveObj.status;
    } else if (type === 'load') {
      if (saveObj.arrOfChar === undefined) {
        alert('Сохранения не найдены');
        throw new Error();
      }
      saveObj.status = 'load';
    } else {
      delete saveObj.arrOfChar;
      delete saveObj.currentLevel;
      delete saveObj.whoisTurn;
    }
    this.stateService.save(GameState.from(saveObj));
  }

  gamePlayClearListner(type) {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    if (type !== 'block') {
      this.gamePlay.newGameListeners = [];
      this.gamePlay.saveGameListeners = [];
      this.gamePlay.loadGameListeners = [];
    }
  }

  matrixSearch(el) {
    const arr = [];
    this.matrix.forEach((e) => {
      if (e.indexOf(el) !== -1) arr.push(this.matrix.indexOf(e), e.indexOf(el));
    });
    return arr;
  }

  allowedArr(index, range, arr = 'walk') {
    const mainIndex = this.matrixSearch(index);
    const horizontalCellsArr = [...allowed(mainIndex[1] - range, mainIndex[1] + range)];

    const allowedCells = [];
    horizontalCellsArr.forEach((horizontalIndex) => {
      for (let i = -range; i < range + 1; i += 1) {
        const verticalIndex = mainIndex[0] + i;
        if (verticalIndex > -1 && verticalIndex < this.matrix[0].length) {
          if (this.matrix[verticalIndex][horizontalIndex] !== undefined
            && this.matrix[verticalIndex][horizontalIndex] !== index) {
            const arrNotAllowed = (arr === 'walk') ? this.charArr.map((elem) => elem.position) : [];

            if (arrNotAllowed.indexOf(this.matrix[verticalIndex][horizontalIndex]) === -1) {
              allowedCells.push(this.matrix[verticalIndex][horizontalIndex]);
            }
          }
        }
      }
    });
    allowedCells.sort((a, b) => a - b);
    return allowedCells;
  }

  clean() {
    const refuseArr = [...allowed(0, this.gamePlay.cells.length - 1)];
    refuseArr.forEach((e) => this.gamePlay.deselectCell(e));
    this.state = null;
    this.selectedChar = null;
    this.whoisTurn = (this.whoisTurn === 'bot') ? 'man' : 'bot';
  }

  AI() {
    const darkArr = this.charArr.filter((char) => {
      const { type } = char.character;
      return type === 'daemon' || type === 'undead' || type === 'vampire';
    });
    const lightArr = this.charArr.filter((char) => {
      const { type } = char.character;
      return type === 'swordsman' || type === 'magician' || type === 'bowman';
    });

    const think = [];
    darkArr.forEach((e) => {
      const attackArr = this.allowedArr(e.position, e.character.attackRange, 'attack');
      lightArr.forEach((char) => {
        if (attackArr.indexOf(char.position) !== -1) {
          think.push({ attacker: e, defender: char });
        }
      });
    });
    think.sort((a, b) => {
      const { attack } = a.attacker.character;
      const { defence } = a.defender.character;
      const { attack: attackB } = b.attacker.character;
      const { defence: defenceB } = b.defender.character;
      return (defence - attack) - (defenceB - attackB);
    });

    if (think.length > 0) {
      this.selectedChar = think[0].attacker;
      this.state = { status: 'attack', target: think[0].defender };
      wait.call(this);
      this.clean();
    } else {
      const closesArrUnic = new Set();
      lightArr.forEach((e) => {
        this.allowedArr(e.position, 1).forEach((elem) => closesArrUnic.add(elem));
      });
      const closesArr = [...closesArrUnic];

      const walk = [];
      darkArr.forEach((char) => {
        const goArrEnemy = this.allowedArr(char.position, char.character.moveRange);
        goArrEnemy.forEach((e) => {
          if (closesArr.indexOf(e) !== -1) {
            walk.push({ walker: char, where: e });
          }
        });
      });

      if (walk.length > 0) {
        const whoWalk = walk[randomInteger(0, walk.length - 1)];
        this.charArr[this.charArr.indexOf(whoWalk.walker)].position = whoWalk.where;
        this.gamePlay.redrawPositions(this.charArr);
        this.clean();
      } else {
        const randomEnemy = lightArr[randomInteger(0, lightArr.length - 1)];
        const randomWalker = darkArr[randomInteger(0, darkArr.length - 1)];

        const enemyIndexes = this.matrixSearch(randomEnemy.position);
        const walkerArr = this.allowedArr(randomWalker.position, randomWalker.character.moveRange)
          .map((e) => this.matrixSearch(e));

        const bigger = walkerArr.reduce((a, b) => (Math.abs(b[0] - enemyIndexes[0])
        < Math.abs(a[0] - enemyIndexes[0]) ? b : a));

        const filtredByBigger = walkerArr.filter((e) => e[0] === bigger[0]);

        const nearest = filtredByBigger.reduce((a, b) => (Math.abs(b[1] - enemyIndexes[1])
        < Math.abs(a[1] - enemyIndexes[1]) ? b : a));

        this.charArr[this.charArr.indexOf(randomWalker)].position = this
          .matrix[nearest[0]][nearest[1]];
        this.gamePlay.redrawPositions(this.charArr);
        this.clean();
      }
    }
  }
}
