import {defineStore} from 'pinia'

export const useComStore = defineStore('comStore', {
    state: () => ({
        showTeamTip:false,
        showMyProp:false
    })
})
    