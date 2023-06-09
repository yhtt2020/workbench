<template>
  <div class="container ">
    <div class="ability flex justify-between px-4">
        <div class="flex items-center">
          <div>
            <a-input v-model:value="userName" placeholder="搜索应用名称" style="width:367px;height: 48px;background: rgba(0,0,0,0.30);border-radius: 12px;border: 1px solid rgba(255,255,255,0.1);font-size: 18px;">
            <template #prefix>
              <Icon icon="sousuo" class="mr-2"></Icon>
            </template>
          </a-input>
          </div>
          <span class="ml-3" style="font-size: 16px;color: rgba(255,255,255,0.60);width:100%;">共27个应用快捷键方案</span>
        </div>
        <div class="r-item">
            <div>创意市场</div>
            <div>我来分享</div>
            <span><Icon icon="setting" style="width: 20px;height: 20px;color:rgba(255, 255, 255, 0.4);"></Icon></span>
        </div>
    </div>
    <div class="prompt mt-4 mx-4 px-4 flex justify-between items-center">
        <span class="flex items-center">
            <Icon icon="tishi-xianxing" style="width: 21px;height: 21px;color:#508BFE;"></Icon>
            <span class="mx-4">从工作台启动的Windows应用，默认会自动打开可用的快捷键方案。</span>
        </span>
        <Icon icon="guanbi2" style="width: 20px;height: 20px;color:#7A7A7A;"></Icon>
    </div>
    <div class="main-part mt-4">
        <div v-for="item in softwareList" class="flex items-center ml-4 mb-4">
            <span class="mx-4">
                <a-avatar shape="square" :src="item.avatar" :size="56"></a-avatar>
            </span>
            <span>{{ item.name }}</span>
            <div class="flex flex-col justify-center items-center">
                <span>{{ item.number }}</span>
                <span>快捷键</span>
            </div>
        </div>
    </div>
  </div>
</template>
  
<script>
  export default {
    name: "ShortcutKey",
    data() {
      return {
        userName: '',
        softwareList: [
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },

            {
                avatar: 'http://a.apps.vip/icons/flappy.jpg',
                name: 'Adobe Lightroom',
                number: 92
            },
            
        ]
      };
    },
    methods: {
     
    },
  };
</script>
  
<style scoped lang="scss">
    .container{
      padding: 16px 0;
      width: 100%;
      height: 99%;
      opacity: 0.65;
      background: #1A1A1A;
      border-radius: 12px;
    }
    .r-item{
        display: flex;
        >div{
            background: rgba(0,0,0,0.30);
            // padding: 13px 48px;
            width: 160px;
            text-align: center;
            height: 48px;
            line-height: 48px;
            margin-right: 14px;
            border-radius: 12px;
        }
        >span{
            background: rgba(0,0,0,0.30);
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
</style>


  