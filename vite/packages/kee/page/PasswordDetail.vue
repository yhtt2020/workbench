<template>
  <div class="breadcrumb-container">
    <a-breadcrumb-separator class="breadcrumb-left">
      <UnlockFilled class="breadcrumb-lock"/>
      <a-breadcrumb-item class="my-password">我的密码</a-breadcrumb-item>
      <a-breadcrumb-item class="password-group"><a href="">分组A</a></a-breadcrumb-item>
    </a-breadcrumb-separator>   
    <div class="breadcrumb-right">
       <div class="auto-full">
        <span>自动填充</span>
       </div>
       <a-dropdown :trigger="['click']" width="180">
        <a class="ant-dropdown-link" @click.prevent>
          <EllipsisOutlined class="breadcrumb-icon"/>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0">
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
            <a-menu-item key="3">
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
  <div class="breadcrumb-bottom-container">
      <div class="breadcrumb-bottom-name">
          <span>
            <i class="iconfont icon-yuechi1"></i>
          </span>
          <span class="name">禅道账号</span>
      </div>
      <div class="breadcrumb-bottom-card">
         <div class="breadcrumb-bottom-user">
            <a href="" class="user">用户名</a>
            <span>Francisco_Phillips</span>
         </div>
         <div class="breadcrumb-bottom-password">
            <a href="" class="cryptogram">密码</a>
            <span>··········</span>
         </div>
      </div>
      <div class="breadcrumb-bottom-sites">
          <a href="" class="sites-name">网站</a>
          <a href="http://zt.xiangtian.ren/" class="sites">zt.xaingtian.ren</a>
      </div>
      <div class="breadcrumb-bottom-sites">
        <a href="" class="sites-name">网站</a>
        <a href="https://www.yuque.com/" class="sites">www.yuque.com</a>
      </div>
      <div class="breadcrumb-bottom-remark">
           <a href="#" class="remark">备注</a>
           <span class="ana">团队语雀公用帐号，注意不要对外分享该密码</span>
      </div>
  </div>
  <a-modal width="408px" v-model:visible="sharVisible" title="分享">
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
    </div>
    <template #footer>
      <a-button @click="sharVisible = false">取消</a-button>
      <a-button type="primary" @click="handleOk">获取分享链接</a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  EllipsisOutlined,UnlockFilled,
  FormOutlined,MinusCircleOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue'
export default {
  name: 'PasswordDetail',
  components:{
    EllipsisOutlined,UnlockFilled,
    FormOutlined,MinusCircleOutlined,
    ShareAltOutlined
  },
  data(){
    return{
      sharVisible:false
    }
  },
  methods:{
    openShare(){
       // 使用一个值控制弹窗
       this.sharVisible = true
    },
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

/*底部内容开始*/
.breadcrumb-bottom-name {
   margin-bottom: 24px;
   .name{
     padding-left: 13px;
     font-size: 16px;
     font-weight: 500;
     color: rgba(0, 0, 0, 0.85);
   }
}
.breadcrumb-bottom-card{
   border: 1px solid rgba(230, 230, 230, 1);
   border-radius: 6px;
   margin-bottom: 24px;
   .breadcrumb-bottom-user{
     padding: 7px 12px 6px 12px;
     border-bottom: 1px solid rgba(230, 230, 230, 1);
     display: flex;
     flex-direction: column;
     .user{
       color: rgba(104, 81, 214, 1);
       font-size: 12px;
       font-weight: 400;
       line-height: 17px;
     }
     span{
      font-size: 14px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
     }
   }
   .breadcrumb-bottom-password{
    padding: 7px 12px 6px 12px;
    display: flex;
    flex-direction: column;
    .cryptogram{
      color: rgba(104, 81, 214, 1);
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
    }
    span{
       font-size: 22px;
       color: rgba(0, 0, 0, 0.85);
       font-weight: 400;
       line-height: 22px;
    }
   }
}
.breadcrumb-bottom-sites{
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    margin-bottom: 24px;
    .sites-name{
       color: rgba(104, 81, 214, 1);
       font-size: 12px;
       font-weight: 400;
       line-height: 17px;
    }
    .sites{
       line-height: 20px;
    }
}
.breadcrumb-bottom-remark{
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  margin-bottom: 24px;
  .remark{
     color: rgba(104, 81, 214, 1);
     font-size: 12px;
     font-weight: 400;
     line-height: 17px;
  }
  .ana{
     color: rgba(0, 0, 0, 0.65);
     font-size: 14px;
     font-weight: 400;
     line-height: 20px;
  }
}
/*底部内容结束*/

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
}
/*分享密码内容结束*/
</style>
