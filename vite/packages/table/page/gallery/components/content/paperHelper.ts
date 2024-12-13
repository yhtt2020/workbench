import {message} from "ant-design-vue";
import {fileImageExtension, getFileName} from "../../libs/utils";
import {usePlat} from '../../../../ui/hooks/usePlat';

let fs, path
if (usePlat('client')) {
  fs = window.$models.fs
  path = require('path')
}
import {paperStore} from '../../../../store/paper';

export default {
  setDesktopPaperFromUrl(url) {
    //封装一个对象调用正确的方法
    this.setDesktopPaper({
      path: url,
      src: url
    });
  },
  // 设置桌面壁纸
  setDesktopPaper(paper) {
    if (paper) {
      window.$ui.confirm('确定将此壁纸设置为系统桌面壁纸', '确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。', {
        index: 100010,
        ok: () => {

          if (!paper.path.startsWith('file://')) {

            message.info({
              content: '正在为您下载壁纸',
              key: 'setting'
            })
            this.download(paper, (localUri) => {
              message.info({
                content: '下载完成，正在为您设置桌面壁纸',
                key: 'setting'
              })
              tsbApi.system.setLocalPaper(localUri)
            })

            return
          } else {
            message.info('正在为您设置桌面壁纸')
            tsbApi.system.setLocalPaper(paper.path)
          }

        },
        no: () => {
        },
        noText: '取消',
        type: 'warning'
      })
    }
  },

  // 下载
  download(img, cb) {
    if (paperStore().settings.savePath === '') {
      window.$ui.confirm('您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。', '', {
        index: 100010,
        ok: async () => {
          await this.queryStart();
        },
        no: () => {
        },
        noText: '取消',
        type: 'warning'
      })
    } else {
      const fileRegex = /^file:/;
      const regex = /^https:\/\/up\.apps\.vip/;
      const exist = fileRegex.test(img.path);
      // 判断是否为本地图片
      if (!exist && !regex.test(img.path)) {
        this.doStartDownload(img, cb);
      } else {
        window.$ui.confirm('图片已下载', '', {
          index: 1020,
          ok: async () => {
          },
          no: () => {
          },
          noText: null,
          type: 'warning'
        })
      }
    }
  },
  doStartDownload(item, cb) {
    item.percent = 0;
    const name = getFileName(item.src);
    console.log('即将开始下载', item, paperStore().settings.savePath)
    tsbApi.download.start({
      url: item.src,
      savePath: paperStore().settings.savePath + '/static/' + name,
      updated: (args) => {
        item.done = 1
        item.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(0)
      },
      done: (args) => {
        item.percent = 100
        item.done = 1
        if (cb) cb(paperStore().settings.savePath + '/static/' + name)
      },
      willDownload: (args) => {
      }
    })
  },
  async queryStart() {
    let savePath = await tsbApi.dialog.showOpenDialog({
      title: '选择目录', message: '请选择下载壁纸的目录',
      properties: ['openDirectory', 'createDirectory',]
    })
    if (savePath) {
      paperStore().settings.savePath = savePath[0]
      this.doStartDownload(this.myCurrentID)
    }
  },
}
