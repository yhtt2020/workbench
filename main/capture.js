
const Pixelsmith = require('pixelsmith')
const fsExistsSync= function (path) {
  try {
    fs.accessSync(path, fs.F_OK);
  }catch (e) {
    return false;
  }
  return true;
}

let tempDir = app.getPath('userData') + '/temp_capture', pixelsmith = new Pixelsmith(), canvas = null, contentSize = null, captureTimes = 1
let targetWindow = null, callback = null, options = {}

ipc.on('start-capture', function(events){
  targetWindow.webContents.send('get-content-size')
})
ipc.on('return-content-size', function (events, size) {
  contentSize = size
  captureTimes = Math.ceil(contentSize.height/contentSize.windowHeight)
  console.log(captureTimes)
  targetWindow.webContents.send('move-page-to', 1)
})
ipc.on('return-move-page', function (events, page) {
  let options = {
    x: 0,
    y: 0,
    width: contentSize.windowWidth,
    height: contentSize.windowHeight
  }
  if (page === captureTimes) {
    options.height = contentSize.height - ((captureTimes - 1) * contentSize.windowHeight)
    options.y = contentSize.windowHeight - options.height
  }
  targetWindow.webContents.capturePage(options).then(function (image) {
    try{
      if (!fsExistsSync(tempDir)) {
        fs.mkdirSync(tempDir)
      }
      console.log('create ',tempDir)
      fs.writeFile(tempDir + '/' + page + '.png', image.toPNG(), function(err){
        if (page !== captureTimes) {
          targetWindow.webContents.send('move-page-to', page + 1)

        } else {
          flattenPNG()
        }
      })
    }catch (e) {
      console.warn(e)
    }

  })
})

function flattenPNG () {
  let fileNames = [], y = 0, canvasHeight = 0, canvasWidth = 0, scrollBarWidth = 0
  for (var i = 1 ; i <= captureTimes; i++) {
    fileNames.push(tempDir + '/' + i + '.png')
  }
  pixelsmith.createImages(fileNames, function handleImages (err, imgs) {
    // If there was an error, throw it
    if (err) { console.log(err) }
    if (canvasWidth === 0) canvasWidth = imgs[0].width
    scrollBarWidth = canvasWidth/contentSize.width*contentSize.scrollBarWidth
    imgs.forEach(function(img) {
      canvasHeight += img.height
    })
    // Create a canvas that fits images
    canvas = pixelsmith.createCanvas(canvasWidth - scrollBarWidth, canvasHeight)
    // Add the images to canvas
    imgs.forEach(function(img, index){
      canvas.addImage(imgs[index], 0, y);
      y += imgs[index].height
    })
    // Export canvas to image
    var resultStream = canvas['export']({format: 'png'})
    callback(resultStream)
  })
}


require('electron').BrowserView.prototype.captureFullPage = function(_callback, _options){
  targetWindow = this
  callback = _callback
  options = _options || {}
  canvas = null
  this.webContents.send('get-content-size')
  // this.webContents.executeJavaScript(`
  //     var ipcRender = require('electron').ipcRenderer;
  //     ipcRender.send('start-capture');
  // `)
}
