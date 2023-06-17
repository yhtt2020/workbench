<!-- DragAndFollow.vue -->

<template>
    <!-- 可拖拽元素 -->
    <div @mousedown="handleMouseDown" @mouseup="handleMouseUp" @click="handleClick">
        <slot></slot>
    </div>
    <teleport to="body">
        <!-- 拖拽元素 -->
        <div v-show="isDragging" class="follow-container">
            <div class="follow"
                :style="{ transform: `translate(${followPosition.x - followWidth / 2}px, ${followPosition.y - followHeight / 2}px)` }">
                <slot></slot>
            </div>
        </div>
        <!-- 临时容器 -->
        <div class="temp" style="display: none;"></div>
    </teleport>
</template>
  
<script>
export default {
    emits: ['drag-start', 'drag-end', 'click'],
    data() {
        return {
            isDragging: false,
            followPosition: { x: 0, y: 0 },
            followWidth: 0,
            followHeight: 0,
            dragStartTimer: null,
            draggedElement: null,
            tempContainer: null,
        };
    },
    methods: {
        // 鼠标按下事件处理方法
        handleMouseDown(event) {
            this.followPosition = { x: event.clientX, y: event.clientY };
            event.preventDefault();
            this.dragStartTimer = setTimeout(() => {
                // 触发拖拽开始事件，参数为 true 表示允许放置
                this.$emit('drag-start', true);
                event.preventDefault();
                this.isDragging = true;

                const draggableElement = event.target;
                const draggableRect = draggableElement.getBoundingClientRect();

                this.followWidth = draggableRect.width;
                this.followHeight = draggableRect.height;

                this.draggedElement = document.createElement('div');
                this.draggedElement.classList.add('follow');
                this.draggedElement.style.width = draggableRect.width + 'px';
                this.draggedElement.style.height = draggableRect.height + 'px';
                this.draggedElement.style.left =
                    event.clientX - draggableRect.width / 2 + 'px';
                this.draggedElement.style.top =
                    event.clientY - draggableRect.height / 2 + 'px';

                this.tempContainer.appendChild(this.draggedElement);
                document.body.style.cursor = 'move';
            }, 1000);
        },
        // 鼠标抬起事件处理方法
        handleMouseUp() {
            clearTimeout(this.dragStartTimer);
            document.removeEventListener('mousemove', this.handleMouseMove);
            this.dragStartTimer = null;
            if (this.isDragging) {
                this.isDragging = false;
                // 触发拖拽结束事件
                this.$emit('drag-end');

                if (this.draggedElement) {
                    this.draggedElement.remove();
                    this.draggedElement = null;
                }
                document.body.style.cursor = 'default';
            }
        },
        // 鼠标移动事件处理方法
        handleMouseMove(event) {
            // console.log('event :>> ', event);
            if (this.isDragging) {
                this.followPosition = {
                    x: event.clientX,
                    y: event.clientY,
                };
            }
        },
        // 点击事件处理方法
        handleClick(event) {
            if (!this.isDragging) {
                // 触发点击事件
                this.$emit('click');
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            // 监听鼠标移动和抬起事件
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
            this.tempContainer = document.querySelector('.temp');
        });
    },
    beforeDestroy() {
        // 移除事件监听和定时器
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        clearTimeout(this.dragStartTimer);
    },
};
</script>
  
<style scoped>
/* 样式定义 */
.draggable {
    position: absolute;
    background-color: #f1f1f1;
    padding: 10px;
    cursor: pointer;
    user-select: none;
}

.follow-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
}

.follow {
    position: absolute;
    pointer-events: none;
}
</style>
