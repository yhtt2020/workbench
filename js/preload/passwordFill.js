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
const keyIcon = '<svg t="1638197146961" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13422" width="28" height="28"><path d="M510.8224 513.1264m-450.816 0a450.816 450.816 0 1 0 901.632 0 450.816 450.816 0 1 0-901.632 0Z" fill="#E9ECFF" p-id="13423"></path><path d="M324.4544 387.9424c-11.6224-128.2048 98.304-206.3872 186.4704-206.3872 87.552 0 197.7856 77.056 186.6752 206.3872 3.072 0.3584 6.144 0.768 9.216 1.0752 46.0288 5.1712 78.1312 38.912 78.5408 85.1968 0.7168 76.2368 0.8192 152.4736-0.0512 228.6592-0.5632 49.92-38.0928 85.8112-88.064 85.8624-124.3136 0.1536-248.6272 0.1536-372.8896 0-50.5856-0.0512-87.6544-35.7376-88.1664-86.4768-0.7168-75.9296-0.6656-151.8592 0-227.7888 0.4096-46.9504 32.256-80.5376 78.8992-85.6064 2.9696-0.2048 5.8368-0.512 9.3696-0.9216z m57.2928-0.0512h257.8944c7.7312-48.7936-14.8992-101.2736-56.2688-127.488-47.2064-30.0032-96.0512-31.0272-143.104-0.8192-45.9776 29.4912-62.6688 74.24-58.5216 128.3072z m26.7776 164.352c-0.2048 20.992 4.7104 43.264 20.3776 60.672 12.9536 14.336 20.5824 28.4672 21.3504 48.64 0.9728 26.8288 22.7328 47.6672 48.896 52.5312 26.7776 4.9664 52.8896-7.6288 65.8944-31.488 7.0144-12.8512 7.424-26.8288 7.8848-40.9088 0.1024-3.84 1.9456-8.2432 4.352-11.3664 6.7072-8.7552 15.4112-16.2304 20.992-25.6512 19.712-33.1776 20.1216-67.6864 1.792-101.2736-19.1488-35.072-50.432-52.992-90.0608-52.8896-56.2176 0.1536-98.6112 42.752-101.4784 101.7344z" fill="#6C6CEA" p-id="13424"></path><path d="M510.8224 500.48c23.1936 0 42.8032 14.592 49.8688 37.0688 6.656 21.248-1.024 46.1312-20.3264 57.856-13.7216 8.3456-18.5856 19.1488-17.664 34.2016 0.4608 7.5776 0.256 15.2064-0.1024 22.8352-0.3584 7.3216-4.1984 12.544-11.9296 12.4928-7.68-0.0512-11.52-5.0176-11.6736-12.5952-0.1536-8.4992-0.3584-16.9984-0.0512-25.4464 0.4096-13.4144-4.352-23.1936-16.3328-30.5152-20.1216-12.3392-28.4672-36.3008-21.8112-58.0096 7.2704-23.5008 26.1632-37.888 50.0224-37.888z" fill="#757BF2" p-id="13425"></path><path d="M785.3568 474.2656c-0.4608-46.2848-32.512-80.0768-78.5408-85.1968-3.072-0.3584-6.1952-0.7168-9.216-1.0752 11.1616-129.3312-99.072-206.3872-186.6752-206.3872-88.1664 0-198.0928 78.1824-186.4704 206.3872-3.5328 0.3584-6.4 0.6656-9.3184 0.9728-46.6944 5.0688-78.4896 38.656-78.8992 85.6064-0.6656 75.9296-0.7168 151.8592 0 227.7888 0.4608 50.7392 37.5808 86.4256 88.1664 86.4768 77.7728 0.0512 155.5968 0.1024 233.3696 0.0512 116.3264-63.1808 201.6768-176.0768 227.6352-310.1696 0-1.4848 0-2.9696-0.0512-4.4544z m-187.0336 130.3552c-5.5808 9.3696-14.2848 16.8448-20.992 25.6512-2.4064 3.1232-4.1984 7.4752-4.352 11.3664-0.4608 14.1312-0.9216 28.0576-7.8848 40.9088-13.0048 23.9104-39.1168 36.4544-65.8944 31.488-26.2144-4.8128-47.9232-25.6512-48.896-52.5312-0.768-20.1728-8.3968-34.304-21.3504-48.64-15.6672-17.3568-20.5824-39.68-20.3776-60.672 2.8672-58.9824 45.2608-101.5808 101.4784-101.7344 39.68-0.1024 70.912 17.8176 90.0608 52.8896 18.3296 33.5872 17.8688 68.1472-1.792 101.2736z m41.3184-216.7296H381.7472c-4.1472-54.0672 12.544-98.816 58.5216-128.3072 47.0528-30.208 95.8976-29.184 143.104 0.768 41.3696 26.2144 64.0512 78.7456 56.2688 127.5392z" fill="#757BF2" p-id="13426"></path><path d="M557.824 530.3296c-8.704-18.3296-26.4192-29.8496-47.0016-29.7984-23.8592 0-42.8032 14.336-50.0224 37.888-6.656 21.6576 1.7408 45.6704 21.8112 58.0096 0.512 0.3072 0.9728 0.6656 1.4848 1.024a454.56896 454.56896 0 0 0 73.728-67.1232z" fill="#8486F8" p-id="13427"></path><path d="M510.9248 181.5552c-88.1664 0-198.0928 78.1824-186.4704 206.3872-3.5328 0.3584-6.4 0.6656-9.3184 0.9728-46.6944 5.0688-78.4896 38.656-78.8992 85.6064-0.6144 69.4272-0.6144 138.9056-0.1024 208.3328a448.34816 448.34816 0 0 0 203.008-56.7296c-2.9184-4.5056-6.2976-8.8576-10.24-13.2608-15.6672-17.3568-20.5824-39.68-20.3776-60.672 2.8672-58.9824 45.2608-101.5808 101.4784-101.7344 33.6384-0.1024 61.184 12.8 80.4864 38.0928a447.77472 447.77472 0 0 0 78.336-219.2384c-36.864-56.32-101.9904-87.7568-157.9008-87.7568z m128.7168 206.336H381.7472c-4.1472-54.0672 12.544-98.816 58.5216-128.3072 47.0528-30.208 95.8976-29.184 143.104 0.768 41.3696 26.2144 64.0512 78.7456 56.2688 127.5392z" fill="#8486F8" p-id="13428"></path><path d="M428.5952 387.8912h-46.7968c-4.1984-54.0672 12.4928-98.816 58.4704-128.3072 28.0064-17.9712 56.6784-24.832 85.2992-21.0944a442.4704 442.4704 0 0 0 17.3568-53.6064c-10.8032-2.1504-21.5552-3.2768-32-3.2768-88.1664 0-198.0928 78.1824-186.4704 206.3872-3.5328 0.3584-6.4 0.6656-9.3184 0.9728-46.6944 5.0688-78.4896 38.656-78.8992 85.6064-0.1024 10.0352-0.0512 20.0704-0.1536 30.1056 73.9328-22.272 139.9296-62.976 192.512-116.7872z" fill="#8D92F8" p-id="13429"></path></svg>'
const lockIcon=`<svg style="vertical-align: middle"  t="1638195533973" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21180" width="15" height="15"><path d="M92.16 348.16m81.92 0l686.08 0q81.92 0 81.92 81.92l0 491.52q0 81.92-81.92 81.92l-686.08 0q-81.92 0-81.92-81.92l0-491.52q0-81.92 81.92-81.92Z" fill="#40A9FF" p-id="21181"></path><path d="M92.16 829.44m81.92 0l686.08 0q81.92 0 81.92 81.92l0 10.24q0 81.92-81.92 81.92l-686.08 0q-81.92 0-81.92-81.92l0-10.24q0-81.92 81.92-81.92Z" fill="#40A9FF" p-id="21182"></path><path d="M382.28992 351.08864V204.8c0-43.42784 61.56288-87.76704 145.07008-87.76704 83.5072 0 145.07008 44.3392 145.07008 87.76704v146.28864c0 32.31744 25.97888 58.51136 58.01984 58.51136C762.50112 409.6 788.48 383.40608 788.48 351.08864V204.8C788.48 86.64064 668.19072 0 527.36 0S266.24 86.64064 266.24 204.8v146.28864C266.24 383.40608 292.21888 409.6 324.27008 409.6s58.01984-26.19392 58.01984-58.51136z" fill="#40A9FF" p-id="21183"></path><path d="M517.12 522.24a87.04 87.04 0 0 1 46.09024 160.89088L563.2 783.36a46.08 46.08 0 1 1-92.16 0v-100.22912A87.04 87.04 0 0 1 517.12 522.24z" fill="#91D5FF" p-id="21184"></path></svg>`
// Ref to added unlock button.
var currentUnlockButton = null
var currentAutocompleteList = null
function log(text){
  if(0)
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
  unlockDiv.style.top = (window.scrollY + (inputRect.top + (inputRect.height - 20) / 2.0) -4) + 'px'

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
    suggestionsDiv.style = `
    position: absolute; border: 1px solid #d4d4d4; z-index: 999999; background: #FFFFFF; transform: scale(0); opacity: 0; transform-origin: top left; transition: 0.15s; color: #000000;
    border-radius:6px;
    box-shadow:rgb(207 207 207 / 85%) 0px 0px 9px;
    overflow:hidden
    `
    suggestionsDiv.style.top = (inputRect.y + inputRect.height  ) + 'px'
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
    suggestionItem.style = 'padding: 10px; cursor: pointer; background-color: #fff; width:100%;'

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
    const inputWidth=e.target.offsetWidth
    console.log()
    container.innerHTML=`<div style="padding: 5px;border-bottom: 1px solid #c1c1c1;color: grey;width:${inputWidth}px"> ${lockIcon} 个人账号</div>`
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
window.onload=()=>{
  setTimeout(requestAutofill,1000)
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

// window.addEventListener('submit', handleFormSubmit)

//注释掉表单提交，将事件重新绑定到页面跳转，这样可以提高填充成功率
window.onbeforeunload=function(e){
  var e = window.event||e;
  handleFormSubmit()
}
// old = XMLHttpRequest;
// XMLHttpRequest = function() {
//   handleFormSubmit()
//   console.log(arguments);
//   return old.apply(this, arguments); }

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
