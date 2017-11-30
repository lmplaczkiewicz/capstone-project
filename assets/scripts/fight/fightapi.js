'use strict'

const store = require('../store')
const config = require('../config')

const getMonster = function (monsterId) {
  return $.ajax({
    url: config.apiOrigin + '/monsters/' + monsterId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const deadCharacter = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/characters/' + data,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const updateCharacter = function (characterId, data) {
  console.log(characterId)
  console.log(data)
  return $.ajax({
    url: config.apiOrigin + '/characters/' + characterId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data: {
      character: data
    }
  })
}

module.exports = {
  getMonster,
  deadCharacter,
  updateCharacter
}
