<template>
  <div class="breadcrumb-container">
    <a-breadcrumb-separator class="breadcrumb-left">
      <UnlockFilled class="breadcrumb-lock"/>
      <a-breadcrumb-item class="my-password">我的密码</a-breadcrumb-item>
      <a-breadcrumb-item class="password-group"><a href="">分组A</a></a-breadcrumb-item>
    </a-breadcrumb-separator>   
    <div class="breadcrumb-right">
       <div class="auto-full" v-if="editShow == false">
        <span>自动填充</span>
       </div>
       <div class="auto-full" v-else>
        <span @click="saveChange">保存修改</span>
       </div>
       <a-dropdown :trigger="['click']" width="180">
        <a class="ant-dropdown-link" @click.prevent>
          <EllipsisOutlined class="breadcrumb-icon"/>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0" @click="openEdit">
              <template #icon>
                <FormOutlined style="font-size:16px;color: rgba(0, 0, 0, 0.65);"/>
              </template>
               <span class="medit">编辑</span>
            </a-menu-item>
            <a-menu-item key="1" @click="openShare">
              <template #icon>
                <ShareAltOutlined style="font-size:16px;color: rgba(0, 0, 0, 0.65);"/>
              </template>
              <span class="share">分享</span>
            </a-menu-item>
            <!--主应用中打开下拉菜单打开-->
            <a-menu-item key="2">
              <template #icon>
                <ExportOutlined style="font-size:16px;color: rgba(0, 0, 0, 0.65);"/>
              </template>
              <span class="share">主应用中打开</span>
            </a-menu-item>
            <a-menu-item key="3" @click="shareDelete">
               <template #icon>
                  <MinusCircleOutlined style="color:rgba(255, 77, 79, 1);font-size:16px;"/>
               </template>
               <span class="delete">删除</span>
            </a-menu-item>
          </a-menu>
        </template>
       </a-dropdown>
    </div> 
  </div>
  <div class="breadcrumb-from">
      <div class="breadcrumb-from-header">
          <span class="left-breadcrumb-key">
            <img :src="state.passworItem.url" alt="">
          </span>
          <span class="left-breadcrumb-username" v-if="editShow == false">{{state.passworItem.title}}</span>
          <a-input style="width:80%;" v-else v-model:value="state.passworItem.title"/>
      </div>
      <div class="breadcrumb-from-bottom">

      </div>
  </div>
  <a-modal width="408px"  :centered="true" v-model:visible="sharVisible" title="分享">
    <div class="share-contaniner">
        <div class="share-header">
           <span>
            <svg t="1668734179161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="978" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128">
              <path d="M639.9 351.9C639.9 192.9 511.1 64 352 64S64.2 192.8 64.2 351.9c0 158.9 128.8 287.9 287.9 287.9 158.9-0.1 287.8-128.9 287.8-287.9z m-367.4 16.4c-50.4 0-91.3-40.9-91.3-91.3s40.9-91.3 91.3-91.3 91.3 40.9 91.3 91.3-40.9 91.3-91.3 91.3z" p-id="979" fill="#FFFFFF"></path><path d="M930 732.3L663.8 455l-43 71.6h0.7l253.4 266.3-1.8 27.6-45.9 1.8-237.7-250.4c-39.1 46-85.6 70.5-85.6 70.5l5.5 112 53.3 58.8H706L704.2 949l126.7 11s12.9-12.9 91.9-90c78.9-77.1 7.2-137.7 7.2-137.7z" p-id="980" fill="#FFFFFF"></path>
            </svg>
           </span>
           <div class="share-passeword-right">
                <p>伏娜枝的语雀帐号</p>
                <p>Isabelle_Fisher</p>
           </div>
        </div>
        <div class="share-content">
            <div class="share-content-item">
              <span class="share-content-title">链接有效期</span>
              <a-select v-model:value="validity" style="width: 160px">
                <!--  @focus="focus"  @change="handleChange" -->
                <a-select-option value="0">7天</a-select-option>
                <a-select-option value="1">1天</a-select-option>
                <a-select-option value="2">1小时</a-select-option>
                <a-select-option value="3">14天</a-select-option>
                <a-select-option value="4">30天</a-select-option>
              </a-select>
            </div>
            <div class="share-content-item">
              <span class="share-content-title">分享给</span>
              <a-select v-model:value="value" style="width: 160px" >
                <!-- @change="shareSelectChange" -->
                <!--  @focus="focus"  @change="handleChange" -->
                <a-select-option value="0">任何有此链接的人</a-select-option>
                <a-select-option value="1">仅指定团队</a-select-option>
                <a-select-option value="2">仅指定人员</a-select-option>
              </a-select>
            </div>
        </div>
        <a-checkbox v-model:checked="checked" class="share-checkbox">
          <span>仅允许查看 1 次</span>
        </a-checkbox>
        <template v-if="value==1">
            <span style="margin-bottom:7px;">选择团队</span>
            <a-select v-model:value="teamValue"  mode="tags" style="width: 100%" placeholder="请选择团队">
              <a-select-option value="Ateam">A团队</a-select-option>
              <a-select-option value="Bteam">B团队</a-select-option>
              <a-select-option value="Cteam">C团队</a-select-option>
              <a-select-option value="Dteam">D团队</a-select-option>
            </a-select>
            <span style="margin-top:4px;">仅团队内成员可以查看密码</span>
        </template>
        <template v-if="value==2">
            <span>手机号</span>
            <span style="margin-bottom:4px;color:rgba(00,00,00,0.45);">对方需要验证手机号后才能查看密码</span>
            <a-input-search
            v-model:value="mobileValue"
            placeholder="请输入手机号"
            @search="addTag($event)"
          >
            <template #enterButton >
               <a-button class="add-btn" ref="addBtnRef">
                <PlusOutlined style="padding-left:4px;"/>
                <span>添加手机号</span>
               </a-button>
            </template>
          </a-input-search>
           <a-tag closable 
           style="width:29%;margin: 0;padding: 0px 7px; margin-top:4px;" 
           v-for="item in  mobileTag" :key="item"
           @close="romoveTag(item)"
          >
           {{item}}
          </a-tag>
        </template>
    </div>
    <template #footer>
      <a-button @click="sharVisible = false">取消</a-button>
      <a-button type="primary">获取分享链接</a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  EllipsisOutlined,UnlockFilled,
  FormOutlined,MinusCircleOutlined,
  ShareAltOutlined,PlusOutlined,
  ExclamationCircleOutlined,ExportOutlined
} from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue'
import { appStore } from '../store'
import { mapState } from 'pinia' 
export default {
  name: 'PasswordDetail',
  components:{
    EllipsisOutlined,UnlockFilled,
    FormOutlined,MinusCircleOutlined,
    ShareAltOutlined,PlusOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,ExportOutlined
  },
  computed: {
   ...mapState(appStore, ['passworItem'])
  },
  data(){
    return{
      // 控制是否鼠标悬浮
      webisteVisble:false,
      sharVisible:false,
      // 链接有效期值
      validity:'0',
      // 任何有此链接的人
      value:'0',
      checked:false,
      teamValue:['Ateam'],
      // 是否删除
      deletVisible:false,
      // 密码编辑内容
      formState:{
         username:'Francisco_Phillips',
         password:'123456',
         passwordAccount:'禅道账号',
         websiteValue:'zt.xaingtian.ren'
      },
      // 密码编辑内容验证
      eidtRules:{
        username:[
            {
              required: true,message: '请输入账号名称',
            }
        ],
        password:[
          {
            required: true,message: '请输入正确密码',
          }
        ],
        passwordAccount:[
           {
            required: true,message: '请输入密码昵称',
           }
        ],
        websiteValue:[
          {
             required: true,message: '请填写网址',
          }
        ]
      },
      mobileValue:'',
      // 手机号标记
      mobileTag:['13675425868','13645221134'],
      addDisabled:false,
      editShow:false,
      // 密码账号
      state:appStore()
    }
  },
  async mounted(){
    
  },
  methods:{
    openShare(){
       // 使用一个值控制弹窗
       this.sharVisible = true
    },
    // 删除事件
    shareDelete(){
      Modal.confirm({
        title:"确定要删除当前密码吗，后续您可以在回收站中进行恢复和彻底删除操作?",
        icon: createVNode(ExclamationCircleOutlined),
        okText:"确定",
        cancelText:"取消",
        onOk(){
          
        },
        onCancel(){
          
        }
      });
    },
    // 添加创建tag
    addTag(){
      if(this.mobileValue == ''){
      }
      this.mobileTag.push(this.mobileValue)
      this.mobileValue = ''
    },
    // 移除手机号
    romoveTag(e){
       this.mobileTag.forEach((item,i,arr)=>{
          if(item == e){
            arr.splice(i, 1);
          }
       })
    },
    // 打开编辑模式
    openEdit(){
       this.editShow = true
    },
    // 保存修改
    saveChange(){
      this.editShow = false
      console.log();
    },
    // 鼠标悬浮
    inputHover(){
       this.webisteVisble = true
    },
    inputLeave(){
      this.webisteVisble = false
    }

  }

}
</script>
<style>
.ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover{
   background: rgba(80, 139, 254, 0.1) !important;
}
.ant-dropdown-menu{
    padding: 4px !important;
    border-radius: 4px !important;
}
.ant-tag{
   border-style: solid !important;
}
</style>
<style lang="scss">
.breadcrumb-container{
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  justify-content: space-between;
  .password-group a{
    color: rgba(0, 0, 0, 0.45) !important;
  }
  .password-group .ant-breadcrumb-separator{
    display: none ;
  }
}  
.ant-breadcrumb-separator{
   margin: 0;
}
.breadcrumb-left{
   user-select: none;
   display: flex;
   align-items: center;
   .my-password .ant-breadcrumb-separator{
     margin: 0 5px;
   }
}
.breadcrumb-right{
   display: flex;
   align-items: center;
   .auto-full{
     line-height: 18px;
     padding: 3px 11px;
     border: 1px solid rgba(80, 139, 254, 1);
     border-radius: 4px;
     user-select: none;
     cursor: pointer;
     span{
      color: rgba(80, 139, 254, 1);
      font-size: 14px;
      font-weight: 400;
     }
   }
   .breadcrumb-icon{
     font-size: 16px;
     padding-left: 12px;
     cursor: pointer;
     color: rgba(0, 0, 0, 0.45);
   }
}
.breadcrumb-lock{
   margin-right: 12px;
   font-size: 16px !important;
}
.ant-dropdown-menu-item{
   width: 180px;
}
/*添加按钮样式开始*/
.add-btn{
   padding: 0 ;
}

.ant-btn:active{
  background-color: rgba(216, 216, 216, 1);
}
/*添加按钮样式结束*/
/*编辑分享删除样式开始*/
.medit{
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
}
.share{
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
}
.delete{
   color: rgba(255, 77, 79, 1);
   font-weight: 400;
   font-size: 14px;
   line-height: 21px;
}
/*编辑分享删除样式结束*/
/*分享密码样式开始*/
.ant-modal-header{
   text-align: center;
   color: rgba(0, 0, 0, 0.85);
   font-size: 16px;
   font-weight: 600;
   border: none;
}
.ant-modal-body{
   padding: 0 32px;
}
.ant-modal-footer{
   border: none;
}
/*分享密码样式结束*/
/*分享密码内容开始*/
.share-contaniner{
   display: flex;
   flex-direction: column;
   .share-header{
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      span{
         width: 48px;
         height: 48px;
         display: flex;
         align-items: center;
         justify-content: center;
         border-radius: 6px;
         background: linear-gradient(41deg, rgba(45, 74, 253, 0.59) 0%, rgba(20, 99, 250, 1) 100%), rgba(216, 216, 216, 1);
         svg{
           width: 16px;
           height: 16px;
         }
      }
      .share-passeword-right{
         padding-left: 12px;
         p{
           margin: 0;
           line-height: 17px;
           font-size: 14px;
           font-weight: 400;
           &:nth-of-type(1){
             color: rgba(0, 0, 0, 0.85);
             margin-bottom: 3px;
           }
           &:nth-of-type(2){
              color: rgba(0, 0, 0, 0.45);
           }
         }
      }
   }
   .share-content{
        display: flex;
        justify-content: space-between;
        .share-content-item{
           width: 160px;
           display: flex;
           flex-direction: column;
           margin-bottom: 24px;
           .share-content-title{
             margin-bottom: 7px;
             font-weight: 400;
             font-size: 14px;
             line-height: 21px;
             color: rgba(0, 0, 0, 0.65);
           }
        }
   }
   .share-checkbox{
    margin-bottom: 24px;
   }
}
/*分享密码内容结束*/
/*账号内容开始*/
.breadcrumb-from{}
.breadcrumb-from-header{
   display: flex;
   align-items: center;
   padding-bottom: 24px;
   .left-breadcrumb-key{
    display: flex;
    align-items: center;
    padding-right: 8px;
    img{
      width: 16px;
      height: 16px;
    }
   } 
}
/*账号内容结束*/

</style>
