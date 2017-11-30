'use strict'

const store = require('../store')
const api = require('./fightapi.js')
const ui = require('./fightui.js')
const Roll = require('roll')
let roll = new Roll()
let characterRoll
let monsterRoll
let activeFighter
let monster
let character

const rewardAdd = function (character) {
  character.renown += store.quest.renown
  character.xp += store.monster.xp
  character.currency += store.quest.reward
  character.health = store.startingHealth
  return character
}

const checkWin = function () {
  if (store.character.health > 0 && store.monster.health > 0) {
    scrollText()
    fightTurns()
  } else if (store.character.health === 0) {
    $('#combatLogId').append('\n' + character.name + ' has fallen in battle to the ' + monster.name + '. They will fade to dust and be lost forevermore.' + '\n')
    scrollText()
    api.deadCharacter(store.character.id)
      .then(ui.returnToSelectSuccess)
      .then(ui.returnToSelectFailure)
  } else if (store.monster.health === 0) {
    $('#combatLogId').append('\n' + character.name + ' has slain the ' + monster.name + '. They will return to the Green Dragon Tavern victorious!' + '\n')
    scrollText()
    const characterRewarded = rewardAdd(store.character)
    api.updateCharacter(store.character.id, characterRewarded)
      .then(ui.returnToTavernSuccess)
      .then(ui.returnToTavernFailure)
  }
}

const scrollText = function () {
  $('#combatLogId').scrollTop($('#combatLogId')[0].scrollHeight)
}

const reduceHealth = function (damage) {
  if (activeFighter === 1) {
    store.monster.health -= damage
    store.monster.health = Math.max(store.monster.health, 0)
    console.log(store.monster)
    ui.updateTiles()
  } else {
    store.character.health -= damage
    store.character.health = Math.max(store.character.health, 0)
    console.log(store.character)
    ui.updateTiles()
  }
}

const hitOrMiss = function (roll) {
  if (activeFighter === 1 && roll >= monster.armor) {
    $('#combatLogId').append('\n' + character.name + ' used their ' + character.weapon.name + ' and hit the ' + monster.name + '!' + '\n')
    dealCharacterDamage()
  } else if (activeFighter === 1 && roll < monster.armor) {
    $('#combatLogId').append('\n' + character.name + ' used their ' + character.weapon.name + ' and missed!' + '\n')
    activeFighter = 2
    checkWin()
  } else if (activeFighter === 2 && roll >= character.armor) {
    $('#combatLogId').append('\n' + monster.name + ' used their ' + monster.weapon.name + ' and hit ' + character.name + '!' + '\n')
    dealMonsterDamage()
  } else if (activeFighter === 2 && roll < character.armor) {
    $('#combatLogId').append('\n' + monster.name + ' used their ' + monster.weapon.name + ' and missed!' + '\n')
    activeFighter = 1
    checkWin()
  }
}

const monsterToHit = function () {
  const monsterToHitRoll = roll.roll('d20')
  $('#combatLogId').append('\n' + monster.name + ' rolled ' + monsterToHitRoll.result + ' to Hit!' + '\n')
  hitOrMiss(monsterToHitRoll.result)
}

const characterToHit = function (event) {
  event.preventDefault()
  if (character.player_class.str >= character.player_class.dex) {
    const characterToHitRoll = roll.roll('d20')
    characterToHitRoll.result += Math.floor(((character.player_class.str - 10) / 2))
    $('#combatLogId').append('\n' + character.name + ' rolled ' + characterToHitRoll.result + ' to Hit!' + '\n')
    hitOrMiss(characterToHitRoll.result)
  } else {
    const characterToHitRoll = roll.roll('d20')
    characterToHitRoll.result += Math.floor(((character.player_class.dex - 10) / 2))
    $('#combatLogId').append('\n' + character.name + ' rolled ' + characterToHitRoll.result + ' to Hit!' + '\n')
    hitOrMiss(characterToHitRoll.result)
  }
}

const dealMonsterDamage = function () {
  const monsterDamageRoll = roll.roll(monster.weapon.dice + 'd' + monster.weapon.sides)
  $('#combatLogId').append('\n' + monster.name + ' dealt ' + monsterDamageRoll.result + ' damage with their ' + monster.weapon.name + '!' + '\n')
  console.log(monster.weapon.name)
  reduceHealth(monsterDamageRoll.result)
  activeFighter = 1
  checkWin()
}

const dealCharacterDamage = function () {
  if (character.player_class.str >= character.player_class.dex) {
    const characterDamageRoll = roll.roll(character.weapon.dice + 'd' + character.weapon.sides)
    characterDamageRoll.result += Math.floor(((character.player_class.str - 10) / 2))
    $('#combatLogId').append('\n' + character.name + ' dealt ' + characterDamageRoll.result + ' damage with their ' + character.weapon.name + '!' + '\n')
    reduceHealth(characterDamageRoll.result)
    activeFighter = 2
    checkWin()
  } else {
    const characterDamageRoll = roll.roll(character.weapon.dice + 'd' + character.weapon.sides)
    characterDamageRoll.result += Math.floor(((character.player_class.dex - 10) / 2))
    $('#combatLogId').append('\n' + character.name + ' dealt ' + characterDamageRoll.result + ' damage with their ' + character.weapon.name + '!' + '\n')
    reduceHealth(characterDamageRoll.result)
    activeFighter = 2
    checkWin()
  }
}

const fightTurns = function () {
  if (activeFighter === 1) {
    console.log(activeFighter)
    $('.attackButton').one('click', characterToHit)
  } else {
    monsterToHit()
  }
}

const determineActiveFighter = function () {
  if (characterRoll.result >= monsterRoll.result) {
    activeFighter = 1
    checkWin()
  } else {
    activeFighter = 2
    checkWin()
  }
}

const getMonsterForFight = function () {
  api.getMonster(store.monsters[0].id)
    .then(fightStart)
}

const fightStart = function (data) {
  monster = data.monster
  store.monster = data.monster
  character = store.character
  monsterRoll = roll.roll('d20')
  characterRoll = roll.roll('d20')
  characterRoll.result += Math.floor(((character.player_class.dex - 10) / 2))
  $('#combatLogId').append('\n' + monster.name + ' rolled ' + monsterRoll.result + ' for initiative!' + '\n')
  $('#combatLogId').append('\n' + character.name + ' rolled ' + characterRoll.result + ' for initiative!' + '\n')
  console.log('this is monster', monster)
  console.log('this is character', character.weapon.name)
  determineActiveFighter()
}

module.exports = {
  fightStart,
  getMonsterForFight
}
