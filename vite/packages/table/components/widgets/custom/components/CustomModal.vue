<template>
    <xt-modal :modelValue="modalVisible" :full="true" @no="close" index="50" maskIndex="40">
        <template #header-center>自定义图片小组件设置</template>
        <div class="p-4 rounded-lg xt-bg-2">
            <div class="mb-4 text-base xt-text">图片</div>
            <div class="mb-4 text-sm xt-text-2">上传一张图片作为小组件的封面，建议图片不要超过5MB。</div>
            <UploadImage :img="img" @update:img="updateImg"></UploadImage>
        </div>
        <div class="p-4 mt-4 rounded-lg xt-bg-2">
            <div class="mb-4 text-base xt-text">链接</div>
            <div class="text-sm xt-text-2 ">设置点击图片后打开的链接地址。</div>
            <div class="flex flex-row items-center justify-center mt-4" style="gap: 20px;" v-if="appPath == undefined || appPath == '' ">
                <xt-button w="132" h="40" radius="8" class="xt-bg" @click="openLink">网站链接</xt-button>
                <xt-button w="132" h="40" radius="8" class="xt-bg" @click="localFile">本地文件</xt-button>
                <xt-button w="132" h="40" radius="8" class="xt-bg" @click="openApp">应用导航</xt-button>
            </div>
            <div class="mt-4" v-else>
              <xt-option-input v-model:input="inputPath"></xt-option-input>
            </div>

        </div>
        <div class="p-4 mt-4 rounded-lg xt-bg-2">
            <xt-option-info
                :title="unBorder.title"
                :info="unBorder.info"
                :isSwitch="unBorder.isSwitch"
                :switch="unBorder.switch"
                @update:switch="updateBorder">
            </xt-option-info>
            <div class="w-full h-[1px] mb-2" style="background:var(--divider) ;"></div>
            <xt-option-info
                :title="displayName.title"
                :info="displayName.info"
                :isSwitch="displayName.isSwitch"
                :switch="displayName.switch"
                @update:switch="updateName">
            </xt-option-info>
            <xt-option-input v-model:input="inputValue"></xt-option-input>
        </div>
        <teleport to='body'>
            <EditNewNavigation
                :isFolder="true"
                v-if="editVisible"
                @setQuick="editVisible = false"
                @addIcon="getApp">
            </EditNewNavigation>
            <CustomLink
                v-if="linkVisible"
                v-model="linkVisible"
                :linkLimit="{hideTab:true,hideIcon:true}"
                @save="saveLink">
            </CustomLink>
        </teleport>
    </xt-modal>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, toRefs,watch,onMounted,defineAsyncComponent } from 'vue'
import UploadImage from './UploadImg.vue';
// import EditNewNavigation from '../../../desk/navigationBar/EditNewNavigation.vue';
const EditNewNavigation = defineAsyncComponent(() => import('../../../desk/navigationBar/EditNewNavigation.vue'));
// import CustomLink from '../../../desk/navigationBar/components/CustomLink.vue';
const CustomLink = defineAsyncComponent(() => import('../../../desk/navigationBar/components/CustomLink.vue'));
import {useNavigationStore} from '../../../desk/navigationBar/navigationStore';
const props = defineProps({
    modalVisible: {
        type: Boolean,
        default: false
    },
    noBorder: {
        type: Boolean,
        default: false
    },
    showName: {
        type: Boolean,
        default: false
    },
    customInput: {
        type: String,
        default: ''
    },
    linkPath: {
        type: String,
        default: ''
    },
    img:{
        type: Object,
        default: {}
    }
})

const inputValue = ref('')
const editVisible = ref(false)
const appPath = ref('')
const inputPath = ref('')
const linkVisible = ref(false)

const store = useNavigationStore()

const { noBorder, showName,customInput,linkPath } = toRefs(props)

const emit = defineEmits([
    'close',
    'localFile',
    'update:img',
    'updateBorder',
    'updateName',
    'updateInput',
    'updateLink'
])

const close = () => {
    // console.log('close')
    emit('close', false)
}

const unBorder = computed(() => {
    return {
        title: '无边框模式',
        info: '开启后将不显示小组件的背景边框。',
        isSwitch: true,
        switch: noBorder.value,
    }
})

const displayName = computed(() => {
    return {
        title: '显示名称',
        info: '在图片下方显示自定义名称。',
        isSwitch: true,
        switch: showName.value,
    }
})

const openLink = () => {
    linkVisible.value = true
}

const saveLink = (val: string) => {
    linkVisible.value = false
    inputPath.value = val
    emit('updateLink', val)
}

const updateBorder = (val: boolean) => {
    // console.log('updateBorder', val)
    emit('updateBorder', val)
}

const updateName = (val: boolean) => {
    emit('updateName', val)
    // console.log('updateName', val)
}

watch(()=>inputValue.value, (val) => {
    emit('updateInput', val)
    // console.log('customInput', val)
})

watch(()=>inputPath.value, (val) => {
    emit('updateLink', val)
    // console.log('linkPath', val)
})

watch(()=>linkPath.value, (val) => {
    appPath.value = val
    inputPath.value = appPath.value.value || appPath.value
    // console.log('linkPath', val)
})

onMounted(() => {
    inputValue.value = customInput.value
    appPath.value = linkPath.value
    inputPath.value = appPath.value.value || appPath.value
})

const localFile = async() => {
    let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择图片",
        filters: [{ name: "图片", extensions: ["png",'jpeg','jpg','svg','bmp','gif','webp'] },{ name: "全部", extensions: ["*"] }],
        properties: ["multiSelections"],
      });
      if (!openPath) {
        return;
      } else {
        emit('localFile', openPath[0])
      }
}

const openApp = () => {
    editVisible.value = true
    store.selectNav = 'desktop'
}

const getApp = (item:object,index: number) => {
    // console.log('getApp', index, item)
    emit('updateLink', item)
    editVisible.value = false
}

const updateImg = (img) => {
    // console.log('updateImg', img)
    emit('update:img', img)
}
</script>
<style lang='scss' scoped></style>
