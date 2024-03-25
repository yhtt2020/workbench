import { navStore } from "../../../../store/nav"
import {message} from 'ant-design-vue'

export const useCheckBar = (bar:string) => {
    const useNav = navStore()
    let obj = {
        'foot' : useNav.navigationToggle[2],
        'left' : useNav.navigationToggle[0],
        'right' : useNav.navigationToggle[1],
    }
    // 返回除了bar之外的两个bar
    let arr = Object.keys(obj).filter((item) => item !== bar)
    

}