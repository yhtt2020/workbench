<template>
  <div class="flex flex-col my-3" style="width: 500px">
    <ModalTop title="选择分组" back="true" @back="backButton" @close="closeButton"/>

    <div class="px-6 flex flex-col">
      <vue-custom-scrollbar :settings="settingsScroller" style="height:350px;">
        <div class="xt-text-2 xt-bg-2 px-4 py-3 flex items-center rounded-lg justify-center font-14 font-400 xt-font ">
          不选择分类默认会将频道添加在最外层第一个位置；支持拖拽排序。
        </div>

        <xt-button class="my-4" style=" width:100%; border: 1px dashed var(--disable-text);background: transparent !important;" @click="addClassItem">
          <div class="flex items-center justify-center">
            <ClassIcon icon="fluent:add-16-filled" style="font-size: 1.25rem;" />
            <span class="font-16 font-400 xt-font ml-2 xt-text">添加新分组</span>
          </div>
        </xt-button>

        <div class="flex flex-col" ref="classSortTab">
          <div v-for="(item,index) in categoryClass" class="flex pointer xt-bg-2 rounded-lg items-center px-5 mb-4"
          :class="{'select-bg':statusIndex === index}" @click.stop="listClick(item,index)" :key="index" style="height:60px;"
          >
          <template v-if="isEditing && editIndex === index">
            <div class="flex w-full justify-between items-center">
              <a-input style="padding: 0;" ref="classInputRef" spellcheck="false" v-model:value="item.name" :bordered="false" @pressEnter.stop="createClass(item)">
                <template #suffix>
                  <div class="flex">
                    <ClassIcon icon="fluent:checkmark-16-filled" class="pointer" style="font-size: 1.5em;" @click.stop="saveEdit(item)"></ClassIcon>
                    <ClassIcon icon="fluent:dismiss-16-filled" class="ml-4 pointer" style="font-size: 1.5em;" @click.stop="exitEdit"></ClassIcon>
                  </div>
                </template>
              </a-input>
            </div>
          </template>
    
          <template v-else>
            <div class="flex w-full justify-between">
              <span class="font-16 font-400 xt-font xt-text">{{ item.name }}</span>
              <div class="flex">
               <ClassIcon icon="akar-icons:edit" class="pointer" style="font-size: 1.5em;" @click.stop="edit(index)"></ClassIcon>
               <ClassIcon icon="akar-icons:trash-can" class="ml-4 pointer" style="font-size: 1.5em;" @click.stop="deleted(item)"></ClassIcon>
              </div>
            </div>
          </template>
          </div>
        </div>

      </vue-custom-scrollbar>
    </div>

    <div class="flex items-center px-6 justify-end mt-4">
      <xt-button w="64" h="40" class="category-button mr-3" @click="closeButton">取消</xt-button>
      <xt-button w="64" h="40" type="theme" class="category-button" @click="finshCategoryCreate">确定</xt-button>
    </div>
  </div>
</template>
 
<script>
import { mapActions, mapWritableState } from "pinia";
import Sortable from "sortablejs";
import { Icon as ClassIcon } from "@iconify/vue";
import { communityStore } from "../../store/communityStore";
import { message, Modal as ClassModal } from "ant-design-vue";
import { channelClass } from '../../../../js/chat/createChannelClass';
import _ from 'lodash-es';

import ModalTop from "../ModalTop.vue";


export default {
  props: ["no", "data", "type"],
  components: {
   ModalTop,ClassIcon
  },

  async mounted() {
    
  },

  data() {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      classItem: "", // 接收选中的分组名称
      statusIndex: -1, // 点击选中下标
      isHover: false, // 判断是否悬浮
      isEditing: false, // 是否这种编辑
      hoverIndex: -1,
      editIndex: -1,
    };
  },

  computed: {
    ...mapWritableState(communityStore, ["community"]),
    categoryClass(){
      return this.community.categoryClass;
    }
  },

  mounted(){
    this.getChannelList(this.no);
    const el = this.$refs.classSortTab;
    new Sortable(el, {
      group: "sortableGroup",
      onEnd: this.onSortEnd, // 拖拽结束时触发的回调函数
    });
  },

  methods: {
    ...mapActions(communityStore,[
      'removeCategory','createChannel','getChannelList',
      'updateCommunityTree',
    ]),
    // 拖拽排序
    onSortEnd(evt){
      let element = this.$refs.classSortTab;
      let newIndex = evt.newIndex,oldIndex = evt.oldIndex;
      let newItem  = element.children[newIndex];
      let oldItem = element.children[oldIndex];
      element.removeChild(newItem);
      if (newIndex > oldIndex){
        element.insertBefore(newItem, oldItem)
      }else{
        element.insertBefore(newItem, oldItem.nextSibling);
      }
      let cloneTemp = [...this.categoryClass]; // 将原数据进行复制
      let temp = cloneTemp[evt.oldIndex]; // 获取旧的下标
      cloneTemp.splice(evt.oldIndex, 1); // 移除旧的下标
      cloneTemp.splice(evt.newIndex, 0, temp); // 将旧的下标进行替换
      // this.updateCategoryClass(cloneTemp);
    },
    // 关闭
    closeButton() {
      this.$emit("close");
    },
    // 返回
    backButton() {
      this.$emit("classBack");
    },
    // 添加新分组
    addClassItem(){
      this.community.categoryClass.unshift({ name: "分类名称" });
      this.edit(0);
    },
    // 编辑中
    edit(index){
      this.isEditing = true;
      this.editIndex = index;
      this.$nextTick(() => {
        const classRef = this.$refs.classInputRef[0];
        classRef.focus();
        classRef.select();
      });
    },
    // 退出编辑
    exitEdit() {
      this.isEditing = false;
    },
    // 创建分组
    createClass(item){
      const option = {
        name: item.name,
        communityNo: this.no,
        type: "category",
        role: "category",
      };
      this.createChannel(option,this.no)
      message.success('分组创建成功')
    },
    // 删除分组
    deleted(item){
      if (item.id){
        ClassModal.confirm({
          content:  "删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？",
          centered: true,
          onOk:()=>{
            this.removeCategory(item.id,this.no);
            message.success('删除成功')
          }
        })
      }else{
        const index = this.community.categoryClass.findIndex((findItem) => {
          return findItem.name === item.name;
        });
        this.categoryClass.splice(index, 1);
      }
    },
    // 保存编辑
    async saveEdit(item){
      if (item.id){
        // const res = await this.updateChannel(item);
      }else{
        this.createClass(item)
      }
    },
    // 选择当前频道目录
    listClick(item, index) {
      // 选中当前频道目录分类
      if (this.statusIndex === index) {
        this.statusIndex = -1;
      } else {
        this.statusIndex = index;
        this.classItem = item;
      }
    },

    // 完成并且创建
    async finshCategoryCreate(){
      const option = {
        type: this.type,
        id: this.classItem.id === undefined ? 0 : this.classItem.id,
        no: this.no,
      };
      const isList = Array.isArray(this.data);
      if(isList){
        const isListLength = this.data.length > 1;
        if(isListLength){
          for(const item of this.data){
            const chatOption = {
             ...option,
             content:{
              name:item.name,
              props:{
                groupID:item.groupID,
                avatar:item.avatar,
                type:item.type,
              }
             }
            }
            channelClass.secondaryChannel(chatOption)
          }
        }
        else {
          const data = this.data[0];
          const dataOption = {
            ...option,
            content:{
              name:data.name,
              props:{
                groupID:data.groupID,
                avatar:data.avatar,
                type:data.type,
              }
            }
          }
          channelClass.secondaryChannel(dataOption);
        } 
        this.closeButton()
      }
      else{
        const channelOption = {
          ...option,
          content:{
           name:this.data.name,
           props:this.type === 'link' ? this.data.props : this.data
          }
        }
        channelClass.secondaryChannel(channelOption)
        message.success('添加应用成功')
        this.closeButton()
      }
    }
  },
};
</script>
 
 <style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
:deep(.ant-input) {
  font-size: 1rem;
}
</style>
 