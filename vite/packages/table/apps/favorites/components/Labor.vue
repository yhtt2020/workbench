<template>
    <div class="absolute bottom-4 right-4">
      <!-- 收藏 -->
        <xt-button class="absolute tran right-0" @click="addFavo" :radius="8" :w="32" :h="32" :class="checkFlag?'b-10 opacity-100':'bottom-0 opacity-0'">
            <xt-new-icon v-if="!favoFlag" icon="fluent:star-16-regular" size="16" />
            <xt-new-icon v-else icon="fluent:star-16-filled" size="16" color="#faad14" />
        </xt-button>
        <!-- 添加到桌面 -->
        <xt-menu :menus="menus" model="click"  @mounted="changeMenu">
          <xt-button class="absolute tran right-0" :radius="8" :w="32" :h="32" :class="checkFlag?'b-20 opacity-100':'bottom-0 opacity-0'">
              <xt-new-icon icon="fluent:add-20-regular" size="16" />
          </xt-button>
        </xt-menu>
        <!-- 菜单 -->
        <xt-button @click="changeList" type="theme" :radius="8" :w="32" :h="32" class="absolute bottom-0 right-0">
            <xt-new-icon icon="fluent:grid-20-regular" size="16" />
        </xt-button>
    </div>

</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../store'
  import { message } from 'ant-design-vue';
  
  
  export default {
    name: 'Labor',
    props: ['checkFlag', 'menus'],
    data() {
      return {
        favoFlag: false,
      }
    },
    async mounted(){

    },
    components: { 
      Icon,
    },
  
    computed:{
      ...mapWritableState(favoStore, ['isFavorites', 'urlIndex', 'allList']),
      
    },
    methods: {
      changeList(){
        this.favoFlag = false
        this.$emit('changeCheck')
      },

      changeMenu(){
        let arr = this.allList.filter(item=>{
          return item.check
        })
        this.$emit('changeIcon', arr)

      },

      addFavo(){
        this.favoFlag = !this.favoFlag
        this.allList.forEach(i=>{
          if(i.check){
            i.favo = this.favoFlag
          }
        })
        if(this.favoFlag){
          message.success('全部收藏成功')
        }else{ 
          message.success('全部取消收藏')
        }
        this.$emit('countFavo')
      },
      
    }
  }
  </script>
  
  <style scoped lang="scss">
    .tran{
        transition: all linear 0.3s;
    }

    .b-10{
        bottom: 40px;
    }
    .b-20{
        bottom: 80px;
    }
  </style>
  