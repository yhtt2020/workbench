const passwordHandler=require('./passwordHandler.js')
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

- If there's more than one match, we card a focus event listener on the
  username/email fields that will display a small overlay div with available
  options. When user selects one of the options, we fill the input fields with
  credentials data from the selection.

This code doesn't work with JS-based forms. We don't listen to all DOM changes,
we expect the login form to be present in the HTML code at page load. We can
card a MutationObserver to the document, or DOMNodeInserted listener, but I
wanted to keep it lightweight and not impact browser performace too much.
*/

// 密码识别难度分级
// 基础级别：
// gitlab
// s.apps.vip
// 中高难度：
//
//
// 高难度：
// 表格里没有字段符合要求

// js表格

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
function sendIpc(event,args){
  console.log('发送一个IPc', { event,args })
  ipc.send('app.ipc',{ event,args })
}
/**
 * 根据环境自动拼装我们render的地址，支持参数
 * @param url
 * @param params 参数对象
 * @returns {*}
 */
function getUrl (url,params) {
  let protocolUrl
  protocolUrl = `tsbapp://./${url}` //todo 需要验证正式环境的协议情况
  isDevelopmentMode= 'development-mode' in window.globalArgs
  if (isDevelopmentMode) {
    protocolUrl = `http://localhost:1600/html/${url}`
  }
  if(params){
    let url= new URL(protocolUrl)
    //拼装参数
    Object.keys(params).forEach(key=>{
      url.searchParams.set(key,params[key])
    })

    protocolUrl=url.toString()
  }
  return protocolUrl
}
function toBase64(str){
  return window.btoa(str.replace(/[\u00A0-\u2666]/g, c => `&#${c.charCodeAt(0)};`));
}

function openPwdRemark(e,uuid){
  ipc.send('openPwdManager', {pos:{
      x:e.target.x,y:e.target.y+e.target.offsetHeight
    }, uuid,target:'remark'})
}

function openPwd(e){
  // params.tab='Password'
  // ipc.send('openSetting',params)
  ipc.send('openPwdManager', { pos:{
      x:e.target.x,y:e.target.y+e.target.offsetHeight
    }})
}

// "carbon:password"
let keyIconSvg=`<?xml version="1.0" encoding="UTF-8"?><svg version="1.1" width="366px" height="366px" viewBox="0 0 366.0 366.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter id="i0" x="-3.82513661%" y="-3.27868852%" filterUnits="userSpaceOnUse" width="105.464481%" height="105.464481%"><feDropShadow stdDeviation="2" dx="0" dy="2" flood-color="rgba(0, 0, 0, 0.5)"></feDropShadow></filter><clipPath id="i1"><path d="M179,0 C277.85897,0 358,80.1410298 358,179 C358,277.85897 277.85897,358 179,358 C80.1410298,358 0,277.85897 0,179 C0,80.1410298 80.1410298,0 179,0 Z"></path></clipPath><clipPath id="i2"><path d="M112.5,0 C174.632034,0 225,50.3679656 225,112.5 C225,174.632034 174.632034,225 112.5,225 C50.3679656,225 0,174.632034 0,112.5 C0,50.3679656 50.3679656,0 112.5,0 Z M112.5375,40.9852261 C94.9417033,40.9852261 79.7122667,53.2193179 75.9191711,70.4014158 C72.1260756,87.5835137 80.7895454,105.09217 96.75,112.5 L85.8,165.675 C84.9134809,170.129585 86.0930855,174.745955 89.0079281,178.229192 C91.9227706,181.712429 96.2588972,183.687358 100.8,183.6 L123.9,183.6 C128.441103,183.687358 132.777229,181.712429 135.692072,178.229192 C138.606914,174.745955 139.786519,170.129585 138.9,165.675 L128.25,112.5 L128.325,112.5 C144.285455,105.09217 152.948924,87.5835137 149.155829,70.4014158 C145.362733,53.2193179 130.133297,40.9852261 112.5375,40.9852261 Z"></path></clipPath></defs><g transform="translate(4.0 2.0)"><g filter="url(#i0)"><g clip-path="url(#i1)"><polygon points="0,0 358,0 358,358 0,358 0,0" stroke="none" fill="#4F8BFE"></polygon></g><g clip-path="url(#i1)"><polygon points="0,0 358,0 358,358 0,358 0,0" stroke="none" fill="#4F8BFE"></polygon></g><g transform="translate(150.0 130.0)"><path d="M0.5,0.5 L56.5,0.5" stroke="#508AFE" stroke-width="17" fill="none" stroke-linecap="round" stroke-miterlimit="10"></path></g><g transform="translate(67.0 67.0)"><g clip-path="url(#i2)"><polygon points="0,0 225,0 225,225 0,225 0,0" stroke="none" fill="#FFFFFF"></polygon></g></g></g></g></svg>`
keyIconSvg=toBase64(keyIconSvg)
const keyIcon = `<img style="width: 20px;height:20px;margin-top: 3px" src="data:image/svg+xml;base64, ${keyIconSvg}"/>`
const lockIcon = `<img style="width: 18px;height: 18px;vertical-align: text-top" src="data:image/svg+xml;base64, ${keyIconSvg}"/>`
// Ref to added unlock button.
var currentUnlockButton = null
var currentAutocompleteList = null
function log (text) {
  if (0) { console.log(text) }
}
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
  unlockDiv.style.top = (window.scrollY + (inputRect.top + (inputRect.height - 20) / 2.0) - 4) + 'px'

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
      } else {
        log('失败原因2')
      }
    } else {
      log('匹配失败，原因：' + '不符合条件 names不为0或者包含指定字段')
    }
  }
  return null
}

// Shortcut to get username fields from a page.
// 从页面里获取用户名字段
function getBestUsernameField () {
  const input = getBestInput(['user', 'name', 'mail', 'login', 'auth', 'identifier', 'account', 'phone', '用户名', '手机', '邮箱', '帐号', '帐号', 'email'], ['confirm', 'filename'], ['text', 'email'])
  if (input) {
    log('获取到匹配的用户名字段')
    log(input)
  }
  return input
}

// Shortcut to get password fields from a page.
// 从页面里获取密码字段
function getBestPasswordField () {
  const input = getBestInput([''], [], ['password'])
  if (input) {
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
    _showingPasswordFill=false
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
// When those events happen, we card a small overlay with a list of matching
// credentials. Clicking on an item in a list populates the input fields with
// selected username/password pair.
//
// - element: input field to card a listener to
// - credentials: an array of { username, password } objects

// 设置一个焦点/单击用户名输入字段上的侦听器。
//
// 当这些事件发生时，我们添加一个匹配列表的小覆盖
// 凭证。单击列表中的项将填充输入字段
// 选择的用户名/密码对。
//
// - element:添加监听器的输入字段
// - credentials:一个{username, password}对象的数组
var _showingPasswordFill=false
function addFocusListener (element, credentials) {
  const inputRect = element.getBoundingClientRect()
  // Creates an options list container.
  function buildContainer () {
    const suggestionsDiv = document.createElement('div')
    suggestionsDiv.style = `
    position: absolute;  z-index: 999999; background: #FFFFFF; transform: scale(0); opacity: 0; transform-origin: top left; transition: 0.15s; color: #000000;
    border-radius:6px;
    box-shadow:rgb(207 207 207 / 85%) 0px 0px 9px;
    overflow:hidden
    `
    suggestionsDiv.style.top = (inputRect.y + inputRect.height) + 'px'
    suggestionsDiv.style.left = (inputRect.x) + 'px'
    suggestionsDiv.id = 'password-autocomplete-list'
    requestAnimationFrame(function () {
      suggestionsDiv.style.opacity = '1'
      suggestionsDiv.style.transform = 'scale(1)'
    })
    return suggestionsDiv
  }
  function getIcon(color){
    const width=18
    const src='http://a.apps.vip/kee/key.svg'
    let svg=`<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1668578537389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1277" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128"><path d="M639.9 351.9C639.9 192.9 511.1 64 352 64S64.2 192.8 64.2 351.9c0 158.9 128.8 287.9 287.9 287.9 158.9-0.1 287.8-128.9 287.8-287.9z m-367.4 16.4c-50.4 0-91.3-40.9-91.3-91.3s40.9-91.3 91.3-91.3 91.3 40.9 91.3 91.3-40.9 91.3-91.3 91.3z" p-id="1278"></path><path d="M930 732.3L663.8 455l-43 71.6h0.7l253.4 266.3-1.8 27.6-45.9 1.8-237.7-250.4c-39.1 46-85.6 70.5-85.6 70.5l5.5 112 53.3 58.8H706L704.2 949l126.7 11s12.9-12.9 91.9-90c78.9-77.1 7.2-137.7 7.2-137.7z" p-id="1279"></path></svg>`
    svg=toBase64(svg)
   const style= `filter: drop-shadow(${width}px 0px 0px ${color});left: -${width}px; width:${width}px; position:relative;`
    const html=`<span class="img" style="margin-left:5px;margin-top: 5px;overflow: hidden;width:${width};height:${width};position:relative;display: inline-block;vertical-align: top">
           <img style="${style}"
                src="data:image/svg+xml;base64, ${svg}" alt="">
            </span>`
    return html
  }
  // Adds an option row to the list container.
  // 添加一个选择行到列表容器
  function addOption (parent, cred) {
    const suggestionItem = document.createElement('div')
    let remark=''
    if(!cred.title){
      cred.title='未命名'
    }
    let viewRemark
    let hasRemark=false
    let svg=`<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1671529956138" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19227" width="16" height="16" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M66.782609 772.541217h196.051478a58.835478 58.835478 0 0 1 58.768696 58.768696v117.359304l235.78713-165.442782c9.928348-6.989913 21.615304-10.685217 33.747478-10.685218H957.217391V89.043478H66.782609v683.475479zM313.61113 1022.886957a58.768696 58.768696 0 0 1-58.768695-58.768696v-124.794435H58.724174A58.813217 58.813217 0 0 1 0 780.55513V81.029565A58.835478 58.835478 0 0 1 58.768696 22.26087h906.462608A58.835478 58.835478 0 0 1 1024 81.029565v699.503305a58.835478 58.835478 0 0 1-58.768696 58.768695H593.697391L347.336348 1012.201739c-10.106435 7.101217-21.904696 10.685217-33.725218 10.685218z" fill="#4A4A4A" p-id="19228"></path><path d="M761.878261 326.032696h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609M761.878261 567.652174h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609" fill="#FA4E4E" p-id="19229"></path></svg>`
    svg=toBase64(svg)
    if(cred.originData){
      //必须是存在原始数据的
      if(cred.originData.fields.get('Notes')){
          remark= `<img class="__remark-icon" style="width: 18px;height:18px;margin-top: 5px;margin-right:5px;" src="data:image/svg+xml;base64, ${svg}"> `
        viewRemark = document.createElement('div')
        viewRemark.classList='__pwd-tip-remark'
        viewRemark.style.minWidth='80px'
        viewRemark.innerText='查看备注'
        hasRemark=true
        //viewRemark=`<div class="__pwd-tip-remark">查看备注</div> `

      }
    }

    let  icon= getIcon(cred.originData?cred.originData.bgColor:'black')//如果不存在originData则直接黑色

    const template=  `<div style="display:flex;">
<div style="width:30px;min-width: 30px;">${icon}</div>
<div style="flex:1"><div style="font-size:14px;font-weight:bold;line-height: 18px;white-space:nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;max-width:90%">${cred.title}</div><div style="color: grey;line-height: 18px;max-width:90%;white-space:nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all">${cred.username}&nbsp;</div></div><div>${remark}</div></div>`
    suggestionItem.classList='__pwd-item'
    suggestionItem.innerHTML=template
    suggestionItem.style="margin:8px;padding: 5px; cursor: pointer; width: 100%; border-radius: 8px;"
    // Hover.
    suggestionItem.addEventListener('mouseenter', (event) => {
      suggestionItem.style.backgroundColor = '#f1f1f1'
    })
    suggestionItem.addEventListener('mouseleave', (event) => {
      suggestionItem.style.backgroundColor = '#fff'
    })

    if(hasRemark){
      suggestionItem.children[0].children[2].appendChild(viewRemark)
      viewRemark.addEventListener('click',(event) =>{
        openPwdRemark(event,cred.originData.uuid.id)
        event.stopPropagation()
      })
    }

    // When user clicks on the suggestion, we populate the form inputs with selected credentials.
    suggestionItem.addEventListener('click', function (e) {
      const selectedCredentials = credentials.filter(el => { return el.username === cred.username })[0]
      fillCredentials(selectedCredentials)
      removeAutocompleteList()
      element.focus()
    })

    parent.appendChild(suggestionItem)
  }

  // Creates autocomplete list and adds it below the activated field.
  // 创建自动填充列表并且添加到激活的字段下
  function showAutocompleteList (e) {
    if(_showingPasswordFill){
      return _showingPasswordFill
    }
    _showingPasswordFill=true
    const container = buildContainer()
    const inputWidth = e.target.offsetWidth
    container.id='__pwdContainer'
    container.style.width=`${inputWidth}px`
    let name='内置密码库'
    if(currentManager.name==='file'){
      name=currentManager.dbName
    }
    container.innerHTML = `<div style="position:relative;padding: 8px;color: grey;"> ${lockIcon} <span style="font-size: 13px">${name}</span></div>`
    let all=document.createElement('span')
    all.innerHTML=`<a target="_blank" style="position: absolute;top: 8px;right: 8px;font-size: 13px">全部密码</a>`
    container.appendChild(all)
    all.addEventListener('click',(e)=>{
      openPwd(e)
    })

    let wrapper=document.createElement('div')
    wrapper.id='__pwdWrapper'
    wrapper.style.maxHeight='350px'
    wrapper.style.overflowY='auto'
    wrapper.style.overflowX='hidden'
    wrapper.style.paddingRight='15px'
    for (const cred of credentials) {
      addOption(wrapper, cred)
    }
    container.appendChild(wrapper)
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
  // if (element === document.activeElement) {
  //   showAutocompleteList()
  // }
}

function requestAutofill () {
  if (getBestUsernameField() && getBestPasswordField()) {
    passwordHandler.getAutoFill((data) => {
      currentManager=data.manager
      if (data.hostname !== window.location.hostname) {
        throw new Error('password origin must match current page origin')
      }
      // ipc.send('setPwdCount',{count:data.credentials.length,url:window.location.href})  //todo发送给框架，显示密码数量
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
  }
}

function maybeAddUnlockButton (target) {
  // require both a username and a password field to reduce the false-positive rate
  // 要求同时存在用户名和密码字段来降低误报率
  const userNameField = getBestUsernameField()
  const passwordField = getBestPasswordField()
  if (target instanceof Node && getBestUsernameField() && getBestPasswordField()) {
    if (getBestUsernameField().isSameNode(target) || getBestPasswordField().isSameNode(target)) {
      const unlockButton = createUnlockButton(target)
      document.body.appendChild(unlockButton)

      currentUnlockButton = unlockButton
    }
  } else {
    log('失败了，失败原因无法匹配到,只找到了' + userNameField + passwordField)
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

var currentManager={}
// Handle credentials fetched from the backend. Credentials are expected to be
// an array of { username, password, manager } objects.


// send passwords back to the main process so they can be saved to storage
// 将帐号密码送回主进程以保存
function handleFormSubmit () {
  var usernameValue = getBestUsernameField()?.value
  var passwordValue = getBestPasswordField()?.value
  log('发送密码到主进程')
  if ((usernameValue && usernameValue.length > 0) && (passwordValue && passwordValue.length > 0)) {
    ipc.send('password-form-filled', [window.location.hostname, usernameValue, passwordValue])
  }
}

// window.addEventListener('submit', handleFormSubmit)


// old = XMLHttpRequest;
// XMLHttpRequest = function() {
//   handleFormSubmit()
//   console.log(arguments);
//   return old.apply(this, arguments); }






function initPasswordFill(){
  function passwordAutofillEnabled() {
    log('密码自动填充有效')
    checkInitialFocus()

    // Add default focus event listeners.
    window.addEventListener('blur', handleBlur, true)
    window.addEventListener('focus', handleFocus, true)
  }
  passwordAutofillEnabled()
  let electron=require('electron')
  window.onload = () => {
    setTimeout(requestAutofill, 1000)
  }

  ipc.on('fill-password',(event,args)=>{
    fillCredentials(args.passwordToFill.password)
  })

// Trigger autofill check from keyboard shortcut.
  ipc.on('password-autofill-shortcut', (event) => {
    requestAutofill()
  })

// Autofill enabled event handler. Initializes focus listeners for input fields.
// 自动填充事件handler，初始化输入框的焦点事件


  window.addEventListener('DOMNodeInsertedIntoDocument', (event) => {
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

  // 注释掉表单提交，将事件重新绑定到页面跳转，这样可以提高填充成功率
  window.onbeforeunload = function (e) {
    var e = window.event || e
    handleFormSubmit()
  }
  window.addEventListener('message', function (e) {
    if (e.data && e.data.message && e.data.message === 'formSubmit') {
      handleFormSubmit()
    }
  })
// watch for clicks on button[type=submit]
  window.addEventListener('click', function (e) {
    e.path.forEach(function (el) {
      if (el.tagName === 'BUTTON' && el.getAttribute('type') === 'submit' && !el.disabled) {
        handleFormSubmit()
      }
    })
  }, true)
  electron.webFrame.executeJavaScript(`
var origSubmit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = function () {
  window.postMessage({message: 'formSubmit'})
  origSubmit.apply(this, arguments)
}
`)
  electron.webFrame.insertCSS(`
#__pwdWrapper::-webkit-scrollbar{
width:3px;
}
#__pwdWrapper::-webkit-scrollbar-thumb{
  border-radius:10px;
  -webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);
  opacity:0.2;
}
#__pwdWrapper::-webkit-scrollbar-track{
  border-radius:0;
  background:#f1f1f1;
}
.__pwd-item .__pwd-tip-remark{
display:none;

}
.__pwd-item:hover .__remark-icon{
 display:none
}
.__pwd-item:hover .__pwd-tip-remark:hover{
  opacity:1
}

.__pwd-item:hover .__pwd-tip-remark{
  display:block;
  opacity:0.7;
  padding-left: 14px;
  padding-right:14px;
  line-height:46px;
  background: #E0E7F5;
  border-radius: 0 5px 5px 0;
  margin:-5px;
  color:#4881FE
}

`)



}

initPasswordFill()
if(typeof module !=='undefined'){
  module.exports=initPasswordFill
}
