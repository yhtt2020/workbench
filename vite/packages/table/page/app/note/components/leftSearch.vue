<template>
    <div class="flex flex-col justify-between h-full xt-br mr-3">
      <div class="xt-scrollbar" style="width: 320px">
        我是左侧搜索
        <div>
            <div v-for="(item,index) in noteList" @click="changeNote(index)" style="width: 296px;height:134px;;border-radius: 10px;padding: 12px;"
            :class="index == noteIndex?'note-active':''">
                <div class="flex list-top font-16 items-center">
                    <span  :style="{background:item.backgroundColor}"></span>
                    <div class="ml-2">{{ item.title }}</div>
                </div>
                <div class="mt-3 font-16" style="height:44px;">
                    {{ item.content }}
                </div>
                <div class="bottom mt-3 fon-14">
                    {{ item.time }}{{ item.desk?'.'+item.desk:'' }}
                </div>
                
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    components: {
    },
    data() {
      return {
        noteIndex:0,
        noteList:[
            {
                title:'今日事今日毕',
                content:'今日事今日毕',
                time:'十分钟前',
                desk:'日常桌面',
                backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
            },
            {
                title:'今日事今日毕',
                content:'今日事今日毕',
                time:'十分钟前',
                desk:'日常桌面',
                backgroundColor:"linear-gradient(-45deg, #545454 0%, #51E191 0%, #42CAAB 100%)",
            },
            {
                title:'今日事今日毕',
                content:'今日事今日毕',
                time:'十分钟前',
                desk:'日常桌面',
                backgroundColor:"linear-gradient(-45deg, #545454 0%, #FDE485 0%, #F895AA 100%)",
            },
            {
                title:'今日事今日毕',
                content:'今日事今日毕',
                time:'十分钟前',
                desk:'日常桌面',
                backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
            },
            {
                title:'今日事今日毕',
                content:'今日事今日毕',
                time:'十分钟前',
                desk:'日常桌面',
                backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
            },
        ]
      };
    },
    computed: {
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        changeNote(n){
            this.noteIndex = n
        }
    },
  };
  </script>
  
  <style lang="scss" scoped>
    .note-active{
        background: rgba(80,139,254,0.20);
    }

    .list-top span{
        display: flex;
        width: 20px;
        height: 20px;
        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
        border-radius: 6px;
    }
</style>
  