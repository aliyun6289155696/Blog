import modal from 'hbs/modal.hbs'
import user from 'hbs/user.hbs'
import write from 'hbs/write.hbs'
import article from 'hbs/article.hbs'
import articles from 'hbs/articles.hbs'
import message from 'hbs/message.hbs'
import columns from 'hbs/columns.hbs'
import toolbar from 'hbs/toolbar.hbs'
import info from 'hbs/info.hbs'
import slider from 'hbs/slider.hbs'
import $ from 'jquery'


const TEMP_MAP = {
  modal, user, write, article, message, articles, columns, toolbar, info, slider
}

export default class TemplateControl {
  constructor({ wrap = $('body'), name, data = {} } = {}) {
    this.wrap = $(wrap)
    this.name = name
    this.data = data
    this.init()
  }
  init() {
    this.tempHandle = TEMP_MAP[this.name]
    this.render()
  }
  render() {
    this.wrap.html(this.tempHandle(this.data))
  }
  static render(tempName, data) {
    let html = ''
    if (tempName in TEMP_MAP) {
      html = TEMP_MAP[tempName](data)
    }
    return html
  }
}