import IScroll from 'iscroll'
//初始化IScroll
let oCon = document.querySelector('.blog-container')
// 解决移动端无法拖动问题
oCon.addEventListener('touchmove', (e) => {
  e.preventDefault()
}, false)
let scroll = new IScroll('.blog-container', {
  mouseWheel: true,
  // 能获取焦点
  disablePointer: true,
  preventDefault: true,
})

//刷新 scroll 重新根据当前滚动内容适配滚动
scroll.reset = () => {
  scroll.refresh()
  scroll.scroller.style.transform = 'translate(0px, 0px) translateZ(0px)'
  scroll.absStartY = 0
  scroll.startY = 0
  scroll.y = 0
}

export default scroll