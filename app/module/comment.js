import $ from 'jquery'
import Message from './message'

const ERROR_MAP = {
  content: '内容不能为空',
}

export default class Comment {
  constructor({ eleInput = '.blog-comment_input', eleSubmit = '.blog-comment_submit', aid, callback } = {}) {
    this.eleInput = eleInput
    this.eleSubmit = eleSubmit
    this.aid = aid
    this.content = ''
    this.callback = callback
    this.listen()
  }
  listen() {
    $(document).on('click', this.eleSubmit, (e) => {
      e.preventDefault()
      let data = {}
      let content = $(this.eleInput).val().trim()

      data.content = content
      data.aid = $(this.eleSubmit).data('article-id')
      Object.entries(data).some(([key, val]) => {
        let flag = !val || (val.trim().length === 0)
        if (flag) {
          new Message(ERROR_MAP[key]).warning()
          data = null
        }
        return flag
      })
      this.callback && this.callback(data)
    })
  }
}

