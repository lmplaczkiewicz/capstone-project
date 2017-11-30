const getFormFields = require('../../../lib/get-form-fields')
// const store = require('../store')

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
    .then(ui.getQuestSuccess)
    .then(combat.getMonsterForFight)
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

module.exports = {
  addHandlers,
  showCharacters
}
