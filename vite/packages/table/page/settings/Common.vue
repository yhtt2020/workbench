<template>
  <div
  >
    <div class="line-title"  v-if="!$usePlat()">界面缩放</div>
    <ZoomUI  v-if="!$usePlat()"></ZoomUI>
    <div class="line-title">工作台界面</div>
    <div v-if="!isMain" class="line">
      显示顶部栏：
      <a-switch v-model:checked="settings.showTopPanel"></a-switch>
    </div>
    <template v-if="settings.showTopPanel">
      <div class="line">
        顶部栏显示日期时间：
        <a-switch v-model:checked="settings.showTopbarTime"></a-switch>
      </div>
      <div class="line">
        顶部栏显示天气（需先设置城市）：
        <a-switch v-model:checked="settings.showTopbarWeather"></a-switch>
      </div>
    </template>

    <div class="line-title">使用习惯</div>
    <div class="line" v-if="$usePlat('client')">
      在系统任务栏显示窗口：
      <a-switch v-model:checked="settings.showInTaskBar"></a-switch>
    </div>
    <template v-if="isMain">
      <div class="line">
        <AutoRun/>
      </div>
      <div class="line"  v-if="$usePlat('client')">
        双击托盘菜单默认打开：
        <a-radio-group v-model:value="trayOpen">
          <!-- 后期可删 -->
          <a-radio value="table" style="color: var(--primary-text)">工作台</a-radio>
          <a-radio value="browser" style="color: var(--primary-text)">浏览器</a-radio>
        </a-radio-group>
      </div>


    </template>
    <div class='line flex w-full'>
      <div style='width:120px'> 右键菜单模式：</div>
      <xt-radio v-model:data='rightModel' :list='rightMenuList'/>
    </div>
    <div class="line-title">数据缓存</div>
    <div class="line flex ">
      <div class="p-2">当前系统缓存数据大小：{{displayCacheSize}}</div>  <xt-button class="ml-4  " :w="100" :h="40" type="theme" @click="clearCache">清理缓存</xt-button>

    </div>
    <div class="line flex">
      <div class="p-2">当前内置浏览器缓存数据大小：{{displayWebCacheSize}}</div>  <xt-button class="ml-4  " :w="140" :h="40" type="theme" @click="clearWebCache">清理浏览器缓存</xt-button>

    </div>

  </div>

</template>

<script>
import ZoomUI from '../../components/comp/ZoomUI.vue'
import { appStore } from '../../store'
import { mapWritableState } from 'pinia'
import AutoRun from '../../components/comp/AutoRun.vue'
import { isMain } from '../../js/common/screenUtils'
import Template from '../../../user/pages/Template.vue'
import { useWidgetStore } from '../../components/card/store.ts'
import { prettyDisplayBytes } from '../../js/action/supervisory'
import { confirm } from '../../ui/new/confirm'
import { message } from 'ant-design-vue'

export default {
  name: 'Common',
  components: { Template, AutoRun, ZoomUI },
  data () {
    return {
      cacheSize:0,//系统缓存
      webCacheSize:0,//浏览器缓存大小
      trayOpen: '',
      showInTaskBar: false,
      rightMenuList: [
        {
          name: '下拉菜单',
          value: 'follow'
        },
        {
          name: '抽屉菜单',
          value: 'default'
        }
      ]
    }
  },
  computed: {
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    isMain,
    displayCacheSize(){
      return prettyDisplayBytes(this.cacheSize)
    },
    displayWebCacheSize(){
      return prettyDisplayBytes(this.webCacheSize)
    }
  },
  async mounted () {
    if (this.$usePlat()) return
    this.trayOpen = await tsbApi.settings.get('trayOpen') || 'table'
    tsbApi.web.getCacheSize((data)=>{
      console.log('获取到了',data)
      this.cacheSize=data.size
    })
    tsbApi.web.getWebCacheSize((data)=>{
      this.webCacheSize=data.size
    })

  },
  methods:{
    clearCache(){
      let beforeSize=this.cacheSize
      window.$ui.confirm("清理缓存",'确定清理工作台系统缓存？此操作将自动清理图片和脚本等临时文件，但不会移除存储内容。', {
        noText: "取消",
        okText: "立即清理",
        ok: () => {
          tsbApi.web.clearCache(()=>{
            console.log('执行到了')
            tsbApi.web.getCacheSize((data)=>{
              this.cacheSize=data.size
              let releaseSize=beforeSize-this.cacheSize
              const tip='清理完成，本次清理共计释放空间：'+prettyDisplayBytes(releaseSize)
              message.success(tip)
            })
          })
        },
        okButtonWidth: "95",
        noButtonWidth: "95",
      });
    },
    clearWebCache(){
      let beforeSize=this.webCacheSize
      window.$ui.confirm("清理缓存",'确定清理内置浏览器缓存？此操作将自动清理内置浏览器的图片和脚本等临时文件，但不会移除存储内容，故操作不能彻底释放缓存空间。', {
        noText: "取消",
        okText: "立即清理",
        ok: () => {
          tsbApi.web.clearWebCache(()=>{
            console.log('执行到了')
            tsbApi.web.getWebCacheSize((data)=>{

              this.webCacheSize=data.size
              let releaseSize=beforeSize-this.webCacheSize
              const tip='清理完成，本次清理共计释放空间：'+prettyDisplayBytes(releaseSize)
              message.success(tip)
            })
          })
        },
        okButtonWidth: "95",
        noButtonWidth: "95",
      });
    }
  },
  watch: {
    'trayOpen': {
      handler: async (value) => {
        await tsbApi.settings.set('trayOpen', value)
      }
    },
    'settings.showInTaskBar': {
      handler: async (value) => {
         tsbApi.window.setSkipTaskbar(!value)
      }
    }
  }
}
</script>

<style scoped>
.unfit {
  color: orangered
}
</style>
