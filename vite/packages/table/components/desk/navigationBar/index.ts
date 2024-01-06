import { nanoid } from "nanoid";
export const navigationPosition = [
    
    {
        title:'左侧导航',
        description:'在工作台左侧显示导航栏',
    },
    {
        title:'右侧导航',
        description:'在工作台右侧显示导航栏',
    },
    {
        title:'底部导航',
        description:'在工作台底部显示导航栏',
    },

]

export const navigationFunction=[
    {
        title:'用户中心',
        description:'在工作台底部显示用户中心',
        tag:'user',
    },
    {
        title:'社区助手',
        description:'在工作台底部显示社区助手',
        tag:'community',
    },
    {
        title:'任务中心',
        description:'在工作台底部显示任务中心',
        tag:'task',
    },
    // {
    //     title:'等级',
    //     description:'在工作台底部显示等级',
    //     tag:'level',
    // },
    {
        title:'社群沟通',
        description:'在工作台底部显示社群沟通',
        tag:'chat',
    }
]

export const extraRightMenu =  [
    {
        title:'添加导航图标',
        icon:'fluent:add-16-regular',
        component:'EditNavigationIcon',

    },
    {
        title:'导航栏设置',
        icon:'fluent:settings-16-regular',
        component:'navigationSetting',
    },
    {
        title:'隐藏当前导航',
        icon:'fluent:eye-off-16-regular',
        visible:true,
        tag:'hide',
    },
]

export const moreMenus = [
    {
        title:'显示用户中心',
        icon:"fluent:person-16-regular",
        visible:true,
        tag:'user'
    },
    {
        title:'显示社区助手',
        icon:"fluent:people-community-16-regular",
        visible:true,
        tag:'community'

    },
    {
        title:'显示任务中心',
        icon:"fluent:task-list-square-16-regular",
        visible:true,
        tag:'task'
    },
    {
        title:'显示社群沟通',
        icon:"fluent:chat-16-regular",
        visible:true,
        tag:'chat'
    }
] 

export const rightMenus=[
    {
        id:1,
        newIcon:'fluent:add-16-regular',
        name:"添加导航图标",
        fn:()=>{  console.log("添加导航图标") },
    },
    {
        id:2,
        name:'编辑导航',
        newIcon:"fluent:compose-16-regular",
        fn:()=>{  console.log('编辑导航') },
    },
    {
        id:3,
        name:'导航栏设置',
        newIcon:'fluent:settings-16-regular',
        color: "#FF4D4F",
        fn:()=>{}
    },
    {
        id:4,
        name:'更多',
        newIcon:'fluent:more-horizontal-16-filled',
        children:[
            {
                id:1,
                name:'显示用户中心',
                newIcon:"fluent:person-16-regular",
                fn:()=>{}
            },
            {
                id:2,
                name:'显示社区助手',
                newIcon:"fluent:people-community-16-regular",
                fn:()=>{}
            },
            {
                id:3,
                name:'显示任务中心',
                newIcon:"fluent:task-list-square-16-regular",
                fn:()=>{}
            }
        ]

    },
    {
        divider: true,
        id: 5
    }

]

export const iconMenus = [
    {
        id:1,
        newIcon:'fluent:open-16-regular',
        name:"打开",
        fn:()=>{  console.log("添加导航图标") },
    },
    {
        id:2,
        name:'编辑',
        newIcon:"fluent:compose-16-regular",
        fn:()=>{  console.log('编辑导航') },
    },
    {
        id:3,
        name:'删除',
        newIcon:'fluent:delete-16-regular',
        color: "#FF4D4F",
        fn:()=>{}
    },
    {
        id:4,
        divider: true
    },
    {
        id:5,
        name:'编辑导航',
        newIcon:"fluent:compose-16-regular",
        fn:()=>{  console.log('编辑导航') },
    },
    {
        id:6,
        name:'导航栏设置',
        newIcon:'fluent:settings-16-regular',
        fn:()=>{}
    }
]

export const webMenus=[
    {
        name:'新闻资讯',
        tag:'information'
    },
    {
        name:'文档表单',
        tag:'docx'
    },
    {
        name:'常用邮箱',
        tag:'email'
    },
    {
        name:'程序开发',
        tag:'code'
    },
    {
        name:'效率工具',
        tag:'effect'
    },
    {
        name:'设计工具',
        tag:'design'
    },
    {
        name:'即时通讯',
        tag:'message'
    },
    {
        name:'休闲娱乐',
        tag:'game'
    },
]

export const iconSize=[
    {
        title:'1x1',
        value:'mini'
    },
    {
        title:'2x1',
        value:'mini1'
    },
    {
        title:'2x2',
        value:'small'
    },
    {
        title:'4x2',
        value:'long'
    },
    {
        title:'4x4',
        value:'big'
    },
]

export const iconShape=[
    {
        title:'正方形',
        value:'square'
    },
    {
        title:'长方形',
        value:'rectangle'
    }
]

export const iconStatus=[
    {
        title:'覆盖',
        value:'cover'
    },
    {
        title:'填充',
        value:'fill'
    },
    {
        title:'缩小',
        value:'small'
    },
    {
        title:"放大",
        value:'big'
    }
]

export const localFiles=[
    {
        name:'全部',
        tag:'all'
    },
    {
        name:'软件',
        tag:"software"
    },
    {
        name:'文档',
        tag:'docx'
    },
    {
        name:"其他",
        tag:'other'
    }
]

export const doc=[
    ".docx",
    ".pptx",
    '.txt',
    '.pdf',
    '.xlsx',
    '.doc',
    '.ppt',
    '.xls',
    '.md',
    '.xml',
    '.docm',
    '.odt',
    '.csv',
    '.pptm',
    '.ppsm',
]


export const addIconPosition=[
    {
        title:'左侧导航',
        value:'left'
    },
    {
        title:'右侧导航',
        value:'right'
    },
    {
        title:'底部导航',
        value:'foot'
    },
    {
        title:"桌面",
        value:"desktop"
    }
]

// 副本内容与原始内容同步
export const updateIcon = (list,copy)=>{
    if (list.length > copy.length) {
        // console.log('list 大于 copy')
        const target = updateNavList(list, copy);
        // console.log(target, 'target[0]')
        // copy = JSON.parse(JSON.stringify(target)).concat(copy);
        for(let i=0;i<target.length;i++){
          const index = list.findIndex(item => {
              return judge(item, target[i]);
          })
          copy.splice(index, 0, target[i]);
        }
        return copy
      } else if (list.length < copy.length) {
        // console.log('list 小于 copy')
        const target = updateNavList(copy, list);
        // console.log(target, 'target[0]')
        target.forEach(element => {
          const index = copy.findIndex(item => {
            // 找到被删除元素在备份数据中的索引
            return judge(item, element);
          });
          if (index !== -1) {
            copy.splice(index, 1);
          }
        })
        return copy
      }
      else {
        // console.log('list 等于 copy')
        const rearrangedCopyFootNav = [];
        // 遍历 footNavigationList，根据其顺序获取 copyFootNav 中对应元素的引用
        list.forEach((item) => {
          // 在 copyFootNav 中寻找与 footNavigationList 对应的元素
          const correspondingElement = copy.find((copyItem) => {
            return judge(item, copyItem);
          });

          // 如果找到对应元素，则将其放入新数组中
          if (correspondingElement) {
            rearrangedCopyFootNav.push(correspondingElement);
          }
        });

        // 更新 copyFootNav 为重新排列后的数组
        copy = rearrangedCopyFootNav;
        return copy
      }
}

// 查找需要删除/添加的元素
export const updateNavList = (list,copy)=>{
    const filteredNavList = list.filter((item) => {
        return !copy.some((i) => {
          if (item.type === 'coolApp') {
            return item.value.url === i.value.url;
          }
          return item.value === i.value;
        });
      });
      return filteredNavList;
}

export const  judge=(ele, item)=> {
    if (ele.type === 'coolApp') {
      return ele.value.url === item.value.url
    } else if (ele.id && item.id) {
      // console.log(ele, item, 'folder is none')
      return ele.id === item.id
    } else {
      return ele.value === item.value
    }
  }

// 图标文件夹模式
// export const iconFolder= (list,index,tIndex)=>{
//     const arr = [list[index],list[tIndex]]
//     return {
//         name:"文件夹",
//         bg:'',
//         isBg:"",
//         icon:'',
//         type:'folder',
//         value:'',
//         children: Array.flat(childrenFolder(arr),1),
//         mode:'app',
//     }
// }

// export const childrenFolder = (list)=>{
//     let arr = []
//     list.map((item)=>{
//         if(item.children){
//             childrenFolder(item.children)
//         }else{
//             arr.push(item)
//         }
//     })
//     return arr
// }
export const iconFolder = (list, index, tIndex) => {
    const arr = [list[index], list[tIndex]];
    return {
        name: "文件夹",
        bg: '',
        isBg: false,
        icon: '',
        type: 'folder',
        value: 'folder',
        children: childrenFolder(arr).flat(1),
        mode: 'app',
        id:nanoid(6),
    }
}

export const childrenFolder = (list) => {
    let arr = [];
    list.forEach((item) => {
        if ( item && item.children) {
            arr.push(...childrenFolder(item.children));
        } else {
            arr.push(item);
        }
    });
    return deduplicateArray(arr);
};

export const  deduplicateArray=(arr)=> {
    return arr.reduce((uniqueArray, item) => {
        // 检查是否已经存在于 uniqueArray 中
        const exists = uniqueArray.some((i) => {
            if (i.type === 'coolApp') {
                return i.value.url === item.value.url;
            } else {
                return i.value === item.value;
            }
        });

        // 如果不存在，则将当前元素添加到 uniqueArray
        if (!exists) {
            uniqueArray.push(item);
        }

        return uniqueArray;
    }, []);
}


export const searchItem = (list,arr) =>{
    list.forEach(element => {
        arr.forEach(item => {
            if(element.type === 'coolApp'){
                return item.value.url === element.value.url
            }else{
                return item.value === element.value
            }
        });
    });
}


export const findItem = (target,list)=>{
    return target.map(element => {
        return  list.find(item => {
            if(element.type === 'coolApp'){
                return item.value.url === element.value.url
            } else if(element.value === 'folder'){
                return findItem(element.children,list.children ? list.children : [list])
            } else{
                return item.value === element.value
            }
        })
    })
}

export const forItem = (arr, list) => {
    return arr.map(element => {
      return list.map(item => {
        if (element.type === 'coolApp') {
          return item.value.url === element.value.url;
        } else {
          return item.value === element.value;
        }
      });
    });
  };
// target.forEach(element => {
//     const index =copyFootNav.findIndex(item => {
//       // 找到被删除元素在备份数据中的索引
//       if (element.type === 'coolApp') {
//         return item.value.url === element.value.url;
//       } else if(element.value === 'folder') {
//         return 
//       }
//       return item.value === element.value;
//     });