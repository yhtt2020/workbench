/**
Simple username/password field detector and auto-filler.

When page is loaded, we try to find any input fields with specific name
attributes. If we find something useful, we dispatch an IPC event
'password-autofill' to signal that we want to check if there is auto-fill data
available.

When we receive back an IPC event 'password-autofill-match' with auto-fill
data, we do one of two things:

- If there's a single credentials match, we fill the input fields with that
  data.

- If there's more than one match, we add a focus event listener on the
  username/email fields that will display a small overlay div with available
  options. When user selects one of the options, we fill the input fields with
  credentials data from the selection.

This code doesn't work with JS-based forms. We don't listen to all DOM changes,
we expect the login form to be present in the HTML code at page load. We can
add a MutationObserver to the document, or DOMNodeInserted listener, but I
wanted to keep it lightweight and not impact browser performace too much.
*/

// 密码识别难度分级
// 基础级别：
// gitlab
//com.thisky.com
// 中高难度：
//
//
// 高难度：
// 表格里没有字段符合要求

//js表格


/*
* 简单的用户名/密码字段检测器和自动填充器。

加载页面时，我们尝试查找具有特定名称的任何输入字段
属性。如果我们发现有用的东西，我们会发送一个 IPC 事件
'password-autofill' 表示我们要检查是否有自动填充数据
可用的。

当我们收到带有自动填充的 IPC 事件 'password-autofill-match' 时
数据，我们做两件事之一：

- 如果有一个凭据匹配，我们用它填充输入字段
  数据。

- 如果有多个匹配项，我们会在
  用户名/电子邮件字段将显示一个可用的小覆盖 div
  选项。当用户选择其中一个选项时，我们用
  选择的凭据数据。

此代码不适用于基于 JS 的表单。我们不会监听所有的 DOM 变化，
我们希望登录表单在页面加载时出现在 HTML 代码中。我们可以
添加一个 MutationObserver 到文档，或者 DOMNodeInserted 监听器，但我
希望保持轻量级并且不会过多地影响浏览器性能。
* */

// "carbon:password"
const keyIcon = '<svg title="密码管理" width="22px" height="22px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M21 2a9 9 0 0 0-9 9a8.87 8.87 0 0 0 .39 2.61L2 24v6h6l10.39-10.39A9 9 0 0 0 30 11.74a8.77 8.77 0 0 0-1.65-6A9 9 0 0 0 21 2zm0 16a7 7 0 0 1-2-.3l-1.15-.35l-.85.85l-3.18 3.18L12.41 20L11 21.41l1.38 1.38l-1.59 1.59L9.41 23L8 24.41l1.38 1.38L7.17 28H4v-3.17L13.8 15l.85-.85l-.29-.95a7.14 7.14 0 0 1 3.4-8.44a7 7 0 0 1 10.24 6a6.69 6.69 0 0 1-1.09 4A7 7 0 0 1 21 18z" fill="currentColor"/><circle cx="22" cy="10" r="2" fill="currentColor"/></svg>'

// Ref to added unlock button.
var currentUnlockButton = null
var currentAutocompleteList = null
function log(text){
  if(1)
    console.log(text)
}
log('加载密码')
// Creates an unlock button element.
// 创建一个解锁按钮元素
// - input: Input element to 'attach' unlock button to.
// 输入元素添加一个解锁按钮过去
function createUnlockButton (input) {
  var inputRect = input.getBoundingClientRect()

  // Container.
  var unlockDiv = document.createElement('div')

  // Style.
  unlockDiv.style.width = '20px'
  unlockDiv.style.height = '20px'
  unlockDiv.style.zIndex = 999999999999999

  // Position.
  unlockDiv.style.position = 'absolute'
  unlockDiv.style.left = (window.scrollX + (inputRect.left + inputRect.width - 20 - 10)) + 'px'
  unlockDiv.style.top = (window.scrollY + (inputRect.top + (inputRect.height - 20) / 2.0)) + 'px'

  // Button.
  var button = document.createElement('div')

  // Button style.
  button.style.width = '20px'
  button.style.height = '20px'
  button.style.opacity = 0.7
  button.style.color = window.getComputedStyle(input).color
  button.style.transition = '0.1s color'
  button.innerHTML = keyIcon

  // Button hover.
  button.addEventListener('mouseenter', (event) => {
    button.style.opacity = 1.0
  })
  button.addEventListener('mouseleave', (event) => {
    button.style.opacity = 0.7
  })

  // Click event.
  button.addEventListener('mousedown', (event) => {
    event.preventDefault()
    requestAutofill()
  })

  unlockDiv.appendChild(button)

  return unlockDiv
}

// Tries to find if an element has a specific attribute value that contains at
// least one of the values from 'matches' array.
// 尝试找出一个元素有特殊属性值
// 至少一个值符合匹配数组
function checkAttributes (element, attributes, matches) {
  log(matches)
  log(attributes)
  for (const attribute of attributes) {
    const value = element.getAttribute(attribute)
    log(value)
    if (value == null) { continue }
    if (matches.some(match => value.toLowerCase().includes(match))) {
      return true
    }
  }
  return false
}

// Gets all input fields on a page that contain at least one of the provided
// strings in their name attribute.
// 获取全部的页面上的输入字段
// 他们的属性
function getBestInput (names, exclusionNames, types) {
  const allFields = [
    ...(document.querySelectorAll('form input') || []),
    ...(document.querySelectorAll('input') || [])
  ]
  // this list includes duplicates, but we only use the first one we find that matches, so there's no need to dedupe

  for (const field of allFields) {
    log('找到元素')
    log(field)
    // checkAttribute won't work here because type can be a property but not an attribute
    if (!types.includes(field.type)) {
      log(types)
      log(field.type)
      log('失败原因1')
      continue
    }

    // We expect the field to have either 'name', 'formcontrolname' or 'id' attribute
    // that we can use to identify it as a login form input field.
    // 我们期望字段有 name formcontrolname id 等属性
    // 我们可以使用识别为登录表单的输入字段
    if (names.length === 0 || checkAttributes(field, ['name', 'formcontrolname', 'id', 'placeholder'], names)) {
      if (!checkAttributes(field, ['name', 'formcontrolname', 'id', 'placeholder'], exclusionNames) && field.type !== 'hidden') {
        // 不包含排除名称 且类型不为hidden
        log('return')
        log(field)
        return field
      }else{
        log('失败原因2')
      }
    }else{
      log('匹配失败，原因：'+'不符合条件 names不为0或者包含指定字段')
    }
  }
  return null
}

// Shortcut to get username fields from a page.
// 从页面里获取用户名字段
function getBestUsernameField () {
  const input=getBestInput(['user', 'name', 'mail', 'login', 'auth', 'identifier','account','phone','用户名','手机','邮箱','账号','帐号','email'], ['confirm', 'filename'], ['text', 'email'])
  if(!!input){
    log('获取到匹配的用户名字段')
    log(input)
  }
  return input
}

// Shortcut to get password fields from a page.
// 从页面里获取密码字段
function getBestPasswordField () {
  const input=getBestInput([''], [], ['password'])
  if(!!input){
    log('获取到匹配的password字段')
    log(input)
  }
  return input
}

// Removes credentials list overlay.
// 移除凭证列表浮层
function removeAutocompleteList () {
  if (currentAutocompleteList && currentAutocompleteList.parentNode) {
    currentAutocompleteList.parentNode.removeChild(currentAutocompleteList)
  }
}

// Populates username/password fields with provided credentials.
// 输入用户名/密码字段 使用提供的凭证
function fillCredentials (credentials) {
  const { username, password } = credentials
  const inputEvents = ['keydown', 'keypress', 'keyup', 'input', 'change']

  const usernameField = getBestUsernameField()
  if (usernameField) {
    usernameField.value = username
    for (const event of inputEvents) {
      usernameField.dispatchEvent(new Event(event, { bubbles: true }))
    }
  }

  const passwordField = getBestPasswordField()
  if (passwordField) {
    passwordField.value = password
    for (const event of inputEvents) {
      passwordField.dispatchEvent(new Event(event, { bubbles: true }))
    }
  }
}

// Setup a focus/click listener on the username input fields.
//
// When those events happen, we add a small overlay with a list of matching
// credentials. Clicking on an item in a list populates the input fields with
// selected username/password pair.
//
// - element: input field to add a listener to
// - credentials: an array of { username, password } objects

//设置一个焦点/单击用户名输入字段上的侦听器。
//
//当这些事件发生时，我们添加一个匹配列表的小覆盖
// 凭证。单击列表中的项将填充输入字段
//选择的用户名/密码对。
//
// - element:添加监听器的输入字段
// - credentials:一个{username, password}对象的数组
function addFocusListener (element, credentials) {
  const inputRect = element.getBoundingClientRect()
  // Creates an options list container.
  function buildContainer () {
    const suggestionsDiv = document.createElement('div')
    suggestionsDiv.style = 'position: absolute; border: 1px solid #d4d4d4; z-index: 999999; border-bottom: none; background: #FFFFFF; transform: scale(0); opacity: 0; transform-origin: top left; transition: 0.15s; color: #000000;'
    suggestionsDiv.style.top = (inputRect.y + inputRect.height) + 'px'
    suggestionsDiv.style.left = (inputRect.x) + 'px'
    suggestionsDiv.id = 'password-autocomplete-list'
    requestAnimationFrame(function () {
      suggestionsDiv.style.opacity = '1'
      suggestionsDiv.style.transform = 'scale(1)'
    })
    return suggestionsDiv
  }

  // Adds an option row to the list container.
  // 添加一个选择行到列表容器
  function addOption (parent, username) {
    const suggestionItem = document.createElement('div')
    suggestionItem.innerHTML = username
    suggestionItem.style = 'padding: 10px; cursor: pointer; background-color: #fff; border-bottom: 1px solid #d4d4d4;'

    // Hover.
    suggestionItem.addEventListener('mouseenter', (event) => {
      suggestionItem.style.backgroundColor = '#e4e4e4'
    })
    suggestionItem.addEventListener('mouseleave', (event) => {
      suggestionItem.style.backgroundColor = '#fff'
    })

    // When user clicks on the suggestion, we populate the form inputs with selected credentials.
    suggestionItem.addEventListener('click', function (e) {
      const selectedCredentials = credentials.filter(el => { return el.username === username })[0]
      fillCredentials(selectedCredentials)
      removeAutocompleteList()
      element.focus()
    })

    parent.appendChild(suggestionItem)
  }

  // Creates autocomplete list and adds it below the activated field.
  // 创建自动填充列表并且添加到激活的字段下
  function showAutocompleteList (e) {
    removeAutocompleteList()
    const container = buildContainer()
    for (const cred of credentials) {
      addOption(container, cred.username)
    }
    document.body.appendChild(container)
    currentAutocompleteList = container
  }

  element.addEventListener('focus', showAutocompleteList)
  element.addEventListener('click', showAutocompleteList)

  // Hide options overlay when user clicks out of the input field.
  // 隐藏选择浮层，当用户点击框外
  document.addEventListener('click', function (e) {
    if (e.target !== element) {
      removeAutocompleteList()
    }
  })

  // Show the autocomplete list right away if field is already focused.
  // Userful for login pages which auto-focus the input field on page load.
  // 显示自动填充列表，如果字段被聚焦
  // 可用登录页
  if (element === document.activeElement) {
    showAutocompleteList()
  }
}

function requestAutofill () {
  if (getBestUsernameField() && getBestPasswordField()) {
    ipc.send('password-autofill', document.location.hostname)
  }
}

function maybeAddUnlockButton (target) {
  // require both a username and a password field to reduce the false-positive rate
  // 要求同时存在用户名和密码字段来降低误报率
  const userNameField= getBestUsernameField()
  const passwordField=getBestPasswordField()
  if (target instanceof Node && getBestUsernameField() && getBestPasswordField()) {
    if (getBestUsernameField().isSameNode(target) || getBestPasswordField().isSameNode(target)) {
      const unlockButton = createUnlockButton(target)
      document.body.appendChild(unlockButton)

      currentUnlockButton = unlockButton
    }
  }else{

    log('失败了，失败原因无法匹配到,只找到了'+userNameField+passwordField)
  }
}

function checkInitialFocus () {
  log('检查初始focus')
  maybeAddUnlockButton(document.activeElement)
}

function handleFocus (event) {
  maybeAddUnlockButton(event.target)
}

function handleBlur (event) {
  if (currentUnlockButton !== null && currentUnlockButton.parentElement != null) {
    currentUnlockButton.parentElement.removeChild(currentUnlockButton)
    currentUnlockButton = null
  }
}

// Handle credentials fetched from the backend. Credentials are expected to be
// an array of { username, password, manager } objects.
ipc.on('password-autofill-match', (event, data) => {
  if (data.hostname !== window.location.hostname) {
    throw new Error('password origin must match current page origin')
  }

  if (data.credentials.length === 0) {
    if (currentUnlockButton && currentUnlockButton.children.length > 0) {
      currentUnlockButton.children[0].style.color = 'rgb(180, 0, 0)'
    }
  } else if (data.credentials.length === 1) {
    fillCredentials(data.credentials[0])
    const firstPasswordField = getBestPasswordField()
    if (firstPasswordField) {
      firstPasswordField.focus()
    }
  } else {
    const firstField = getBestUsernameField()
    if (firstField) {
      addFocusListener(firstField, data.credentials)
      firstField.focus()
    }
  }
})

// Trigger autofill check from keyboard shortcut.
ipc.on('password-autofill-shortcut', (event) => {
  requestAutofill()
})

// Autofill enabled event handler. Initializes focus listeners for input fields.
// 自动填充事件handler，初始化输入框的焦点事件
ipc.on('password-autofill-enabled', (event) => {
  log('密码自动填充有效')
  checkInitialFocus()

  // Add default focus event listeners.
  window.addEventListener('blur', handleBlur, true)
  window.addEventListener('focus', handleFocus, true)
})
window.addEventListener('DOMNodeInsertedIntoDocument',(event) => {
  log('页面元素有变')
  checkInitialFocus()

  // Add default focus event listeners.
  window.addEventListener('blur', handleBlur, true)
  window.addEventListener('focus', handleFocus, true)
})

// Check if password autofill is configured.
// 检查密码填充是否启用
window.addEventListener('load', function (event) {
  ipc.send('password-autofill-check')
})

// send passwords back to the main process so they can be saved to storage
// 将账号密码送回主进程以保存
function handleFormSubmit () {
  var usernameValue = getBestUsernameField()?.value
  var passwordValue = getBestPasswordField()?.value
  log('发送密码到主进程')
  if ((usernameValue && usernameValue.length > 0) && (passwordValue && passwordValue.length > 0)) {
    ipc.send('password-form-filled', [window.location.hostname, usernameValue, passwordValue])
  }
}

window.addEventListener('submit', handleFormSubmit)

electron.webFrame.executeJavaScript(`
var origSubmit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = function () {
  window.postMessage({message: 'formSubmit'})
  origSubmit.apply(this, arguments)
}
`)

window.addEventListener('message', function (e) {
  if (e.data && e.data.message && e.data.message === 'formSubmit') {
    handleFormSubmit()
  }
})
