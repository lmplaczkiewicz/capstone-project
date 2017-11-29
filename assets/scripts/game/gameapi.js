'use strict'

const store = require('../store')
const config = require('../config')
const Roll = require('roll')
let roll = new Roll()

const statGenerator = function (data) {
  if (data.character.player_class_id === 'Barbarian') {
    data.character.armor = 16
    data.character.health = 16
    data.character.xp = 0
    data.character.player_class_id = 2
    return data
  } else if (data.character.player_class_id === 'Fighter') {
    data.character.armor = 18
    data.character.health = 14
    data.character.xp = 0
    data.character.player_class_id = 1
    return data
  } else if (data.character.player_class_id === 'Ranger') {
    data.character.armor = 14
    data.character.health = 14
    data.character.xp = 0
    data.character.player_class_id = 3
    return data
  }
}

// const show = function () {
//   return $.ajax({
//     url: config.apiOrigin + '/characters',
//     method: 'GET',
//     headers: {
//       Authorization: 'Token token=' + store.user.token
//     }
//   })
// }

const createCharacter = function (data) {
  const character = statGenerator(data)
  console.log(character)
  return $.ajax({
    url: config.apiOrigin + '/characters',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data: character
  })
}

const removeCharacter = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/characters/' + data,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const updateCharacter = function (characterId, data) {
  return $.ajax({
    url: config.apiOrigin + '/characters/' + characterId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data: data
  })
}

const showCharacters = function () {
  return $.ajax({
    url: config.apiOrigin + '/characters',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getQuests = function () {
  return $.ajax({
    url: config.apiOrigin + '/quests',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getCharacter = function (characterId) {
  return $.ajax({
    url: config.apiOrigin + '/characters/' + characterId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getQuest = function (questId) {
  return $.ajax({
    url: config.apiOrigin + '/quests/' + questId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

module.exports = {
  createCharacter,
  removeCharacter,
  updateCharacter,
  showCharacters,
  getCharacter,
  statGenerator,
  getQuests,
  getQuest
}
