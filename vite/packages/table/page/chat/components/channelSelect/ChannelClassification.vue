<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backButton">
    <ClassIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;color:var(--secondary-text);" />
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">选择分组</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
     <ClassIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;color:var(--secondary-text);"/>
   </div>
  </div>

  <div class="px-6 flex flex-col">
   <vue-custom-scrollbar :settings="settingsScroller" style="height:350px;">
    <div class="px-4 py-3 flex items-center font-14-400 mb-4 justify-center rounded-lg" style="background: var(--secondary-bg);color:var(--secondary-text);">
     不选择分类默认会将频道添加在最外层第一个位置；支持拖拽排序。
    </div>
    <div class="flex items-center rounded-lg py-3 pointer mb-4 active-button justify-center" style="border: 1px dashed var(--divider);" @click="addClassItem">
     <ClassIcon icon="fluent:add-16-filled" style="font-size: 1.25rem;" />
     <span class="font-16-400 ml-2" style="color:var(--primary-text);">添加新分组</span>
    </div>

    <div class="flex flex-col" ref="classSortTab">
     <!-- id="classSortTab" -->
     <div v-for="(item,index) in categoryClass" class="flex pointer  rounded-lg items-center px-5 mb-4"
       style="background:var(--secondary-bg);height: 60px;" :class="{'select-bg':statusIndex === index}"
       @click.stop="listClick(item,index)" :key="index"
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
          <span class="font-16-400" style="color:var(--primary-text);">{{ item.name }}</span>
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
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="finshCategoryCreate">确定</XtButton>
  </div>

 </div>


</template>

<script>
//  import { defineComponent, onMounted, reactive, toRefs,ref,nextTick,computed,watchEffect } from 'vue'
import { mapActions,mapWritableState } from 'pinia'
import { LeftOutlined,CloseOutlined,PlusOutlined } from '@ant-design/icons-vue'
import Sortable from 'sortablejs';
import { Icon as ClassIcon} from '@iconify/vue'
import { communityStore } from '../../store/communityStore'
import { channelClass } from '../../../../js/chat/createChannelClass'
import { message,Modal as ClassModal} from 'ant-design-vue'
import _ from 'lodash-es'

export default {
 props:['no','data','type'],
 components:{
  LeftOutlined,CloseOutlined,PlusOutlined,
  ClassIcon,
 },

 async mounted (){
   // await this.getChannelList(this.no)
   this.getChannelList(this.no)

   // const el = document.querySelector('#classSortTab')
   const el = this.$refs.classSortTab
   new Sortable(el,{
     group: 'sortableGroup',
     onEnd:this.onSortEnd // 拖拽结束时触发的回调函数
   })

 },

 data(){
   return{
     settingsScroller: {
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
     },

     classItem:'', // 接收选中的分组名称
     statusIndex:-1, // 点击选中下标
     isHover:false, // 判断是否悬浮
     isEditing:false, // 是否这种编辑
     hoverIndex:-1,
     editIndex:-1,

   }
 },

 computed:{
   ...mapWritableState(communityStore,['categoryClass'])
 },

 methods:{
   ...mapActions(communityStore,[
     'getChannelList','getCategoryData',
     'removeCategory','secondaryChannel','updateCategoryClass','createChannel',
     'updateChannel'
   ]),


   // 拖拽排序
   onSortEnd(evt){
     // console.log('排查问题',evt)

     let newIndex = evt.newIndex , oldIndex = evt.oldIndex
     let newItem = this.$refs.classSortTab.children[newIndex]
     let oldItem = this.$refs.classSortTab.children[oldIndex]
     this.$refs.classSortTab.removeChild(newItem)

     if(newIndex > oldIndex){
      this.$refs.classSortTab.insertBefore(newItem,oldItem)
     }else{
      this.$refs.classSortTab.insertBefore(newItem,oldItem.nextSibling)
     }

     let cloneTemp = [...this.categoryClass]   // 将原数据进行复制
     let temp = cloneTemp[evt.oldIndex]  // 获取旧的下标
     cloneTemp.splice(evt.oldIndex, 1)   // 移除旧的下标
     cloneTemp.splice(evt.newIndex, 0, temp) // 将旧的下标进行替换
     this.updateCategoryClass(cloneTemp)
   },


   closeChannel(){  // 关闭
     this.$emit('close')
   },
   backButton(){  // 返回
     this.$emit('classBack')
   },


   listClick(item,index){  // 选中当前频道目录分类
     if(this.statusIndex === index){
      this.statusIndex = -1
     }else{
      this.statusIndex = index
      this.classItem = item
     }
   },


   deleted(item){  // 删除
     // console.log(item.id);
     if(item.id){
       ClassModal.confirm({
        content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
        centered:true,
        onOk: async ()=>{
         const result = await this.removeCategory(item.id)
         if(result?.status === 1){
          message.success(`${result.info}`)
          await this.getChannelList(this.no)
          await this.getCategoryData(this.no)
         }
        }
       })
     }else{

       const index = this.categoryClass.findIndex((findItem)=>{
         return findItem.name === item.name
       })
       this.categoryClass.splice(index,1)

     }

   },


   addClassItem(){  // 新增
     this.categoryClass.unshift({name:'分类名称'})
     this.edit(0)
     // this.$nextTick(()=>{
     //  const classRef = document.querySelector('#classInputRef')
     //  console.log();
     // //  classRef.focus()
     // //  classRef.select()
     // })
     // console.log(this.categoryClass);
   },

   async saveEdit(item){  // 保存编辑
     // console.log('获取编辑后的数据',item);
     if(item.id){

       const res = await this.updateChannel(item)
       // console.log('更新结果',res.data);
       if(res?.data?.status === 1){
         message.success(`${res.info}`)
         this.getChannelList(this.no)
         this.getCategoryData(this.no)
         this.isEditing = false
       }

     }else{
       const option = {
       name:item.name,
       communityNo:this.no,
       type:'category',
       role:'category'
       }
       // console.log('获取参数::>>',option)
       const res = await this.createChannel(option)
       // console.log('返回结果',res);
       if(res?.status === 1){
        message.success(`${res.info}`)
        this.getChannelList(this.no)
        this.getCategoryData(this.no)
        this.isEditing = false
       }
     }
   },

   exitEdit(){  // 退出编辑
     this.isEditing = false
   },

   edit(index){  // 编辑中
    this.isEditing = true
    this.editIndex = index
    this.$nextTick(()=>{
     //  const classRef = document.querySelector('#classInputRef')
     const classRef = this.$refs.classInputRef[0]
     // console.log('获取输入框ref',classRef);
     classRef.focus()
     classRef.select()
    })
   },

   async createClass(item){
     const option = {
       name:item.name,
       communityNo:this.no,
       type:'category',
       role:'category'
     }
     // console.log('获取参数::>>',option)
     const res = await this.createChannel(option)
     // console.log('返回结果',res);
     if(res?.status === 1){
       message.success(`${res.info}`)
       this.getChannelList(this.no)
       this.getCategoryData(this.no)
       this.isEditing = false
     }

   },


   async finshCategoryCreate(){  // 完成频道目录创建
     const option = {
       type:this.type,
       id:this.classItem.id,
       no:this.no
     }

     if(Array.isArray(this.data)){
       // console.log('this.data是数组')
       const resInfo = {}

       for(let i=0;i<this.data.length;i++){
         const channelOption = {
           ...option,
           content:{
             name:this.data[i].name,
             props:{
               groupID:this.data[i].groupID,
               avatar:this.data[i].avatar,
               type:this.data[i].type
             }
           }
         }
         // console.log('查看参数',channelOption);
         const createRes = await channelClass.secondaryChannel(channelOption)
         resInfo.info = createRes?.info
         resInfo.status = createRes?.status
       }

       if(resInfo?.status === 1){
         message.success(`${resInfo?.info}`)
         await this.getCategoryData(this.no)
         this.closeChannel()
       }

     }else{
       // console.log('this.data不是数组');
       console.log('查看this.data',this.data);

       const channelsOption = {
         ...option,
         content:{
           name:this.data.name,
           props:this.type === 'link' ? this.data.props : this.data
         }
       }

       const createRes = await channelClass.secondaryChannel(channelsOption)
       if(createRes?.status === 1){
         message.success(`${createRes?.info}`)
         await this.getCategoryData(this.no)
         this.closeChannel()
       }

     }

   }

 },

}
</script>

<style lang="scss" scoped>

.font-16-400{

 font-size: 16px;
 font-weight: 400;
}

.close-channel{
 position: absolute;
 top:1px;
 right:12px;
}

.active-button{
 &:active{
  filter: brightness(0.8);
  opacity: 0.8;
 }
 &:hover{
  opacity: 0.8;
 }
}

.font-14-400{

 font-size: 14px;
 font-weight: 400;
}

.back-button{
 position: absolute;
 top: 1px ;
 left: 12px;
}

.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}

:deep(.ant-input){
  font-size: 1rem;
}
</style>
