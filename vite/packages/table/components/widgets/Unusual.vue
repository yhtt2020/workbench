<template>
    <div class="flex flex-col items-center justify-center w-full h-full primary-text">
        <xt-ify-icon :icon="newIcon" size="56" />
        <template v-if="disableEdit">
          <div class="my-4 xt-text-2 font-14">{{ newTitle }}</div>
        </template>
        <template v-else>
          <div class="my-4 xt-text-2 font-14">{{ title }}</div>
        </template>

        <xt-button  h="32" @click="back" type="theme" class="font-14" :radius="8" v-if="!disableEdit"  style="width: auto !important; padding: 0 10px ;">
          {{ buttonTitle }}
        </xt-button>
    </div>
</template>
  <script>
import { Icon } from '@iconify/vue';
import sleepingFace from '@iconify-icons/fluent-emoji/sleeping-face';
  
  export default {
    name: 'Unusual',
    components: {
        Icon
    },
    computed: {

    },
    // newTitle  新空状态描述
    props:['title','buttonTitle','num','disableEdit','newIcon','newTitle'],
    emits: ['back'],
    data () {
      return {
        icons: {
          sleepingFace,
        },

      }
    },
    mounted () {
  
    },
    watch: {},
    methods: {
        back(){
            this.$emit('back')
        }
    },
  }
  </script>
  
  <style scoped>
  

  </style>
  