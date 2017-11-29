'use strict'

const store = require('../store')
const showScreenTemplate = require('../templates/characterScreen.handlebars')
const showCharactersTemplate = require('../templates/characterTiles.handlebars')
const showQuestsTemplate = require('../templates/questTiles.handlebars')

const showCharactersSuccess = function (data) {
  console.log(data)
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
  store.character = data
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
  console.log(data)
  const showQuestsHtml = showQuestsTemplate({ quests: data.quests })
  $('#questTileDisplay').html(showQuestsHtml)
  store.quests = data.quests
}

const getQuestsFailure = () => {
  alertCallerFailure('frontError', 'Unable to Load Quests')
}

const getQuestSuccess = (data) => {
  store.character = data
  $('body').addClass('openingPicture')
  $('body').removeClass('tavernPicture')
  $('#questTileDisplay').hide()
  alertCallerSuccess('frontSuccess', 'Quest Selected')
}

const getQuestFailure = () => {
  alertCallerFailure('frontError', 'Unable to Load Quest')
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
  getQuestFailure
}
