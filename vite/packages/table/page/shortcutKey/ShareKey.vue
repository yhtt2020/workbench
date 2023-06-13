<template>
  <div class="p-3 s-bg rounded-lg" style="height: 720px;">
    <!-- 导航 -->
    <div class="flex items-center justify-between">
      <div class="flex">
        <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
          <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
        </div>
        <HorzontanlPanelIcon :navList="navType" v-model:selectType="defaultNavType"></HorzontanlPanelIcon>
      </div>
      <div class="flex btn-item">
        <div class="pointer">保存</div>
        <div class="pointer">保存并分享到创意市场</div>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="add-content" v-if="defaultNavType.name === 'message'">
      <span>图标</span>
      <div class="flex">
        <div class="avatar">
          <div>
            <a-avatar :size="100">
              <template #icon><UserOutlined /></template>
            </a-avatar>
          </div>
          <span><Icon icon="guanbi2" style="font-size: 1.5em;"></Icon></span>
        </div>
        <div class="ml-10" style="font-family: PingFangSC-Regular;font-size: 16px;color: rgba(255,255,255,0.60);">
          <div>推荐图片尺寸：128*128，不要超过2MB</div>
          <div class="pointer s-bg flex items-center rounded-lg justify-center mr-3 mt-2" style="width:120px; height:48px;">自定义上传</div>
        </div>
      </div>
      <span>应用名称</span>
      <a-input v-model:value="userName" :bordered="false" placeholder="请输入应用名称" style="width:480px;height: 48px;background: rgba(0,0,0,0.30);border-radius: 12px;border: 1px solid rgba(255,255,255,0.1);font-size: 16px;">
      </a-input>
      <span>方案简介</span>
      <a-textarea v-model:value="value" :bordered="false" placeholder="请输入描述" :rows="4" style="width:480px;height: 100px;background: rgba(0,0,0,0.30);border-radius: 12px;border: 1px solid rgba(255,255,255,0.1);font-size: 16px;"/>
      <div class="pointer s-bg flex items-center rounded-lg justify-center mr-3 mt-6" style="width:480px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">下一步</div>
    </div>
    <!-- 快捷键 -->
    <div v-else>
      <!-- 输入框 -->
      <div class="flex mt-7">
        <a-input class="ml-3" v-model:value="userName" :bordered="false" placeholder="按下组合键" style="width:227px;height: 48px;background: rgba(0,0,0,0.60);border-radius: 12px;color: rgba(255,255,255,0.40);font-size: 16px;"/>
        <a-input class="ml-3" v-model:value="userName" :bordered="false" placeholder="操作名称" style="width:227px;height: 48px;background: rgba(0,0,0,0.60);border-radius: 12px;color: rgba(255,255,255,0.40);font-size: 16px;"/>
        <div class="pointer s-bg flex items-center rounded-lg justify-center ml-3" style="width:120px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">添加快捷键</div>
        <a-input class="ml-3" v-model:value="userName" :bordered="false" placeholder="按下分类名称组合键" style="width:227px;height: 48px;background: rgba(0,0,0,0.60);border-radius: 12px;color: rgba(255,255,255,0.40);font-size: 16px;"/>
        <div class="pointer s-bg flex items-center rounded-lg justify-center ml-3" style="width:120px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">新建分类</div>
      </div>
      <!-- 提示 -->
      <div class="prompt mt-4 mx-4 px-4 flex justify-between items-center" v-show="closePrompt">
        <span class="flex items-center">
          <Icon icon="tishi-xianxing" style="width: 21px;height: 21px;color:#508BFE;"></Icon>
          <span class="mx-4">从工作台启动的Windows应用，默认会自动打开可用的快捷键方案。</span>
        </span>
        <Icon icon="guanbi2" style="width: 20px;height: 20px;color:#7A7A7A;" @click="closePrompt = false"></Icon>
      </div>
      <!-- 快捷键列表 -->
      <div class="key-list">
        <template v-for="(item,i) in keyList">
          <div class="mb-2 mx-5 border-right"
            style="width: 350px;height:48px;line-height:48px;font-size: 16px;color: rgba(255,255,255,0.85);"
            >
            {{ item.type }}
          </div>
          <div v-for="(k,index) in item.data" class="border-right flex justify-between items-center px-3 mx-5 h-12 mb-2 pointer"
          style="border-radius: 8px; width: 350px"
          :style="keyIndex === k.id ? 'background: rgba(0,0,0,0.30);':''" @click="toggleKey(k.id)"
          >
            <div class="flex">
              <div v-for="i in k.keys" class="flex key-item">
                <span v-if="i.icon" class="s-bg h-8 w-8 flex items-center rounded-lg justify-center mr-3">
                  <Icon :icon="i.icon" style="font-size: 1.5em;"></Icon>
                </span>
                <span v-else-if="i.key" class="s-bg h-8 w-8 flex items-center rounded-lg justify-center mr-3">{{ i.key }}</span>
              </div>
            </div>
            <div style="">{{ k.title}}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HorzontanlPanelIcon from '../../components/HorzontanlPanelIcon.vue'
export default {
  name: 'ShareKey',
  components: {
    HorzontanlPanelIcon
  },
  data(){
    return{
      navType:[
         {title:'基本信息',name:'message'},
         {title:'快捷键',name:'shortcutkey'}
      ],
      defaultNavType:{title:'基本信息',name:'shortcutkey'},
      closePrompt: true,
      keyList: [
        {
          type: '常用',
          data: [
            {
              id: 1,
              keys: [
                {icon: 'linechart'},
                {key: 'H'}
              ],
              title: '首选项'
            },
            {
              id: 2,
              keys: [
                {icon: 'linechart'},
                {icon: 'linechart'},
                {key: 'Q'}
              ],
              title: '清除浏览器数据'
            },
            {
              id: 3,
              keys: [
                {icon: 'linechart'},
                {key: 'H'}
              ],
              title: '隐藏 Microsoft Edge'
            },
            {
              id: 4,
              keys: [
                {icon: 'linechart'},
                {key: 'H'}
              ],
              title: '隐藏 Microsoft Edge'
            }
          ]
        },
        {
          type: '文件',
          data: [
          {
            id: 5,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '首选项'
          },
          {
            id:6,
            keys: [
              {icon: 'linechart'},
              {icon: 'linechart'},
              {key: 'Q'}
            ],
            title: '清除浏览器数据'
          },
          {
            id:7,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '隐藏 Microsoft Edge'
          },
          {
            id:8,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '首选项'
          },
          {
            id:9,
            keys: [
              {icon: 'linechart'},
              {icon: 'linechart'},
              {key: 'Q'}
            ],
            title: '清除浏览器数据'
          },
          {
            id:10,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '隐藏 Microsoft Edge'
          },
          {
            id:11,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '首选项'
          },
          {
            id:12,
            keys: [
              {icon: 'linechart'},
              {icon: 'linechart'},
              {key: 'Q'}
            ],
            title: '清除浏览器数据'
          },
          ]
        },
        {
          type: '其他',
          data: [
          {
            id: 13,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '首选项'
          },
          {
            id:14,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '隐藏 Microsoft Edge'
          },
          {
            id:15,
            keys: [
              {icon: 'linechart'},
              {icon: 'linechart'},
              {key: 'Q'}
            ],
            title: '清除浏览器数据'
          },
        ]
        }
      ]
    }
  },
  methods: {
    onBack(){
      this.$router.go(-1)
    }
  },
}
</script>

<style lang="scss" scoped>
  .btn-item{
    display: flex;
    >div{
      background: var(--primary-bg);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
    }
    div:nth-child(1){
      width: 120px;
      height: 48px;
    }
    div:nth-child(2){
      width: 200px;
      height: 48px;
      margin-left: 12px;
    }
  }
  .add-content{
    width: 480px;
    margin: 0 auto;
    >span{
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
      margin: 21px 0;
      display: block;
    }
  }
  .avatar{
    width: 100px;
    height: 100px;
    position: relative;
    >span{
      position: absolute;
      top: -14px;
      right: -14px;
    }
  }
  .key-list{
    display: flex;
    flex-direction: column;    
    flex-wrap: wrap;
    overflow: hidden;
    align-content: flex-start;
    padding: 24px 0;
    height: 500px;
  }
  .prompt{
      background: rgba(0,0,0,0.30);
      border-radius: 12px;
      height: 56px;
    }
  .right-text{
    margin: 0 40px;
  }
  .border-right {
    position: relative;
  }
  .border-right::after {
    content: '';
    position: absolute;
    right: -19px;
    height: 56px;
    margin-left: 10px;
    border-right: solid rgba(255,255,255,0.10) 1px;
  }
  .s-bg{
        box-shadow: none !important;
    }
</style>