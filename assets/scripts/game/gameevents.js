const getFormFields = require('../../../lib/get-form-fields')
const api = require('./gameapi')
const ui = require('./gameui')
const store = require('../store')

const setUpChooseAdventurersTab = function () {
  if (!store.user) return
  onViewAdventurers()
    .then((response) => {
      if (response.adventurers && response.adventurers.filter(adv => adv.is_alive).length) {
        ui.updateAdvStatsTabDropdown(Object.assign({}, response))
        $('#advStatsTabDropdownContent a').on('click', loadAdvStatsTab)
        response.adventurers = response.adventurers.filter(adv => adv.is_alive)
        ui.onViewAdventurersSuccess(response)
        $('#myAdventurers > tbody > tr').on('click', onStartGameWithAdventurer)
      } else {
        ui.userHasNoAdventurers()
      }
    })
}

const onCreateAdventurer = function (event) {
  event.preventDefault()
  const formData = getFormFields(event.target)
  api.createAdventurer(formData)
    .then(ui.onCreateAdventurerSuccess)
    .then(setUpChooseAdventurersTab)
    .catch(ui.onCreateAdventurerFailure)
}
