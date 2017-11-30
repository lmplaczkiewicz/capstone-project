'use strict'

const store = require('../store')
const gameEvents = require('../game/gameevents.js')
const gameUi = require('../game/gameui.js')
const showMonstersTemplate = require('../templates/monsterTiles.handlebars')
const showCharacterTemplate = require('../templates/statsTile.handlebars')

const updateTiles = function () {
  const monster = store.monster
  const adventurer = store.character
  console.log(adventurer)
  console.log(monster)
  const showMonstersHtml = showMonstersTemplate({ monster })
  $('#MonsterTileDisplay').html(showMonstersHtml)
  const showCharacterHtml = showCharacterTemplate({ adventurer })
  $('#characterFightDisplay').html(showCharacterHtml)
}

const returnToSelectSuccess = function () {
  gameEvents.showCharacters()
}

const returnToSelectFailure = function () {
  gameUi.alertCallerFailure('frontError', 'Server Error - Unable to return to Character Select')
}

const returnToTavernSuccess = function () {
  gameEvents.getQuests()
}

const returnToTavernFailure = function () {
  gameUi.alertCallerFailure('frontError', 'Server Error - Unable to return to Tavern')
}

module.exports = {
  updateTiles,
  returnToSelectSuccess,
  returnToSelectFailure,
  returnToTavernSuccess,
  returnToTavernFailure
}
