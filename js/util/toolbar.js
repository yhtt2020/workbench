var isToolbar = false

ipc.on('openToolbar', function () {
  isToolbar = true
  document.body.classList.add('is-focus-mode')

  setTimeout(function () { // wait to show the message until the tabs have been hidden, to make the message less confusing
    ipc.invoke('showFocusModeDialog1')
  }, 16)
})

ipc.on('hiddenToolbar', function () {
  isToolbar = false
  document.body.classList.remove('is-focus-mode')
})

module.exports = {
  enabled: function () {
    return isToolbar
  },
  warn: function () {
    ipc.invoke('showFocusModeDialog2')
  }
}
