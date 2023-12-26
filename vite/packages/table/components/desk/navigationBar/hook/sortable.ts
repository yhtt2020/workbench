// 判断重叠区域
export const getArea = (drag,related,ratio) => {
    console.log(drag,related,ratio,'from getArea');
    
    // 计算重叠区域的宽度和高度
    const overlapWidth = Math.min(drag.right, related.right) - Math.max(drag.left, related.left);
    const overlapHeight = Math.min(drag.bottom, related.bottom) - Math.max(drag.top, related.top);

    // 计算重叠区域的面积
    const overlapArea = overlapWidth * overlapHeight;

    // 计算拖拽物体和目标物体的面积
    const dragArea = (drag.right - drag.left) * (drag.bottom - drag.top);
    const targetArea = (related.right - related.left) * (related.bottom - related.top);

    // 计算重叠区域的比例
    const overlapRatio = overlapArea / Math.min(dragArea, targetArea);

    // 返回重叠区域的比例
    if(overlapRatio <= ratio){
        return true
    }else{
        return false
    }
}

// 