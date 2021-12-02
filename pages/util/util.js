const tools = {
  getWindowArgs: (window) => {
    window.globalArgs = {}
    process.argv.forEach(function(arg) {
      if (arg.startsWith('--')) {
        var key = arg.split('=')[0].replace('--', '')
        var value = arg.split('=')[1]
        globalArgs[key] = value
      }
    })
    if (navigator.platform === 'MacIntel') {
      window.platformType = 'mac'
    } else if (navigator.platform === 'Win32') {
      window.platformType = 'windows'
    } else {
      window.platformType = 'linux'
    }
  }
}

module.exports={tools}
