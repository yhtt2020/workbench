var pendingPermissions = []
var grantedPermissions = []
var nextPermissionId = 1
// 默认放行的权限管理
const allowPermissions = [
  'notifications',
  'fullscreen',
  'clipboard-sanitized-write',
  'clipboard-read',
  'media'
]

if (!settings.get('allowPermissions')) {
  settings.set('allowPermissions', allowPermissions)
}

if (!settings.get('noticeWebOrigin')) {
  // console.log('被触发了！！！！！')
  settings.set('noticeWebOrigin', [])
}

/*
All permission requests are given to the renderer on each change,
it will figure out what updates to make
*/
function sendPermissionsToRenderer () {
  // remove properties that can't be serialized over IPC
  sendIPCToWindow(mainWindow, 'updatePermissions', pendingPermissions.concat(grantedPermissions).map(p => {
    return {
      permissionId: p.permissionId,
      tabId: p.tabId,
      permission: p.permission,
      details: p.details,
      granted: p.granted
    }
  }))
}

function removePermissionsForContents (contents) {
  pendingPermissions = pendingPermissions.filter(perm => perm.contents !== contents)
  grantedPermissions = grantedPermissions.filter(perm => perm.contents !== contents)

  sendPermissionsToRenderer()
}

/*
Was permission already granted for this tab and URL?
*/
function isPermissionGrantedForContents (requestContents, requestPermission, requestDetails) {
  try {
    var requestOrigin = new URL(requestDetails.requestingUrl).hostname
  } catch (e) {
    return false
  }

  // console.log(requestOrigin, settings.get('noticeWebOrigin'), 'laiellaodi************')

  if (requestPermission === 'notifications') {
    const result = settings.get('noticeWebOrigin')
    const index = result.findIndex(v => v.link == requestOrigin)

    if (index >= 0 && !result[index].notice) {
      return false
    }

    if (index < 0) {
      result.push({
        link: requestOrigin,
        notice: true
      })
      settings.set('noticeWebOrigin', result)
    }
  }

  if (settings.get('allowPermissions').indexOf(requestPermission) > -1) {
    return true
  }
  for (var i = 0; i < grantedPermissions.length; i++) {
    var grantedOrigin = new URL(grantedPermissions[i].details.requestingUrl).hostname

    if (requestContents === grantedPermissions[i].contents && requestOrigin === grantedOrigin) {
      if (requestPermission === 'notifications' && grantedPermissions[i].permission === 'notifications') {
        return true
      }

      if (requestPermission === 'media' && grantedPermissions[i].permission === 'media') {
        // type 1: from permissionCheckHandler
        // request has a single media type
        if (requestDetails.mediaType && grantedPermissions[i].details.mediaTypes.includes(requestDetails.mediaType)) {
          return true
        }
        // type 2: from a permissionRequestHandler
        // request has multiple media types
        // TODO existing granted permissions should be merged together (i.e. if there is an existing permission for audio, and another for video, a new request for audio+video should be approved, but it currently won't be)
        if (requestDetails.mediaTypes && requestDetails.mediaTypes.every(type => grantedPermissions[i].details.mediaTypes.includes(type))) {
          return true
        }
      }
    }
  }
  return false
}

/*
Is there already a pending request of the given type for this tab+url?
 */
function hasPendingRequestForContents (contents, permission, details) {
  var requestOrigin = new URL(details.requestingUrl).hostname

  for (var i = 0; i < pendingPermissions.length; i++) {
    var pendingOrigin = new URL(pendingPermissions[i].details.requestingUrl).hostname

    if (contents === pendingPermissions[i].contents && requestOrigin === pendingOrigin && permission === pendingPermissions[i].permission) {
      return true
    }
  }
  return false
}

function pagePermissionRequestHandler (webContents, permission, callback, details) {
  if (!details.isMainFrame) {
    // not supported for now to simplify the UI
    callback(false)
    return
  }

  if (!details.requestingUrl) {
    callback(false)
    return
  }
  // 允许的网页权限
  // clipboard-read - Request access to read from the clipboard.
  //   media - Request access to media devices such as camera, microphone and speakers.
  //   display-capture - Request access to capture the screen.
  //   mediaKeySystem - Request access to DRM protected content.
  //   geolocation - Request access to user's current location.
  // notifications - Request notification creation and the ability to display them in the user's system tray.
  // midi - Request MIDI access in the webmidi API.
  //   midiSysex - Request the use of system exclusive messages in the webmidi API.
  //   pointerLock - Request to directly interpret mouse movements as an input method. Click here to know more.
  //   fullscreen - Request for the app to enter fullscreen mode.
  //   openExternal - Request to open links in external applications.
  //   unknown - An unrecognized permission request
  const permissions = [
    'notifications',
    'fullscreen',
    'clipboard-sanitized-write',
    'clipboard-read',
    'media'
  ]

  if (permissions.includes(permission)) {
    callback(true)
    // todo 应当在ui层加入选择
    return
  }

  /*
  Geolocation requires a Google API key (https://www.electronjs.org/docs/api/environment-variables#google_api_key), so it is disabled.
  Other permissions aren't supported for now to simplify the UI
  */
  if (['media', 'notifications'].includes(permission)) {
    /*
    If permission was previously granted for this page, new requests should be allowed
    */
    if (isPermissionGrantedForContents(webContents, permission, details)) {
      callback(true)
    } else if (permission === 'notifications' && hasPendingRequestForContents(webContents, permission, details)) {
      /*
      Sites sometimes make a new request for each notification, which can generate multiple requests if the first one wasn't approved.
      TODO this isn't entirely correct (some requests will be rejected when they should be pending) - correct solution is to show a single button to approve all requests in the UI.
      */
      callback(false)
    } else {
      pendingPermissions.push({
        permissionId: nextPermissionId,
        tabId: getViewIDFromWebContents(webContents),
        contents: webContents,
        permission: permission,
        details: details,
        callback: callback
      })

      sendPermissionsToRenderer()

      nextPermissionId++
    }

    /*
    Once this view is closed or navigated to a new page, these permissions should be revoked
    */
    webContents.on('did-start-navigation', function (e, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
      if (isMainFrame && !isInPlace) {
        removePermissionsForContents(webContents)
      }
    })
    webContents.once('destroyed', function () {
      // check whether the app is shutting down to avoid an electron crash (TODO remove this)
      if (mainWindow) {
        removePermissionsForContents(webContents)
      }
    })
  } else {
    callback(false)
  }
}

function pagePermissionCheckHandler (webContents, permission, requestingOrigin, details) {
  // if (!details.isMainFrame) {
  //   return false
  // }
  // starting in Electron 13, this will sometimes be called with no URL. TODO figure out why
  if (!details.requestingUrl) {
    // return false
    details.requestingUrl = requestingOrigin
  }

  if (permission === 'clipboard-sanitized-write') {
    return true
  }

  return isPermissionGrantedForContents(webContents, permission, details)
}

function devicePermissionHandler (details) {
  return true
}
//
// app.once('ready', function () {
//   session.defaultSession.setPermissionRequestHandler(pagePermissionRequestHandler)
//   session.defaultSession.setPermissionCheckHandler(pagePermissionCheckHandler)
//   session.defaultSession.setDevicePermissionHandler(devicePermissionHandler)
// })
// console.log('挂载到defaultsession')
// console.log(session.defaultSession)
session.defaultSession.setPermissionRequestHandler(pagePermissionRequestHandler)
session.defaultSession.setPermissionCheckHandler(pagePermissionCheckHandler)
session.defaultSession.setDevicePermissionHandler(devicePermissionHandler)
session.get
app.on('session-created', function (session) {
  session.setPermissionRequestHandler(pagePermissionRequestHandler)
  session.setPermissionCheckHandler(pagePermissionCheckHandler)
  session.setDevicePermissionHandler(devicePermissionHandler)
})

ipc.on('permissionGranted', function (e, permissionId) {
  for (var i = 0; i < pendingPermissions.length; i++) {
    if (permissionId && pendingPermissions[i].permissionId === permissionId) {
      pendingPermissions[i].granted = true
      pendingPermissions[i].callback(true)
      grantedPermissions.push(pendingPermissions[i])
      pendingPermissions.splice(i, 1)

      sendPermissionsToRenderer()
      break
    }
  }
})

ipc.on('allowPermissionsControl', (event, args) => {
  let result = settings.get('allowPermissions')
  if (args.status) {
    if (result.findIndex(v => v === args.permission) >= 0) {

    } else {
      result.push(args.permission)
      settings.set('allowPermissions', result)
    }
  } else {
    if (result.findIndex(v => v === args.permission) >= 0) {
      result = result.filter(v => v !== args.permission)
      settings.set('allowPermissions', result)
    } else {

    }
  }
})
