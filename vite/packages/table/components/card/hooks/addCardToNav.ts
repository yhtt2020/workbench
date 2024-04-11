import { storeToRefs } from "pinia";
import { navStore } from "../../../store/nav";
import { computed } from "vue";

/**
 * 导航栏相关信息和函数
 * @state {Boolean} state 导航栏是否显示
 * @tip {String} tip 导航栏提示
 * @fn {Function} fn 添加到导航栏的函数
 * @open {Function} open 打开导航栏
 * @returns {Object}
 */
const navObj = computed(() => {
    const useNavStore = navStore();
    const { 
        copyFootNav, 
        sideNavigationList, 
        rightNavigationList, 
        navigationToggle 
    } = storeToRefs(useNavStore);

    return {
        'foot' : {
            state:navigationToggle.value[2],
            tip:"主导航栏",
            fn:(data : any) => {
                copyFootNav.value.unshift(data)
            },
            open:() => {
                navigationToggle.value[2] = true
            }
        },
        'left' : {
            state:navigationToggle.value[0],
            tip:"左侧导航栏",
            fn:(data : any) => {
                sideNavigationList.value.unshift(data)
            },
            open:() => {
                navigationToggle.value[0] = true
            }
        },
        'right' : {
            state:navigationToggle.value[1],
            tip:"右侧导航栏",
            fn:(data : any) => {
                rightNavigationList.value.unshift(data)
            },
            open:() => {
                navigationToggle.value[1] = true
            }
        },
    }
})

/**
 * 卡片添加到导航栏
 * @param data 卡片数据 暂时只可以传入object
 * @param type 添加到的导航栏 -- foot | left | right
 */
export const addCardToNav = (data : object | Array<object>,type : string) => {
    const nav = navObj.value[type]
    if(nav.state){
        nav.fn(data)
    } else {
        tip(data,nav)
    }
}

/**
 * 没有打开导航栏的提示，打开后自动添加
 * @param data 添加到的导航栏的数据
 * @param nav 当前导航栏
 */
const tip = (data,nav) => {
    window.$ui.confirm(
        `当前${nav.tip}没有打开，是否选择打开${nav.tip}`,
        '',
        {
            ok: () => {
                nav.open()
                setTimeout(() => {
                    nav.fn(data)
                });
            }
        }
    )
}