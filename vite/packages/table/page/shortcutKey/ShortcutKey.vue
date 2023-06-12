<template>
  <!-- <div class="container s-bg rounded-lg" v-if="!detailToggle">
    <div class="ability flex justify-between px-4">
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
    <div class="main-part mt-4">
        <div v-for="item in softwareList" class="flex items-center ml-4 mb-4 pointer" @click="btnDetail(item)">
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
  </div> -->
  <div class="container rounded-lg">
    <div class="mt-11">
        <div class="flex items-center justify-center">
            <a-empty image="/img/test/load-ail.png" description="暂无可用快捷键方案" />
        </div>
    </div>
    <div class="btn-item flex justify-center">
        <div>浏览创意市场</div>
        <div>我来分享</div>
    </div>
  </div>
  <ShortcutKeyDetail v-if="detailToggle" @detailShow="detailShow"></ShortcutKeyDetail>
</template>
  
<script>
  import ShortcutKeyDetail from '../../components/ShortcutKeyDetail.vue';
  import DataStatu from '../../components/widgets/DataStatu.vue';
  export default {
    name: "ShortcutKey",
    components: {
        ShortcutKeyDetail,
        DataStatu
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
            
        ]
      };
    },
    methods: {
        //点击跳转到详情页
        btnDetail(item){
            this.detailToggle = true

        },
        detailShow(val){
            this.detailToggle = val
        }
    },
  };
</script>
  
<style scoped lang="scss">
    .container{
      margin: 0 auto;
      padding: 16px 0;
      width: 1164px;
      height: 568px;
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
        display: grid;
        grid-template-columns: repeat(3, 0.220fr);
        >div{
            background: rgba(0,0,0,0.30);
            border-radius: 12px;
            width:364px;
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


  