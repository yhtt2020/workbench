<template>
    <div class="absolute bottom-4 right-4">
        <xt-button class="absolute tran right-0" :radius="8" :w="32" :h="32" :class="flag?'b-10 opacity-100':'bottom-0 opacity-0'">
            <xt-new-icon icon="fluent:star-16-regular" size="16" />
        </xt-button>
        <xt-button class="absolute tran right-0" :radius="8" :w="32" :h="32" :class="flag?'b-20 opacity-100':'bottom-0 opacity-0'">
            <xt-new-icon icon="fluent:add-20-regular" size="16" />
        </xt-button>
        <xt-button @click="flag = !flag" type="theme" :radius="8" :w="32" :h="32" class="absolute bottom-0 right-0">
            <xt-new-icon icon="fluent:grid-20-regular" size="16" />
        </xt-button>
    </div>

</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../store'
  
  
  export default {
    name: 'Labor',
    data() {
      return {
        flag: false,
        
      }
    },
    async mounted(){

    },
    components: { 
      Icon,
    },
  
    computed:{
      ...mapWritableState(favoStore, ['isFavorites', 'urlIndex']),
      
    },
    methods: {
      
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
  