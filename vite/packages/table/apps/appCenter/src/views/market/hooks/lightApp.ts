import { useAppCenterStore } from './../../../store';
import { updateValue } from './useUpdateValue';
import { useMarketStore } from './../store/store';
import { checkStatus } from './../../apps/checkStatus';
import { usePlat } from '../../../../../../permission/usePlat';
import { message } from 'ant-design-vue';
import { install } from './install';

import { useMarketStore } from '../store/store';
import { storeToRefs } from 'pinia';

let appModel
if(!usePlat('web')) {
    appModel = window.$models.appModel
}
// 下载安装
export const download = (item, version, fn?: Function) => {
    const store = useMarketStore()
    const appCenter = useAppCenterStore()
    const { myApps } = storeToRefs(appCenter)
    if(!checkStatus()) return
    message.info('正在安装，请勿重复点击')
    tsbApi.app.installAppConfirm(install(version).appJson,async(data) => {
        if(data.status) {
            store.downloadCount({appNanoid:item.id})
            message.success('安装成功')
            setTimeout(async() => {
                const target = await updateValue(item)
                myApps.value.unshift(target)
                // 回调事件
                fn && fn(item)
            }, 50);
        } else {
            message.error('安装失败')
        }
    })
}

// 打开
export const open = async(val) => {
    if(!checkStatus()) return
    const list = await appModel.getAllApps()
    const app = list.find(app => app.appid === val.id)
    tsbApi.app.run(app.nanoid,false,app)
}