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

  var typeList = [
    {
      name:'html',
      exts:['html','js','php','java','json','css']
    },
    {
      name:'exe',
      exts:['exe']
    },
    {
      name:'excel',
      exts:['xls','xlsx']
    },
    {
      name:'ai',
      exts:['ai']
    },
    {
      name:'gif',
      exts:['gif']
    },
    {
      name:'jpg',
      exts:['webp', 'jpg', 'jpeg', 'svg']
    },
    {
      name:'zip',
      exts:['zip','rar','jar','7z','tar','gzip']
    },
    {
      name:'txt',
      exts:['txt']
    },
    {
      name:'video',
      exts:['mp4', 'm2v', 'mkv','avi','rmvb']
    },
    {
      name:'doc',
      exts:['doc','docx']
    },
    {
      name:'mp3',
      exts:['mp3', 'wav', 'wmv','aac']
    },
    {
      name:'png',
      exts:['png', 'apng', 'psd']
    },
  ]
  for (let i = 0; i < typeList.length; i++) {
    result = typeList[i].exts.some(function (item) {
        return item == suffix
      })
      if (result) {
        result = typeList[i].name
        return result
      }
  }
  // 其他 文件类型
  result = 'white'
  return result
}
