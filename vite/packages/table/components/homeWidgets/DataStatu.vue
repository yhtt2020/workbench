<template>
    <div class="box">
        <div class="box-block">
            <img :src="imgDisplay" alt="">
            <span>{{ textPrompt }}</span>
            <div class="block-btn" @click="jumpPage">{{ btnText }}</div>
        </div>
    </div>
</template>
  
<script>
  export default {
    name: "DataStatu",
    components:{
    },
    props: {
      imgDisplay: {
        type: String,
        default: "../../../../public/img/test/not-data.png",
      },
      textPrompt: {
        type: String,
        default: "数据获取失败",
      },
      btnDisplay: {
        type: Boolean,
        default: true
      },
      btnText: {
        type: String,
        default: '返回'
      },
    },
    data() {
      return {
        
      };
    },
    methods: {
      jumpPage(){
          this.$emit('notData',false)
        }
    },
  };
</script>
  
<style scoped lang="scss">
    .box{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .box-block{
            display: flex;
            flex-direction: column;
            align-items: center;
            img{
                width: 80px;
                height: 80px;
            }
            span{
                font-size: 16px;
                margin: 16px 0;
            }
            .block-btn{
                text-align: center;
                padding: 13px 24px;
                border-radius: 12px;
                background: rgba(0, 0, 0, 0.3);
            }
        }
    }
</style>


  