import {useEnv} from "../../ui/hooks/useEnv"
import { getCurrentInstance } from 'vue';
import cache from "../../components/card/hooks/cache";
import { appStore } from '../../store'
// 全局导入

export const getConfig = async () => {
  // const { proxy }: any = getCurrentInstance();
  let res
  let token



  // res  = await window.tsbApi.user.get()
  // token =  res.data.token

  // 游客模式下请求无token 提示登录
  // if(!token){
  //   console.log(33);

  //   window.$ui.confirm("登录提示", '目前处于游客模式，请登录后体验完整功能。', {
  //     ok: () => {
  //       console.log(1111);
  //       tsbApi.user.login((data) => {
  //         appStore().getUserInfo()
  //       })
  //     },
  //     no: () => {
  //       console.log("222 :>> ", 222);
  //     },
  //     okText: "立即登录",
  //     noText: "暂不登录",
  //     okButtonWidth: '95',
  //     noButtonWidth: '95',
  //   });
  // }


if (cache.get('ttUserToken')) {
  token = cache.get('ttUserToken')
} else if (!useEnv()) {
  res  = await window.tsbApi.user.get()
  token =  res.data.token
}

console.log('getConfig token :>> ', token);
  return {
    headers: {
      'Authorization': token
    }
  }
}
