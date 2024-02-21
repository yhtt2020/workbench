<template>
    <div class="flex">
        <a-avatar :size="24" shape="square" :src="url" />
        <!-- <img :src="url" class="h-6 w-6" alt=""> -->
        <div class="ml-4">{{ item.name }}</div>
        <!-- <div style="opacity: 0;">{{ url }}</div> -->
    </div>
</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../store'
  import { getFavicon } from "../../../components/desk/navigationBar/hook/getUrlName";
  
  export default {
    name: 'WebItem',
    props: ['item'],
    data() {
      return {
        url:'https://a.apps.vip/icons/iconSelect/emoji/globe-showing-asia-australia.svg'
      }
    },
    mounted(){
        console.log(this.item)
        if(this.item.icon){
            this.url = this.item.icon
        }else{  
            // 第一次加载的话将图标写进缓存
            getFavicon(this.item.url).then(res=>{
                let icon = 'https://a.apps.vip/icons/iconSelect/emoji/globe-showing-asia-australia.svg'
                // 如果找到icon 就替换 不然就使用默认图标
                this.url = res.faviconURL?res.faviconURL:icon
                this.allList.forEach((i, index)=>{
                    if(i.guid == this.item.guid){
                        this.allList[index].icon = this.url
                    }
                })
            })
        }
    },
    components: { 
      Icon,
    },
  
    computed:{
      ...mapWritableState(favoStore, ['isFavorites', 'urlIndex', 'allList']),
      
    },
    methods: {
      
    }
  }
  </script>
  
  <style scoped lang="scss">
  </style>
  