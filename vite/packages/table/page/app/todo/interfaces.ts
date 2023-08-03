export interface ITaskInfo {
    title: string,
    description: string,
    descriptionType:string,//text rich markdown
    deadTime:number,
    createTime: number,
    updateTime: number,
    isTop: boolean,
    completed:boolean,
    nanoid:string,
    listNanoid:Array<string>,
}
export interface IListInfo {
    title: string,
    description: string,
    createTime: number,
    updateTime: number,
    isTop: boolean,
    completed:boolean,
    nanoid:string,
}

export interface ISort{
    title:string,
    value:number
}
