const webviews = require('webviews.js')
const settings = require('util/settings/settings.js')
const PasswordManagers = require('passwordManager/passwordManager.js')

const passwordCapture = {
  bar: document.getElementById('password-capture-bar'),
  description: document.getElementById('password-capture-description'),
  nameInput: document.getElementById('password-capture-name'),
  usernameInput: document.getElementById('password-capture-username'),
  passwordInput: document.getElementById('password-capture-password'),
  revealButton: document.getElementById('password-capture-reveal-password'),
  saveButton: document.getElementById('password-capture-save'),
  neverSaveButton: document.getElementById('password-capture-never-save'),
  closeButton: document.getElementById('password-capture-ignore'),
  favicon: '',
  currentDomain: null,
  barHeight: 0,
  showCaptureBar: function (username, password) {
    const tabData = tabs.get(tabs.getSelected())
    let tabIcon = ''
    console.log(tabData)
    if (tabData.favicon && tabData.favicon.url) {
      tabIcon = `<img style="width: 22px;height: 22px;margin-left: 10px;margin-right: 5px;vertical-align: middle;object-fit: cover" src="${tabData.favicon.url}"/>`
      passwordCapture.favicon = tabData.favicon.url
    } else {
      tabIcon = ''
      passwordCapture.favicon = ''
    }
    passwordCapture.description.innerHTML = l('passwordCaptureSavePassword').replace('%s', tabIcon + `${passwordCapture.currentDomain}`)
    passwordCapture.bar.hidden = false

    passwordCapture.passwordInput.type = 'password'
    passwordCapture.revealButton.classList.add('carbon:view')
    passwordCapture.revealButton.classList.remove('carbon:view-off')

    passwordCapture.nameInput.value = ''
    passwordCapture.usernameInput.value = username || ''
    passwordCapture.passwordInput.value = password || ''

    passwordCapture.barHeight = passwordCapture.bar.getBoundingClientRect().height
    webviews.adjustMargin([passwordCapture.barHeight, 0, 0, 0])
    if ($toolbar.expanded) {
      if (document.querySelector('#third-toolbar').hidden === true) {
        document.getElementById('password-capture-bar').style.top = document.getElementById('toolbar').offsetTop + 40 + 'px'
      } else {
        document.getElementById('password-capture-bar').style.top = document.getElementById('toolbar').offsetTop + 80 + 'px'
      }
    } else {
      document.getElementById('password-capture-bar').style.top = 'calc(36px + var(--control-space-top))'
    }
  },
  hideCaptureBar: function () {
    webviews.adjustMargin([passwordCapture.barHeight * -1, 0, 0, 0])

    passwordCapture.bar.hidden = true
    passwordCapture.nameInput.value = ''
    passwordCapture.usernameInput.value = ''
    passwordCapture.passwordInput.value = ''
    passwordCapture.currentDomain = null
  },
  togglePasswordVisibility: function () {
    if (passwordCapture.passwordInput.type === 'password') {
      passwordCapture.passwordInput.type = 'text'
      passwordCapture.revealButton.classList.remove('carbon:view')
      passwordCapture.revealButton.classList.add('carbon:view-off')
    } else {
      passwordCapture.passwordInput.type = 'password'
      passwordCapture.revealButton.classList.add('carbon:view')
      passwordCapture.revealButton.classList.remove('carbon:view-off')
    }
  },
  handleRecieveCredentials: function (tab, args, frameId) {
    var domain = args[0][0]
    if (domain.startsWith('www.')) {
      domain = domain.slice(4)
    }

    if (settings.get('passwordsNeverSaveDomains') && settings.get('passwordsNeverSaveDomains').includes(domain)) {
      return
    }

    var username = args[0][1] || ''
    var password = args[0][2] || ''

    PasswordManagers.getConfiguredPasswordManager().then(function (manager) {
      if (!manager || !manager.saveCredential) {
        // the password can't be saved
        return
      }

      // check if this username/password combo is already saved
      manager.getSuggestions(domain).then(function (credentials) {
        var alreadyExists = credentials.some(cred => cred.username === username && cred.password === password)
        if (!alreadyExists) {
          if (!passwordCapture.bar.hidden) {
            passwordCapture.hideCaptureBar()
          }

          passwordCapture.currentDomain = domain
          passwordCapture.showCaptureBar(username, password)
        }
      })
    })
  },
  initialize: function () {
    passwordCapture.nameInput.placeholder = '名称'
    passwordCapture.usernameInput.placeholder = l('username')
    passwordCapture.passwordInput.placeholder = l('password')

    webviews.bindIPC('password-form-filled', passwordCapture.handleRecieveCredentials)

    passwordCapture.saveButton.addEventListener('click', function () {
      if (passwordCapture.usernameInput.checkValidity() && passwordCapture.passwordInput.checkValidity()) {
        PasswordManagers.getConfiguredPasswordManager().then(function (manager) {
          manager.saveCredential(passwordCapture.currentDomain, passwordCapture.usernameInput.value, passwordCapture.passwordInput.value, passwordCapture.nameInput.value)

          passwordCapture.hideCaptureBar()
        })
      }
    })

    passwordCapture.neverSaveButton.addEventListener('click', function () {
      settings.set('passwordsNeverSaveDomains', (settings.get('passwordsNeverSaveDomains') || []).concat([passwordCapture.currentDomain]))
      passwordCapture.hideCaptureBar()
    })

    passwordCapture.closeButton.addEventListener('click', passwordCapture.hideCaptureBar)
    passwordCapture.revealButton.addEventListener('click', passwordCapture.togglePasswordVisibility)

    // the bar can change height when the window is resized, so the webview needs to be resized in response
    window.addEventListener('resize', function () {
      if (!passwordCapture.bar.hidden) {
        var oldHeight = passwordCapture.barHeight
        passwordCapture.barHeight = passwordCapture.bar.getBoundingClientRect().height
        webviews.adjustMargin([passwordCapture.barHeight - oldHeight, 0, 0, 0])
      }
    })
  }
}

module.exports = passwordCapture
