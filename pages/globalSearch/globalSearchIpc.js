ipc.on('processTransmitTaskList', (event, args) => {
  window.$globalSearch.$store.commit('REFRESH_ALLTASKS', args)
})

ipc.on('viewLoaded', (event, args) => {
  window.$globalSearch.visible = true
})
