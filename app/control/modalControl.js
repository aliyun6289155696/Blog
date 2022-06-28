import Template from './templateControl'
import modalMap from '../config/modal.config'
import $ from 'jquery'

/*
  根据temp 渲染 =>  生成
*/

export default class Modal {
  constructor({ modalWrap = $('.blog-modal'), modalType } = {}) {
    this.wrap = modalWrap
    this.data = {}
    this.modalType = modalType
    this.html = ''
  }

  render() {
    this.data = modalMap[this.modalType]
    this.html = Template.render('modal', this.data)
    this.draw()
  }


  draw() {
    this.clear()
    this.wrap.removeAttr('hidden')
    this.wrap.html(this.html).show()
  }

  clear() {
    this.wrap.html('')
  }

  //关闭
  close() {
    this.reset()
  }

  //提交
  confirm() {
    // 转接给form sumbit处理
    // let oForm = this.wrap.find('form')[0]
    // if (oForm) {
    //   oForm.sumbit()
    // }
  }

  //reset 重置blog-wrap
  reset() {
    this.wrap.hide()
    this.wrap.attr('hidden', true)
  }
}