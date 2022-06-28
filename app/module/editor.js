import Editor from 'wangeditor'
import store from 'store'
import $ from 'jquery'
import Message from './message'

const tokenName = 'UA_tks'
const URL = 'http://127.0.0.1:3000/upload/article'
const ERROR_MAP = {
  title: '标题不能为空',
  content: '内容不能为空',
  column: '请选择分类'
}

export default class Edite {
  constructor(callback) {
    this.editor = null
    this.callback = callback
    this.init()
  }
  init(ele = '.blog-write_wrap') {
    this.editor = new Editor(ele)
    this.editor.config.focus = false
    this.upload()
    this.create()
  }
  upload() {
    this.editor.config.uploadImgServer = URL
    this.editor.config.uploadImgMaxSize = 1024 * 1024
    this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
    this.editor.config.uploadFileName = 'file'
    this.editor.config.uploadImgMaxLength = 5      // 一次最多上传 5个图片
    this.editor.config.uploadImgHeaders = {
      'Authorization': `Bearer ${store.get(tokenName)}`,
    }

  }
  create() {
    this.editor.create()
    this.listen()
  }
  listen() {
    $('.blog-write').on('click', '.blog-write_submit', (e) => {
      e.preventDefault()
      let data = {}
      let content = this.editor.txt.html()
      let column = $('.blog-write_column>.selected').data('column')
      let coverURL = $(content).find('img')[0]?.src

      data.title = $('#blog-write-title').val()
      data.content = content
      data.column = column
      if (coverURL) {
        data.cover = coverURL
      }

      Object.entries(data).some(([key, val]) => {
        let flag = !val || (val.trim().length === 0)
        if (flag) {
          new Message(ERROR_MAP[key]).warning()
          data = null
        }
        return flag
      })


      this.callback(data)
    })
  }
}

