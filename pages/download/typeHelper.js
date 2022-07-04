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
      type:'html',
      suffixList:['html','js','php','java','json','css']
    },
    {
      type:'exe',
      suffixList:['exe']
    },
    {
      type:'excel',
      suffixList:['xls','xlsx']
    },
    {
      type:'ai',
      suffixList:['ai']
    },
    {
      type:'gif',
      suffixList:['gif']
    },
    {
      type:'jpg',
      suffixList:['webp', 'jpg', 'jpeg', 'svg']
    },
    {
      type:'zip',
      suffixList:['zip','rar','jar','7z','tar','gzip']
    },
    {
      type:'txt',
      suffixList:['txt']
    },
    {
      type:'video',
      suffixList:['mp4', 'm2v', 'mkv','avi','rmvb']
    },
    {
      type:'doc',
      suffixList:['doc','docx']
    },
    {
      type:'mp3',
      suffixList:['mp3', 'wav', 'wmv','aac']
    },
    {
      type:'png',
      suffixList:['png', 'apng', 'psd']
    },
  ]
  for (let i = 0; i < typeList.length; i++) {
    result = typeList[i].suffixList.some(function (item) {
        return item == suffix
      })
      if (result) {
        result = typeList[i].type
        return result
      }
  }
  // 其他 文件类型
  result = 'white'
  return result
}
