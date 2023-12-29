// 判断重叠区域
/**
 * 
 * @param drag 被拖拽元素的信息
 * @param related 目标元素的信息
 * @param clientY 鼠标当前的X/Y的位置
 * @param isAfter 在目标元素的前面还是后面
 * @returns 
 */
export const getArea = (drag,related,clientY,isAfter) => {
    console.log(drag,related,clientY,'from getArea');
    const ratio = related.width * 0.2
    if(isAfter){
        console.log(clientY,(related.left + related.width - ratio))
        return clientY >= (related.left + related.width - ratio) && clientY <= (related.left + related.width)
    }else{
        return clientY <= (related.left + ratio) && clientY >= (related.left)
    }
}

// 