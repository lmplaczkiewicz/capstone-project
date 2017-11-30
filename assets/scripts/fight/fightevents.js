'use strict'

const store = require('../store')
const Roll = require('roll')
let roll = new Roll()
let characterRoll
let monsterRoll
let activeFighter

const fightTurns = function () {
  if (activeFighter === 1) {

  }
}

// const aiCellInput = function (squareSelected) {
//   if (player === 0) {
//     squareSelected.addClass('pOne').text('X')
//     if (checkWin('pOne') === true) {
//       $('#result').text('PLAYER ONE WINS')
//     } else {
//       aiSymbol()
//       aiMoves()
//       if (checkWin('pTwo') === true) {
//         $('#result').text('MASTER CONTROL WINS')
//       }
//     }
//   }
// }

const determineActiveFighter = function () {
  if (characterRoll.result >= monsterRoll.result) {
    activeFighter = 1
    fightTurns()
  } else {
    activeFighter = 2
    fightTurns()
  }
}

const fightStart = function () {
  const monster = store.monsters[0]
  const character = store.character
  monsterRoll = roll.roll('d20')
  characterRoll = roll.roll('d20')
  characterRoll.result += Math.floor(((character.player_class.dex - 10) / 2))
  $('#combatLogId').append('\n' + monster.name + ' rolled ' + monsterRoll.result + ' for initiative!')
  $('#combatLogId').append('\n' + character.name + ' rolled ' + characterRoll.result + ' for initiative!')
  determineActiveFighter()
}

module.exports = {
  fightStart
}
