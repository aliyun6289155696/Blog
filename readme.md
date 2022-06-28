## 非工程化项目 进行 webpack工程化改建

> 两个点：使用了webpack对其他形式的amd,cmd，commonjs导出方式，都可以使用import来导入
>
> 其次，那个模块需要使用第三方库，就在当前模块导入就行了，直接导入第三方模块名，会默认在node_module找，若有其他模块也想使用这个第三方库也必须导入，否则识别不了，有作用域问题。
>
> 如果有多个入口模块，需要引入有相同的第三方模块库这可能会导致重复模块问题，需要分离。

1. 梳理js 模块
  1. 梳理第三方模块 

    node_modules
    validator.tool wangeditor sme-router store jsencrypt axios
    体量小 功能单一 在部分 原生模块中引入使用

  2. 梳理CDN 非本地 第三方模块

    jquery bootstrap
    体量大 功能复杂 全局产生作用 

  3. 整理原生模块中的导入情况

    之前通过js直接引入到html文件 
      第三方模块 的导出前言判断 都可以挂载到 window对象上
    
    import 导入第三方模块
      webpack 会从 node_modules内寻找模块 文件 进行模块化兼容封装处理 帮我们 把处理好的 第三方模块 导入原生模块中
      语法: import 模块自定义别名 from '第三方模块名'
    
      $ 就是 jquery的 别名 也是 jquery 的标识符

2. 梳理 预处理/模板 资源
  1. webpack 引入对应 loader处理编译对应文件

  2. hbs模板 

    before
      hbs模板文件 xxx.hbs 需要手动 使用 handlebars 工具编译 生成 对应模板的 compile函数 Handlebars.templates[文件原名]
    
    调用的时候 从全局获取Handlebars属性去拿 对应的模板编译函数来处理数据 生成 html
    
    after
      webpack + handlebars + handlebars-loader
      
      在第一方模块中引入 hbs文件
    
      打包 或者 dev 模式开发 webpack会自动的识别 .hbs后缀的导入内容 结合loader 编译好 compile函数 赋值给 import 别名

  3. style样式文件 不变 
     直接使用 stylus 监听编译 生成css文件 直接引入到 HTML内

3. 整理webpack工程化项目目录结构 和 配置文件

  1. dist 输出目录
  2. src 待编译资源
  3. public/assets 静态资源 css / img
  4. app 原生模块存放
  5. html页面模板文件



  ## 类库
  IScroll 滚动容器
  http://caibaojian.com/iscroll-5/

  注意:
  1. 初始化需要设置 **滚动容器的父容器进行初始化**
  2. 滚动容器的父容器 **阻止 touchmove的默认行为**

  ```js
npm i iscroll
//移动端 阻止 touchmove的默认行为
oCon.addEventListener('touchmove', (e) => {
	e.preventDefault()
}, false)

new IScroll('.blog-container', {
	mouseWheel: true,	//必写
    scrollbars: true	//是否显示滚动条，默认false不显示
})
  ```

```html
注意滚动容器的如果有多项子元素，需要用一个div包裹起来。

<div class = 'blog-container'>
   <div class = 'blog-container_wrap'>
		<div class="box"></div>
		<div class="box"></div>
		<div class="box"></div>
   </div>
    <div class="scrollbar"></div>
</div>
实际是定位在blog-container（定高溢出隐藏），根据子元素高度，加效果，在添加scroollbar
```

