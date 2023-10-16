<template>
    <div class="primary-text flex flex-col items-center justify-center w-full h-full">
        <div>
            <Icon :icon="icons.sleepingFace" width="56" height="56" />
        </div>
        <div class="mt-4">{{ title }}</div>
        <!-- <div class="btn xt-active-btn mt-4" @click="test">{{ buttonTitle }}</div> -->
        <div class="btn xt-active-btn mt-4" @click="back(123)">{{ buttonTitle }}</div>
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
    props:['title','buttonTitle','num','back'],
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
      test(){
        console.log(this)
        console.log(this.$props)
      }

    },
  }
  </script>
  
  <style scoped>
  

  </style>
  