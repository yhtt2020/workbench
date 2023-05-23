<template>
  <div class="s-bg p-10 rounded-lg m-3">
    <div class="line-title">
      监控助手
    </div>
    使用数据源：
    <a-radio-group v-model:value="dataSource">
      <a-radio value="aida">Aida64</a-radio>
      <a-radio value="python">内置</a-radio>
    </a-radio-group>
    <div v-if="dataSource==='aida'">
      <div class="mt-5 s-bg p-3">
        <div class="line-title">Aida数据源使用说明 </div>

        <span class="text-base "
        >注：启动Aida64后请等待大约30秒</span
        >
        <a-row :gutter="40">
          <a-col>
            <div class="line-title">
              监控基础数据
            </div>
             <span class="mb-2" style=" line-height: 1.2"
             >第1步.安装Aida64</span
             >

            <div class="mt-3 mb-3">
              <a-button @click="go"  type="primary"
              >
                <span>前往应用市场下载</span>
              </a-button>
            </div>

            <div class="mt-3 mb-3">
              第2步.进入Aida菜单->文件->设置，如图配置AIDA64并运行，点击查看大图
            </div>
            <div>
              <a-image style="width: 200px;border-radius: 4px" placeholder="aida" src="/img/aida.jpg"></a-image>
            </div>
          </a-col>
          <a-col>
            <div class="line-title">
              监控游戏FPS
            </div>
 <span class="mb-2" style="line-height: 1.2"
 >监控游戏「FPS」需要安装并运行RTSS</span
 >
            <div>
              <a-button @click="go"   type="primary"
              >
                <span>前往应用市场下载</span>
              </a-button>
            </div>


          </a-col>
        </a-row>
        <div
          class="content-small text-md   "
        >




        </div>

      </div>
    </div>
    <div v-else>
      <div class="line-title mt-3">
        暂不支持内置数据源
      </div>
    </div>
  </div>

</template>

<script>
import { inspectorStore } from '../../store/inspector'
import { mapWritableState } from 'pinia'

export default {
  name: 'Inspector',
  computed: {
    ...mapWritableState(inspectorStore, ['dataSource'])
  },
  methods:{
    go(){
      this.$router.push({name:'apps'})
    }
  }
}
</script>

<style scoped>

</style>
