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
 window.currentPasswordManager = null
let passwordManager = {
  init () {
    settings.listen('passwordManager', function (value) {
      if (value && value.name) {
        window.currentPasswordManager = value
      } else {
        window.currentPasswordManager = passwordManagers['Built-in password manager']
      }
    })
  }
}


export  { passwordManager, passwordManagers }
