<template>
    <div class="w-full h-full">
        <Header icon="fluent:building-shop-16-regular" title="我的应用">
            <template #right>
                <DropDown
                    :list="dropList"
                    v-model:defaultTitle="defaultData"
                />
                <xt-button
                    v-if="!isSearch"
                    w="32"
                    h="32"
                    radius="8"
                    icon="fluent:search-16-regular"
                    @click="openSearch"
                />
                <xt-input
                    v-else
                    v-model:modelValue="inputValue"
                    placeholder="搜索应用"
                    @blur="closeSearch"
                    @enter="search">
                </xt-input>

            </template>
        </Header>
        <xt-scrollbar class="flex-1 w-full " :x="false" :y="true" style="height: 98%;">
            <div class="flex flex-wrap gap-2 mt-4" v-if="list.length > 0">
                <template v-for="(item, index) in list" :key="item.id">
                    <xt-menu :menus="menus" @onMounted="getItem(item)">
                        <Item :size="140" :isApp="true" :item="item" :info="getInfo(item)" :showFolder="false"/>
                    </xt-menu>
                </template>
            </div>
            <Empty v-else />
        </xt-scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, defineAsyncComponent, onMounted, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import _ from 'lodash-es'
import { useAppCenterStore } from "../../store";

import { dropList, appsList } from './data'
import navigationData from '../../../../../js/data/tableData';
import { useTransform, defaultStartMenu } from './hooks/useTransform'
import { useMenus } from '../../../hooks/useMenus';
import { startApp } from '../../../../../ui/hooks/useStartApp';

import { useReplaceData, reloadList } from './hooks/useReplaceData'
import { usePlat } from '../../../../../permission/usePlat';

let appModel
if(!usePlat('web')) {
    appModel = window.$models.appModel
}

// 导入组件
const Header = defineAsyncComponent(() => import('../../component/Header.vue'))
const DropDown = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/DropDown.vue'))
const Item = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/SelectIcon.vue'))
const Empty = defineAsyncComponent( () => import('../../../../../components/desk/addIcon/components/Empty.vue'))

// 路由
const router = useRouter()

// 应用中心pinia数据
const store = useAppCenterStore()
const { myApps, visible } = storeToRefs(store)

// 搜索相关
const isSearch = ref(false)
const inputValue = ref('')

// 当前选中
const currentItem = ref('')

// 分类后或者搜索后的数据
const list = ref([])

// 获取当前应用
const getItem = (item) => {
    currentItem.value = item
}

// 右键菜单
const arr = ref([
    {
        label:'打开',
        id:"1",
        newIcon: "fluent:open-16-regular",
        callBack: () => {
          //
            const { type , value } = currentItem.value
            startApp(type, value, router)
            currentItem.value.lastUseTime = Date.now()
            visible.value = false
        }
    },
    {
        label:'固定到开始菜单',
        id:"2",
        newIcon: "fluent:grid-16-regular",
        callBack: () => {
            // addStartMenu(currentItem.value)
            currentItem.value.isStart = true
            myApps.value = reloadList(list.value)
            message.info(`${currentItem.value.name}已经固定到开始菜单`)
        }
    },
    {
        label:'删除',
        id:"4",
        newIcon: "fluent:delete-16-regular",
        color: '#f56c6c',
        callBack: () => {
            // console.log('删除')
            delItem(currentItem.value)
        }
    }
])

// 右键菜单
const menus = computed(() => {
    const list = useMenus(3,currentItem.value)
    const menu = [...list, ...arr.value]
    return menu.sort((a, b) => a.id - b.id)
})

// 下拉默认数据
const defaultData = ref({
    id: "1",
    name:'全部应用',
    value:'all'
})

// 监听下拉
watch(
    () => defaultData.value.value,
    (val) => {
        if(val === 'all') {
            list.value = myApps.value
        } else {
            list.value = myApps.value.filter((item) => item.type === val)
        }
    },
    { immediate: true }
)

// 搜索
watch(
    () => inputValue.value,
    (val) => {
        if(val === '') {
            list.value = myApps.value
        } else {
            list.value = myApps.value.filter((item) => item.name.includes(val))
        }
    }
)

// 区分酷应用，轻应用，本地应用
const getInfo = (item) => {
    const { type } = item
    switch (type) {
        case 'localApp':
            return '本地应用'
        case 'coolApp':
            return '酷应用'
        case 'systemApp':
            return '系统应用'
        case 'lightApp':
            return '轻应用'
        case 'folder':
            return '文件夹'
        case 'ttapp':
            return '开发者应用'
        default:
            return '酷应用'
    }
}

// 数据初始化
onMounted(() => {
    if (myApps.value.length === 0 || myApps.value.length !== navigationData.systemAppList.length) {
        // 获取系统应用的列表
        const systemApps = useReplaceData(navigationData.systemAppList);

        // 将新的系统应用添加到 myApps 中
        systemApps.forEach(systemApp => {
            // 检查是否已存在
            if (!myApps.value.some(app => app.value === systemApp.value)) {
                // 初始化新应用的启动状态
                systemApp.isStart = systemApp.isStart || defaultStartMenu.includes(systemApp.value);
                myApps.value.push(systemApp);
            }
        });
    }
    myApps.value = myApps.value.map(item => useTransform(item));
    list.value = myApps.value;
});


// onUnmounted(() => {
//     myApps.value = []
// })

// 打开搜索框
const openSearch = () => {
    isSearch.value = true
}

// 关闭搜索
const closeSearch = () => {
    isSearch.value = false
}

// 搜索
const search = () => {
    console.log(inputValue.value)
    list.value = myApps.value.filter((item) => {
        return item.name.includes(inputValue.value)
    })
}

// 删除
const delItem = (item) => {
    if(item.type === 'lightApp') {
        uninstall(item)
        return
    }
    remove(item)
}

const remove = (item) => {
    myApps.value = myApps.value.filter((ele) => ele.name !== item.name)
    list.value = myApps.value
    message.success(`${item.name}删除成功`)
}

const uninstall = async(app) => {
    let apps = await appModel.getAllApps()
    let appId = app.value.nanoid
    window.$ui.confirm(
       '确定卸载此应用？',
      '此操作将卸载应用并清空所有应用数据，且无法还原。请谨慎操作。',
      {
      okText: '确认',
      type: 'warning',
      ok () {
        console.log(apps, 'apps', appId, 'appId',appModel, 'app')
        // appModel.uninstall(appId).then(
        //     console.log('卸载成功'),
        // )
        appModel.uninstall(app.value.nanoid).then(
          (success) => {
            for (let i = 0; i < apps.length; i++) {
              if (apps[i].nanoid === appId) {
                console.log(apps[i], 'apps[i]')
                apps.splice(i, 1)
              }
            }
            console.log(apps, 'apps')
            ipc.send('message', {
              type: 'success',
              config: { content: '卸载应用成功。' },
            })
            ipc.send('deleteApp', { nanoid: appId })
            remove(app)
          },
          (err) => {
            ipc.send('message', {
              type: 'success',
              config: { content: '卸载失败。' },
            })
          }
        )
      },
      onCancel () {
      },
    })
}

</script>
<style lang='scss' scoped></style>
