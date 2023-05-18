

/**
 * 将文件转换为经过压缩和等比裁切的 base64 图片
 * @param file 待转换的图片文件
 * @returns 经过压缩和等比裁切后的 base64 图片
 */
export const innerImg = async (file) => {
  if (!validateFile(file)) return // 检查文件是否符合要求
  let image = await transformImage(file) // 获取文件对应的图片
  // image = base64Image(image) // 将裁切后的图片转换为 base64 格式
  return image
}
/**
 * 验证文件是否合法，文件大小不超过10MB，扩展名为.jpg、.jpeg或.png
 * @param file 待验证的文件
 * @returns 如果文件合法返回true，否则返回false
 */
const validateFile = (file) => {
  const sizeLimit = 10 * 1024 * 1024 // 设置文件大小上限为10MB
  const legalExts = [".jpg", ".jpeg", ".png"] // 合法文件扩展名数组
  if (file.size > sizeLimit) {
    // 如果文件大小超过上限，提示错误并返回false
    return false
  }
  const name = file.name.toLowerCase() // 获取文件名并转换为小写
  if (!legalExts.some((ext) => name.endsWith(ext))) {
    // 如果文件扩展名不合法，提示错误并返回false
    return false
  }
  return true // 文件合法，返回true
}

/**
 * 转换图片文件为图片对象并获取图片宽度和高度
 * @param file 待转换的图片文件
 * @returns 包含图片对象、宽度和高度的Promise对象
 */
export const transformImage = (file) => {
  return new Promise(function (resolve) {
    const oFReader = new FileReader() // 创建FileReader对象
    oFReader.readAsDataURL(file) // 以Data URL形式读取文件
    oFReader.onloadend = function (oFRevent: any) {
      const src = oFRevent.target.result // 获取文件内容
      const image = new Image() // 创建Image对象
      image.src = src // 设置Image对象的src属性
      image.onload = function () {
        // 图片加载完成后
        resolve({
          // 返回包含图片对象、宽度和高度的对象
          width: image.width,
          height: image.height,
          image,
          src
        })
      }
    }
  })
}

/**
 * 将图片对象转换为 base64 编码的字符串
 * @param file 包含图片宽度、高度和图片对象的对象
 * @returns base64 编码的图片字符串、宽度和高度
 */
export const base64Image = (file: { width; height; image } | any) => {
  const { width, height, image } = file
  const COMPRESS_RATIO = 1 // 获取压缩比例（0-1）
  const canvas = document.createElement("canvas") // 创建 canvas 元素
  const ctx = canvas.getContext("2d") // 获取绘制上下文
  canvas.setAttribute("id", "canvas")
  canvas.width = width
  canvas.height = height
  ctx?.clearRect(0, 0, width, height) // 清除画布内所有像素
  ctx?.drawImage(image, 0, 0, width, height) // 绘制图片到画布上
  const compressedImage = canvas.toDataURL("image/jpeg", COMPRESS_RATIO) // 将画布内容转换为 base64 编码的字符串

  return {
    src: compressedImage,
    width,
    height
  }
}
