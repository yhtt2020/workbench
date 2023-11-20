
import { message } from 'ant-design-vue'
import { DTPWeb, LPA_JobNames } from 'dtpweb'
const api = DTPWeb.getInstance()

// 默认打印参数
const labelWidth = 40
const labelHeight = 60
const fontHeight = 3
/**
 * 验证打印驱动是否安装成功
 * @returns 如果驱动安装完毕 返回true
 */
  export const validateDrive = () => {
    const api = DTPWeb.getInstance()
    // const api = DTPWeb.getInstance()
    DTPWeb.checkServer((value) => {
      if (!value) {
        message.error('打印助手不可用')
        return false
      } 
      return value; // 驱动安装，返回true
    })
  };


/**
 * 正式开始打印
 * @param selectedPrinter 选择的打印机名称
 * @param value 需要进行预览的内容
 */
  export const  startPrint = (selectedPrinter, value) => {
    const api = DTPWeb.getInstance()
    doJob('default', selectedPrinter, value, () => {
      // 打印结束 关闭打印机以及弹窗
      api.closePrinter()
    })
  }




/**
 * 生成打印预览图 (作废) 预览图过大 在传输过程中会造成丢失数据导致无法渲染 
 * @param selectedPrinter 选择的打印机名称
 * @param value 需要进行预览的内容
 * @returns 将图片地址进行返回 
 */
  export const doPreview = (selectedPrinter, value) => {
    const api = DTPWeb.getInstance()
    // LPA_JobNames.Preview 通过设置 jobName 进行判断 这里为获取预览图
    doJob(LPA_JobNames.Preview, selectedPrinter, value, (success) => {
      if (success) {
        // 当内容过长时 需要添加分页打印
        
        //info用于获取刚刚打印的信息 这里打印仅用于获取预览图 
        // const info = api.getPageInfo()
        let page = api.getPageImage({ page: 0 })
        
        const img = document.createElement('img')
        // 设置预览图样式  后期还需要针对分页进行优化
        img.setAttribute('style', 'object-fit:contains;width:100%;height:100%')
        img.src = page.data
        api.closePrinter()
        
        return img
      } else {
        message.error('生成预览图失败')
      }
    })
  }


/**
 * 进行打印任务，特殊情况下的任务不进行打印，可用于生成对应的预览图片， 预览时的值可参考:LPA_JobNames，默认为 LPA_JobNames.Print，表示打印任务。
 * @param jobName 打印任务名称
 * @param callback 返回事件 通过callback 实现打印结束关闭弹窗
 * @param selectedPrinter 选择的打印机名称
 * @param value 需要进行打印的内容
 * @returns 
 */
 export const doJob =  ( jobName = 'default', selectedPrinter, value, callback) => {
  const api = DTPWeb.getInstance()
  // 判断打印机是否就绪

  if (!selectedPrinter) {
    return message.error('请选择打印机')
  }
  const printerName = selectedPrinter

  const text = value
  // 判断打印机是否链接
  if (!api) return message.error('api初始化失败')
  api.openPrinter(printerName, (success) => {
    if (success) {
      api.startJob({ orientation: 0, width: labelWidth, height: labelHeight, jobName: jobName })
      //api.startPage()
      api.drawText(
        {
          text: text,
          x: 2,
          y: 2,
          lineSpace: '1_2',
          width: labelWidth - 4,
          height: labelHeight - 4,
          fontHeight
        })
      //api.endPage()
      // 这里进行打印
      api.commitJob({
        callback: callback
      })
    }
  })
}

