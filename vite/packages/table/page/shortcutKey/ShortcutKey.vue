<template>
    <!-- 有内容 -->
  <div class="container s-bg rounded-lg" v-if="!detailToggle && false">
    <div class="flex justify-between px-4">
        <div class="flex items-center">
          <div>
            <a-input v-model:value="userName" :bordered="false" placeholder="搜索应用名称" style="width:367px;height: 48px;background: rgba(0,0,0,0.30);border-radius: 12px;border: 1px solid rgba(255,255,255,0.1);font-size: 18px;">
            <template #prefix>
              <Icon icon="sousuo" class="mr-2"></Icon>
            </template>
          </a-input>
          </div>
          <span class="ml-3" style="font-size: 16px;color: rgba(255,255,255,0.60);width:200px;">共27个应用快捷键方案</span>
        </div>
        <div class="btn-item">
            <div class="s-bg">创意市场</div>
            <div class="s-bg">我来分享</div>
            <span class="button-active pointer s-bg"><Icon icon="setting" style="width: 20px;height: 20px;color:rgba(255, 255, 255, 0.4);"></Icon></span>
        </div>
    </div>
    <div class="prompt mt-4 mx-4 px-4 flex justify-between items-center" v-show="closePrompt">
        <span class="flex items-center">
            <Icon icon="tishi-xianxing" style="width: 21px;height: 21px;color:#508BFE;"></Icon>
            <span class="mx-4">从工作台启动的Windows应用，默认会自动打开可用的快捷键方案。</span>
        </span>
        <Icon icon="guanbi2" style="width: 20px;height: 20px;color:#7A7A7A;" @click="closePrompt = false"></Icon>
    </div>
    <div class="main-part item-content">
        <div v-for="item in softwareList" class="flex items-center pointer" @click="btnDetail(item)">
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
  </div>
  <!-- 无内容 -->
  <div class="container rounded-lg flex flex-col items-center">
    <div class="mt-11">
        <div class="flex items-center justify-center">
            <a-empty image="/img/test/load-ail.png" description="暂无可用快捷键方案" />
        </div>
    </div>
    <div class="btn-item flex justify-center">
        <div class="pointer" @click="market">浏览创意市场</div>
        <div class="pointer" @click="share">我来分享</div>
    </div>
    <div class="item-content mt-4">
        <div v-for="item in notDownloadList" :key="item.id" class="p-3 pointer recommend">
            <div class="flex justify-between">
                <div class="flex">
                    <span class="h-14 w-14 flex justify-center items-center">
                        <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
                    </span>
                    <span class="flex flex-col ml-4">
                        <span style="font-size: 18px;color: rgba(255,255,255,0.85);font-weight: 500;">{{ item.name }}</span>
                        <span class="mt-1" style="font-size: 16px;color: rgba(255,255,255,0.60);">{{ item.commonUse }}</span>
                    </span>
                </div>
                <div class="flex flex-col justify-center items-center w-16 h-16 s-bg rounded-lg">
                    <span style="font-family: Oswald-SemiBold;font-size: 24px;color: rgba(255,255,255,0.85);font-weight: 600;">{{ item.number }}</span>
                    <span>快捷键</span>
                </div>
            </div>
            <div class="flex justify-between items-center mt-4" style="font-size: 14px;color: rgba(255,255,255,0.60);">
                <span class="flex items-center">
                    <div @click="showCard(item.id)">
                        <a-avatar size="24">
                            <template #icon><UserOutlined /></template>
                        </a-avatar>
                    </div>
                    <span class="ml-3">{{ item.userName }}</span>
                </span>
                <span>
                    <span>
                        <Icon icon="dianzan" class="mr-2"></Icon>
                        <span>{{ item.sumLikes }}</span>
                    </span>
                    <span class="ml-3">
                        <Icon icon="xiazai" class="mr-2"></Icon>
                        <span>{{ item.download }}</span>
                    </span>
                </span>
            </div>
        </div>
    </div>
  </div>
  <ShortcutKeyDetail v-if="detailToggle" @detailShow="detailShow"></ShortcutKeyDetail>
</template>
  
<script>
  import { mapActions } from 'pinia';
  import ShortcutKeyDetail from '../../components/ShortcutKeyDetail.vue';
  import { appStore } from '../../store';
  export default {
    name: "ShortcutKey",
    components: {
        ShortcutKeyDetail
    },
    data() {
      return {
        userName: '',
        detailToggle: false,
        closePrompt: true,
        softwareList: [
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
        ]
      };
    },
    methods: {
        ...mapActions(appStore,['showUserCard']),
        showCard(id){
            this.showUserCard(id)
        },
        //点击跳转到详情页
        btnDetail(item){
            this.detailToggle = true

        },
        detailShow(val){
            this.detailToggle = val
        },
        //跳转到分享页
        share(){
            this.$router.push({name: 'shareKey'})
        },
        market(){
            this.$router.push({name: 'creativeMarket'})
        }
    },
  };
</script>
  
<style scoped lang="scss">
    .container{
      margin: 0 auto 12px;
      padding: 16px 0;
    //   width: 1164px;
    //   height: 568px;
      height: 98%;
    //   background: #1A1A1A;
      background: var(--primary-bg);
      overflow: hidden;
    }
    .s-bg{
        box-shadow: none !important;
    }
    .btn-item{
        display: flex;
        >div{
            background: var(--primary-bg);
            width: 160px;
            text-align: center;
            height: 48px;
            line-height: 48px;
            margin-right: 14px;
            border-radius: 12px;
        }
        >span{
            background: var(--primary-bg);
            border-radius: 12px;
            width: 48px;
            height: 48px;
            line-height: 54px;
            text-align: center;
        }
    }
    .prompt{
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        height: 56px;
    }
    .main-part{
        >div{
            background: rgba(0,0,0,0.30);
            border-radius: 12px;
            width:364px;
            height:88px;
            position: relative;
            margin: 16px 0 0 16px;
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
    }
    .item-content{
        width: 100%;
        height: 80%;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow: auto;
        padding-bottom: 40px;
    }
    .item-content::-webkit-scrollbar{
        display: none;
    }
    .recommend{
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        width: 356px;
        height: 136px;
        margin: 0 0 16px 16px;
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
</style>


  