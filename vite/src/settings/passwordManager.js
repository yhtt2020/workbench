 var passwordManagers = {
  none: {
    name: 'none'
  },
  Bitwarden: {
    name: 'Bitwarden'
  },
  '1Password': {
    name: '1Password'
  },
  'Built-in password manager': {
    name: 'Built-in password manager'
  }
}

var currentPasswordManager = null
let passwordManager = {
  init () {
    settings.listen('passwordManager', function (value) {
      if (value && value.name) {
        currentPasswordManager = value
      } else {
        currentPasswordManager = passwordManagers['Built-in password manager']
      }
    })
  }
}

window.currentPasswordManager = currentPasswordManager
export  { passwordManager, passwordManagers }
