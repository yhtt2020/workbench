ipc.on('processTransmitTaskList', (event, args) => {
  window.$globalSearch.$store.commit('REFRESH_ALLTASKS', args)
  console.log(args, '!!!!!!!!!')
})
