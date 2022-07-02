export function matchFileSuffixType(fileName) {
  // 后缀获取
  var suffix = ''
  // 获取类型结果
  var result = ''
  try {
    var flieArr = fileName.split('.')
    suffix = flieArr[flieArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false
    return result
  }
  var htmlList = ['html','js','php','java','json','css']
  result = htmlList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'html'
    return result
  }

  var exeList = ['exe']
  result = exeList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'exe'
    return result
  }
  var excelList = ['xls','xlsx']
  result = excelList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'excel'
    return result
  }

  var aiList = ['ai']
  result = aiList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'ai'
    return result
  }

  var gifList = ['gif']
  result = gifList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'gif'
    return result
  }

  // 图片格式
  var imgList = ['webp', 'jpg', 'jpeg', 'svg']
  // 进行图片匹配
  result = imgList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'jpg'
    return result
  }

  // 匹配txt
  var txtList = ['txt']
  result = txtList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'txt'
    return result
  }

  // 匹配压缩文件
  var officeList = ['zip','rar','jar','7z','tar','gzip']
  result = officeList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'zip'
    return result
  }
  // 匹配 视频
  var videoList = ['mp4', 'm2v', 'mkv','avi','rmvb']
  result = videoList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'video'
    return result
  }

  var docList = ['doc','docx']
  result = docList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'doc'
    return result
  }

  // 匹配 音频
  var radiolist = ['mp3', 'wav', 'wmv','aac']
  result = radiolist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'mp3'
    return result
  }

  var pngList = ['png', 'apng', 'psd']
  result = pngList.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'png'
    return result
  }

  // 其他 文件类型
  result = 'white'
  return result
}
