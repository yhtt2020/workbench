<template>
    <div class="flex flex-col justify-between h-full xt-br mr-3">
      <div class="xt-scrollbar" style="width: 308px">
        <div class="flex w-full pr-3 mt-3 mb-4">
            <a-input
                style="height:40px;background: var(--secondary-bg);
                border: 1px solid rgba(255,255,255,0.1);flex:1;width: 80%;
                border-radius: 10px;"
                placeholder="搜索"
                v-model:value="searchValue"
                @change="searchIcon"
            ><Icon :icon="icons.search20Filled" /></a-input>
            <xt-button class="flex justify-center items-center ml-3" :w="40" :h="40"  style="background:var(--secondary-bg);border-radius: 10px;" @click="addNote">
            <Icon :icon="icons.add16Filled" class="flex items-center" width="20" height="20"/>
          </xt-button>
        </div>
        <div>
            <div v-for="(item,index) in this.noteList" @click="changeNote(index)" style="width: 296px;height:134px;;border-radius: 10px;padding: 12px;"
            :class="index == this.selNote?'note-active':''">
                <div class="flex list-top font-16 items-center" style="color: var(--primary-text);">
                    <span  :style="{background:item.backgroundColor}"></span>
                    <div class="ml-2">{{ item.title }}</div>
                </div>
                <div class="mt-2 font-16 two-hidden" style="height:46px;color: var(--secondary-text);">
                    {{ item.content }}
                </div>
                <div class="bottom mt-3" style="color: rgba(255,255,255,0.40);font-size: 14px;">
                    {{ item.time }}{{ item.desk?'.'+item.desk:'' }}
                </div>
                
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Icon } from '@iconify/vue';
  import add16Filled from '@iconify-icons/fluent/add-16-filled';
  import search20Filled from '@iconify-icons/fluent/search-20-filled';
  import {mapActions, mapState,mapWritableState} from "pinia";
  import { noteStore } from '../store'
  export default {
    components: {
        Icon
    },
    data() {
      return {  
			icons: {
				add16Filled,
				search20Filled,
			},
      };
    },
    computed: {
        ...mapWritableState(noteStore, ['noteList','selNote']),
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        changeNote(n){
            this.selNote = n
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

    .two-hidden{
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
  