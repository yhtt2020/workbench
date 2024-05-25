{
  //index.js
  const template = document.createElement("template");
//在js文件中，我们想要书写html和css就必须要借助innerHTML，在其内部书写我们的样式和结构
  template.innerHTML = `
  <style>
    #contain {
      display: flex;
      flex-direction: column
    }
    input {
      width: 200px
    }
  </style>
  <div id="contain">
    <span><slot></slot></span>
    <div>
     <input type="text" id=input>
     <button id="mybutton" data-text1="111111">添加</button>
    </div>
  </div>
`;
  class MyList extends HTMLElement {
    constructor() {
      //因为我们的组件继承于HTMLElement，所以需要调用super关键字
      super();
      // 获取标签
      const content = template.content.cloneNode(true);
      const mybutton = content.getElementById("mybutton");
      const input = content.getElementById("input");
      const contain = content.getElementById("contain");

      // 获取props
      const arr = JSON.parse(this.dataset.arr);
      //进行事件的监听
      mybutton.addEventListener("click", () => {
        arr.push(input.value)
        const li = document.createElement("li");
        li.innerText = input.value;
        contain.appendChild(li);
      });
      // 将数据渲染到页面
      arr.forEach((item) => {
        const li = document.createElement("li");
        li.innerText = item;
        contain.appendChild(li);
      });
      //初始化一个影子dom
      this.attachShadow({ mode: "closed" }).appendChild(content);
    }
  }
// 注册组件
  if(!window.customElements.get('my-list')){
    window.customElements.define("my-list", MyList);
  }
}
