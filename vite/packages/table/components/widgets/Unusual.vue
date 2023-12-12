<template>
    <div class="flex flex-col items-center justify-center w-full h-full primary-text">
        <div>
            <Icon :icon="icons.sleepingFace" width="56" height="56" />
        </div>
        <div class="mt-4">{{ title }}</div>
        <!-- <div class="mt-4 btn xt-active-btn" @click="test">{{ buttonTitle }}</div> -->
        <div class="mt-4 btn xt-active-btn" @click="back">{{ buttonTitle }}</div>
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
    props:['title','buttonTitle','num'],
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
  