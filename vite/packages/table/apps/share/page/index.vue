<template>
    <vueCustomScrollbar :settings="scrollbarSettings" style="padding: 15px;white-space: nowrap;height: 100%">
  
        <div class="page-container rounded-xl xt-bg" style="height: 100%;">
            <div class="left-box">
                <!-- 头像框 -->
                <div class="head-sculpture">
                    <!-- 头像 -->
                    <div class="head-circle">

                    </div>
                    <!-- 昵称 -->
                    <div class="head-title">

                    </div>
                </div>
                <!-- 左侧列表 -->
                <div class="nav-list">

                </div>

            </div>
        </div>

  
    </vueCustomScrollbar>
  

  </template>
  
  <script>

  
  export default {
    name: 'Share',
    components: { },
    computed: {
    //   ...mapState(appStore, ['userInfo','secondaryVisible'])
    },
    data(){
      return {

      }
    },
    mounted(){

    },
    watch:{

    },
    methods:{

    },
  }
  </script>
  
  <style scoped>

  </style>
  