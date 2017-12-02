'use strict'

const store = require('../store')
const api = require('./gameapi')
const showScreenTemplate = require('../templates/characterScreen.handlebars')
const showCharactersTemplate = require('../templates/characterTiles.handlebars')
const showQuestsTemplate = require('../templates/questTiles.handlebars')
const showMonstersTemplate = require('../templates/monsterTiles.handlebars')
const showCharacterTemplate = require('../templates/statsTile.handlebars')
const showCombatUiTemplate = require('../templates/combatUi.handlebars')
const showStatsTemplate = require('../templates/tavernStatTile.handlebars')
const Roll = require('roll')
let roll = new Roll()

const showCharactersSuccess = function (data) {
  $('#MonsterTileDisplay').hide()
  $('#characterFightDisplay').hide()
  $('#combatUiDisplay').hide()
  $('#questTileDisplay').hide()
  $('#tavernStatTileDisplay').hide()
  $('#character-screen-link').hide()
  $('body').addClass('openingPicture')
  $('body').removeClass('tavernPicture')
  const showScreenHtml = showScreenTemplate({})
  $('#characterScreenDisplay').html(showScreenHtml)
  const showCharactersHtml = showCharactersTemplate({ characters: data.characters })
  $('#characterTileDisplay').html(showCharactersHtml)
  store.characters = data.characters
}

const alertCallerSuccess = (alertLocation, alertMessage) => {
  $('#' + alertLocation).addClass('alert alert-success').html(alertMessage)
  setTimeout(function () {
    $('#' + alertLocation).removeClass('alert alert-success').html('')
  }, 1500)
}

const alertCallerFailure = (alertLocation, alertMessage) => {
  $('#' + alertLocation).addClass('alert alert-danger').html(alertMessage)
  setTimeout(function () {
    $('#' + alertLocation).removeClass('alert alert-danger').html('')
  }, 1500)
}

const failureShake = (modalTarget) => {
  $('#' + modalTarget).addClass('shake')
  setTimeout(function () {
    $('#' + modalTarget).removeClass('shake')
  }, 1500)
}

const onCreateCharacterSuccess = () => {
  $('body').removeClass('modal-open')
  $('.modal-backdrop').remove()
  $('#createCharacterModal').modal('hide')
  $('#createCharacterModal').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset')
  })
  $('#createCharacter')[0].reset()
  alertCallerSuccess('frontSuccess', 'Create Character Success')
}

const onCreateCharacterFailure = () => {
  alertCallerFailure('frontError', 'Create Character Failure')
  failureShake('createCharacterModal')
}

const showCharactersFailure = () => {
  alertCallerFailure('frontError', 'Unable to Retrieve Characters - Sign Out and Back In')
}

const deleteCharacterSuccess = (data) => {
  alertCallerSuccess('frontSuccess', 'Character Deleted')
}

const deleteCharacterFailure = () => {
  alertCallerFailure('frontError', 'Delete Character Failure')
}

const getCharacterSuccess = (data) => {
  store.character = data.character
  $('body').removeClass('openingPicture')
  $('body').addClass('tavernPicture')
  $('#characterSelectScreen').hide()
  $('#characterTilesId').hide()
  alertCallerSuccess('frontSuccess', 'Character Selected')
}

const getCharacterFailure = () => {
  alertCallerFailure('frontError', 'Unable to Load Character')
}

const updateCharacterSuccess = () => {
  $('body').removeClass('modal-open')
  $('.modal-backdrop').remove()
  alertCallerSuccess('frontSuccess', 'Character Updated')
}

const updateCharacterFailure = () => {
  alertCallerFailure('frontError', 'Character Update Failure')
  failureShake('errorTarget')
}

// QUEST CALLS

const getQuestsSuccess = function (data) {
  const adventurer = store.character
  $('#MonsterTileDisplay').hide()
  $('#characterFightDisplay').hide()
  $('#combatUiDisplay').hide()
  $('#questTileDisplay').show()
  $('#tavernStatTileDisplay').show()
  const showQuestsHtml = showQuestsTemplate({ quests: data.quests })
  $('#questTileDisplay').html(showQuestsHtml)
  const showStatsHtml = showStatsTemplate({ adventurer })
  $('#tavernStatTileDisplay').html(showStatsHtml)
  store.quests = data.quests
}

const getQuestsFailure = () => {
  alertCallerFailure('frontError', 'Unable to Load Quests')
}

const scaleMonster = function (monster) {
  if (store.character.level > 2) {
    const healthAddRoll = roll.roll(store.character.level + 'd12')
    store.monster.health += healthAddRoll.result
    store.monster.weapon.dice += 1
    store.monster.xp *= store.character.level
  } else if (store.character.level > 1) {
    const healthAddRoll = roll.roll(store.character.level + 'd6')
    store.monster.health += healthAddRoll.result
    // store.monster.weapon.dice += 1
    store.monster.xp *= store.character.level
  } else {
  }
}

const assignStore = function (data) {
  store.monster = data.monster
  scaleMonster(store.monster)
  // getQuestSuccess()
}

const getMonsterForDisplay = function (data) {
  store.quest = data.quest
  store.monsters = data.quest.monsters
  return api.getMonster(data.quest.monsters[0].id)
    .then(assignStore)
}

const getQuestSuccess = function () {
  // getMonsterForDisplay(data.quest.monsters[0].id)
  // store.quest = data.quest
  // store.monsters = data.quest.monsters
  const adventurer = store.character
  const monster = store.monster
  store.startingHealth = store.character.health
  $('body').addClass('openingPicture')
  $('body').removeClass('tavernPicture')
  $('#questTileDisplay').hide()
  $('#tavernStatTileDisplay').hide()
  $('#character-screen-link').hide()
  const showMonstersHtml = showMonstersTemplate({ monster })
  $('#MonsterTileDisplay').html(showMonstersHtml)
  const showCharacterHtml = showCharacterTemplate({ adventurer })
  $('#characterFightDisplay').html(showCharacterHtml)
  const showCombatUiHtml = showCombatUiTemplate({})
  $('#combatUiDisplay').html(showCombatUiHtml)
  $('#MonsterTileDisplay').show()
  $('#characterFightDisplay').show()
  $('#combatUiDisplay').show()
  alertCallerSuccess('frontSuccess', 'Quest Selected')
}

const getQuestFailure = () => {
  alertCallerFailure('frontError', 'Unable to Load Quest')
}

// Combat work around

const updateTiles = function () {
  const monster = store.monster
  const adventurer = store.character
  const showMonstersHtml = showMonstersTemplate({ monster })
  $('#MonsterTileDisplay').html(showMonstersHtml)
  const showCharacterHtml = showCharacterTemplate({ adventurer })
  $('#characterFightDisplay').html(showCharacterHtml)
}

module.exports = {
  showCharactersSuccess,
  onCreateCharacterSuccess,
  onCreateCharacterFailure,
  showCharactersFailure,
  deleteCharacterSuccess,
  deleteCharacterFailure,
  updateCharacterSuccess,
  updateCharacterFailure,
  getCharacterSuccess,
  getCharacterFailure,
  getQuestsSuccess,
  getQuestsFailure,
  getQuestSuccess,
  getQuestFailure,
  updateTiles,
  getMonsterForDisplay
}
