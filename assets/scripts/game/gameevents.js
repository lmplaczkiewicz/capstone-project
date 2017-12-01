const getFormFields = require('../../../lib/get-form-fields')
const api = require('./gameapi')
const ui = require('./gameui')
const Roll = require('roll')
let roll = new Roll()
let characterRoll
let monsterRoll
let activeFighter
let monster
let character
const store = require('../store')

const onCreateCharacter = function (event) {
  event.preventDefault()
  const formData = getFormFields(event.target)
  console.log('event.target is', event.target)
  api.createCharacter(formData)
    .then(ui.onCreateCharacterSuccess)
    .then(showCharacters)
    .catch(ui.onCreateCharacterFailure)
}

const onStartQuest = function (event) {
  event.preventDefault()
  const questId = event.target.getAttribute('data-id')
  api.getQuest(questId)
    .then(ui.getMonsterForDisplay)
    .then(getMonsterForFight)
    .catch(ui.getQuestFailure)
}

const getQuests = function () {
  api.getQuests()
    .then(ui.getQuestsSuccess)
    .then(function () {
      $('.startQuestButton').on('click', onStartQuest)
    })
    .catch(ui.getQuestsFailure)
}

const playCharacter = function (event) {
  event.preventDefault()
  const characterId = event.target.getAttribute('data-id')
  api.getCharacter(characterId)
    .then(ui.getCharacterSuccess)
    .then(getQuests)
    .catch(ui.getCharacterFailure)
}

const replayCharacter = function (event) {
  event.preventDefault()
  const characterId = store.character.id
  api.getCharacter(characterId)
    .then(ui.getCharacterSuccess)
    .then(getQuests)
    .catch(ui.getCharacterFailure)
}

const showCharacters = function () {
  console.log('showCharacters')
  api.showCharacters()
    .then(ui.showCharactersSuccess)
    .catch(ui.showCharactersFailure)
    .then(function () {
      $('#createCharacter').on('submit', onCreateCharacter)
    })
    .then(function () {
      $('.removeCharacterButton').on('click', deleteCharacter)
    })
    .then(function () {
      $('.updateFormCharacterButton').on('submit', updateCharacter)
    })
    .then(function () {
      $('.playCharacterButton').on('click', playCharacter)
    })
}

const deleteCharacter = function (event) {
  event.preventDefault()
  const characterId = event.target.getAttribute('data-id')
  api.removeCharacter(characterId)
    .then(ui.deleteCharacterSuccess)
    .then(showCharacters)
    .catch(ui.deleteCharacterFailure)
}

const updateCharacter = function (event) {
  event.preventDefault()
  const characterId = event.target.getAttribute('data-id')
  const data = getFormFields(event.target)
  api.updateCharacter(characterId, data)
    .then(ui.updateCharacterSuccess)
    .then(showCharacters)
    .catch(ui.updateCharacterFailure)
}

const addHandlers = function () {
}

// COMBAT - Dependency Issue work around

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
      .then($('.deadButton').css('display', 'block'))
      .then($('.attackButton').css('display', 'none'))
      .then($('.deadButton').on('click', showCharacters))
  } else if (store.monster.health === 0) {
    $('#combatLogId').append('\n' + character.name + ' has slain the ' + monster.name + '. They will return to the Green Dragon Tavern victorious!' + '\n')
    scrollText()
    const characterRewarded = rewardAdd(store.character)
    api.updateQuestCharacter(store.character.id, characterRewarded)
      .then($('.returnButton').css('display', 'block'))
      .then($('.attackButton').css('display', 'none'))
      .then($('.returnButton').on('click', replayCharacter))
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
    fightTurns()
  } else {
    activeFighter = 2
    fightTurns()
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
  addHandlers,
  showCharacters
}
