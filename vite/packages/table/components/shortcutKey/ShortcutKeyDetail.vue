<template>
  <!-- 详情快捷方案 -->
 <div class="detail-box" v-if="keyList.length">
   <!-- 头部导航 -->
   <div class="flex justify-between items-center" style="height: 72px;width:98%">
    <div class="flex items-center">
      <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="flex">
        <div v-for="(item,index) in appList.slice(0,3)" class="head-list"
        :class="navIndex === index ? 's-bg':''" @click="toggleApp(index)">
          <span>
            <a-avatar shape="square" :src="item.icon" :size="38"></a-avatar>
          </span>
          <span class="ml-2" style="font-size: 16px;color: rgba(255,255,255,0.85);">{{ item.name }}</span>
        </div>
      </div>
      <div @click="setShow = true" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center">
        <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
    <div class="flex">
      <div @click="clipSearch" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="dianzan" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center" @click="openSet">
        <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
  </div>
  <!-- 快捷键列表 -->
  <div class="s-bg key-box">
    <template v-for="(item,i) in keyList" :key="i">
      <div class="mb-2 mx-5 border-right"
        style="width: 350px;height:48px;line-height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">
        {{ item.type }}
      </div>
      <div v-for="(k,index) in item.data" :key="k.id" class="border-right flex justify-between items-center px-3 mx-5 h-12 mb-2 pointer"
      style="border-radius: 8px; width: 350px"
      :style="keyIndex === k.id ? 'background: rgba(0,0,0,0.30);':''" @click="toggleKey(k.id)"
      >
        <div class="flex">
          <div v-for="i in k.keys" :key="i" class="flex key-item">
            <span v-if="i.icon" class="s-bg h-8 w-8 flex items-center rounded-lg justify-center mr-3">
              <Icon :icon="i.icon" style="font-size: 1.5em;"></Icon>
            </span>
            <span v-else-if="i.key" class="s-bg h-8 w-8 flex items-center rounded-lg justify-center mr-3">{{ i.key }}</span>
          </div>
        </div>
        <div style="">{{ k.title}}</div>
      </div>
    </template>
    <div class="cover"></div>
  </div>
 </div>
 <!-- 无详情快捷方案 -->
 <div class="detail-box" v-else>
  <!-- 头部快捷软件 -->
  <div class="flex items-center mb-3">
    <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
      <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
    </div>
    <div class="head-list s-bg">
      <span>
        <a-avatar shape="square" :src="appMessage.icon" :size="38"></a-avatar>
      </span>
      <span class="ml-2" style="font-size: 16px;color: rgba(255,255,255,0.85);">{{ appMessage.name }}</span>
    </div>
  </div>
  <!-- 快捷推荐列表 -->
  <NotShortcutKey :notDownloadList="notDownloadList" :detailJump="true" :appMessage="appMessage"></NotShortcutKey>
 </div>
  <!-- 最近使用 -->
  <a-drawer v-model:visible="setShow" title="最近使用" width="500" placement="right">
    <div class="main-part">
        <div v-for="item in appList" class="flex items-center mb-4 pointer" @click="btnDetail(item)">
            <span class="mx-4 h-14 w-14 flex justify-center items-center">
                <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
            <span>{{ item.name }}</span>
            <div class="flex flex-col justify-center items-center">
                <span>{{ item.number }}</span>
                <span>快捷键</span>
            </div>
        </div>
    </div>
  </a-drawer>
</template>

<script>
import NotShortcutKey from './NotShortcutKey.vue'
export default {
  name: 'ShortcutKeyDetail',
  components: {
    NotShortcutKey
  },
  data(){
    return{
      navIndex: 0,
      keyIndex: 1,
      setShow: false,
      appList: [
        {   
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
      ],
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
      ],
      appMessage: {   
        icon: 'http://a.apps.vip/icons/flappy.jpg',
        name: 'Adobe Lightroom',
        number: 92
      },
      //无快捷键列表
      notDownloadList: [
        {   
          id: 1,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 2,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Adobe XD',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 3,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 4,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 5,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 6,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
      ],
    }
  },
  mounted(){
  },
  methods:{
    toggleApp(index){
      this.navIndex = index
    },
    toggleKey(id){
      this.keyIndex = id
    },
    onBack(){
      this.$emit('detailShow',false)
    }
  },
}
</script>

<style lang="scss" scoped>
.detail-box{
  width: 100%;
  height: 100%;
}
  .button-active{
    &:active{
      filter: brightness(0.8);
      background: rgba(42, 42, 42, 0.25);
    }
    &:hover{
      background: rgba(42, 42, 42, 0.25);
    }
  }
  .s-bg{
    box-shadow: none !important;
  }
  .main-part{
        >div{
            background: rgba(0,0,0,0.30);
            border-radius: 12px;
            width:452px;
            height:88px;
            position: relative;
            >div{
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                width: 88px;
                height: 88px;
                background: rgba(0,0,0,0.30);
                border-radius: 0px 12px 12px 0px;
                >span:nth-child(1){
                    font-family: Oswald-SemiBold;
                    font-size: 28px;
                    color: rgba(255,255,255,0.85);
                    font-weight: 600;
                }
            }
        }
        >div:last-child{
          margin-bottom: 0;
        }
    }
  .head-list{
    margin-right: 12px;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 12px;
    min-width: 80px;
    white-space: nowrap;
  }
  .key-box{
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    overflow: auto;
    padding: 24px 0; 
    flex-wrap: wrap;
    height: 85%;
    width: 98%;
    
  }
  .key-box::-webkit-scrollbar{
    display: none;
  }
  .border-right {
    position: relative;
  }
  .border-right::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 0;
    height: 56px;
    margin-left: 10px;
    border-right: solid rgba(255, 245, 245, 0.1) 1px;
  }
</style>