/*
Wrapper for node-keytar
Runs in the main process because of https://github.com/atom/node-keytar/issues/250
*/

const keytar = require('keytar')
function keylog(obj){
  console.log(obj)
}
ipc.handle('keychainGetPassword', function (event, service, account) {
  keylog(keychainGetPassword)
  return keytar.getPassword(service, account)
})

ipc.handle('keychainSetPassword', function (event, service, account, password) {
  keylog('keychainSetPassword')
  return keytar.setPassword(service, account, password)
})

ipc.handle('keychainDeletePassword', function (event, service, account) {
  keylog('keychainDeletePassword')
  return keytar.deletePassword(service, account)
})

ipc.handle('keychainFindCredentials', function (event, service) {
  keylog('keychainFindCredentials')
  keylog(service)
  return keytar.findCredentials(service)
})

ipc.handle('keychainFindPassword', function (event, service) {
  keylog('keychainFindPassword')
  keylog(service)
  return keytar.setPassword(service)

})


