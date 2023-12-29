import {message} from "ant-design-vue";
import {appStore} from "../../store";


const shake = {
  listening:false,
  cb:null,
  shakeConfirm:null,
  listenEnter:(event)=>{
    const store=appStore()
    if (event.code === "Enter") {
      const point=tsbApi.mouse.getPos()
      store.settings.shake.pos={
        x:point.x,
        y:point.y
      }
      message.success('设置摇一摇定位成功。','point')
      store.settings.shake.init=true
      window.shake=store.settings.shake
      shake.shakeConfirm.close()
      shake.start()
      window.removeEventListener('keydown',shake.listenEnter)
      if(shake.cb) shake.cb()
    }
    event.preventDefault();
    event.stopPropagation();
  },
  start(){
    window.$models.shake.start()
    shake.listening=true
  },
  stop(){
    window.$models.shake.stop()
    shake.listening=false
  },

  startWizard: (cb) => {
    const store=appStore()
    shake.cb=cb
    const confirm=window.$ui.confirm
    confirm("摇一摇功能向导", "您似乎从未使用过摇一摇穿梭的功能，是否根据提示设置摇一摇功能？", {
      ok: () => {
        setTimeout(() => {
          confirm('功能说明', "您可以在工作台所在位置设置一个通过摇一摇快速到达的位置，后续通过摇一摇鼠标快速到达此位置，再次摇一摇即可回到首次摇动的位置。点击开始向导。", {
            okText: '开始',
            ok: () => {
              window.addEventListener('keydown', shake.listenEnter)
              setTimeout(() => {
                shake.shakeConfirm = confirm('提示', "请将鼠标移动到您希望在摇一摇后自动定位到的位置，并按下回车键（Enter），期间请勿关闭此窗口", {
                  mask: true,
                  okText: '取消',
                  no: false,
                  noText: false,
                  ok: () => {
                    window.removeEventListener('keydown', shake.listenEnter)
                    message.info('已取消设置')
                    store.settings.shake.enable = false
                  }

                })
              }, 500)
            },
            noText: '取消',
            no: () => {
              message.info('已取消设置')
              store.settings.shake.enable = false
            }
          })
        }, 500)

      },
      type: 'info',
      no: () => {
        message.info('已取消设置')
        store.settings.shake.enable = false
      }
    });
  }
}


export default shake
