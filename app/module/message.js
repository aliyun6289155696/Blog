import template from '../control/templateControl'
import $ from 'jquery'

export default class Message {
  constructor(msg = "未知错误") {
    this.msg = msg
    this.wrap = $('.blog-message')
  }
  success() {
    this.html('success')
  }
  info() {
    this.html('info')
  }
  danger() {
    this.html('danger')
  }
  warning() {
    this.html('warning')
  }
  html(type) {
    this.render(template.render('message', { type, msg: this.msg }))
  }
  render(ele) {
    let wrap = this.wrap
    wrap.append($(ele)).children().addClass('show move').delay(3000).queue(function (next) {
      $(this).remove()
      next()
    })
  }
}