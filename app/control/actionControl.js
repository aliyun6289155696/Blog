import Modal from './modalControl'
import Router from './routeControl'
import Validate from '../module/validate'
import Http from '../module/http'
import Message from '../module/message'
import Cropper from 'cropperjs'
import $ from 'jquery'

const RES_HANDLE = {
  register() {
    this.index()
  },
  login() {
    this.index()
  },
  index() {
    // 直接index，hashchange不会监听  中转
    Router.reload('/index', { routeName: 'index', isLogin: true })
  },
  postColumn() {
    Router.reload('/columns', { routeName: 'columns' })
  },
  putUserInfo() {
    new Message('修改成功').success()
    Router.go('/index', { routeName: 'index' })
  },
}


/*
  actionControl   事件分离，Dom操作
  管理页面所有发生的行为  调用功能模块
*/
export default class Action {
  constructor() {
    this.init()
    this.modalAgency()
    this.formAgency()
    this.routerAgency()
    this.columnsAgency()
    this.searchAgency()
    this.uploadAgency()
  }

  init() {
    //初始路由
    Router.go('/index', { routeName: 'index' })
  }

  // model行为
  modalAgency() {
    //监听所有的 [data-modal] 元素的 click 渲染唤起对应modal
    $(document).on('click', 'a[data-modal]', (e) => {
      let $target = $(e.target)
      let modalType = $target.data('modal')
      //防止模板渲染时 data-modal属性 没有值
      if (!modalType) {
        return false
      }
      this.modal = new Modal({ modalType })
      this.modal.render()
    })

    //监听modal上的 button
    $(document).on('click', 'button[data-modal-btn]', (e) => {
      let $target = $(e.target)
      let btnType = $target.data('modal-btn')
      //调用modal 对应行为  存在的话
      if (this.modal && btnType) {
        this.modal[btnType]()
      }
    })
  }

  // form行为
  formAgency() {
    //form input 失去焦点时 清除错误提示
    $(document).on('blur', 'form input', (e) => {
      $(e.target).parent().removeClass('blog-error_input')[0].dataset['msg'] = ''
    })

    // form 提交
    $(document).on('submit', 'form', async (e) => {
      let $target = $(e.target)
      let formType = $target[0].id
      try {
        let formData = await new Validate(formType)
        let result = await Http({ type: formType, data: formData })
        if (formType in RES_HANDLE) {
          RES_HANDLE[formType](result)
        }
        this.modal && this.modal.close()
      } catch (errors) {
        console.log(errors, 'actionControl');
      }
    })
  }

  routerAgency() {
    $(document).on('click', 'a[data-router]', function () {
      let $target = $(this)
      let routeName = $target.data('router')
      let articleId = $target.data('article-id')
      let columnId = $target.data('column-id')
      Router.go(`/${routeName}`, { routeName, articleId, columnId })
    })
  }

  columnsAgency() {
    $(document).on('click', 'li[data-column]', function () {
      $(this).addClass('selected').siblings('li').removeClass('selected')
    })
  }

  //搜索处理
  searchAgency() {
    $(document).on('click', '[data-submit]', (e) => {
      let $target = $(e.target)
      let submitType = $target.data('submit')
      let $input = $(`[data-input=${submitType}]`)
      routeSearch($input)
    })

    $(document).on('focus', '[data-input]', (e) => {
      let $inputTarget = $(e.target)
      $inputTarget.on('keyup', getSearchValue)
    })

    $(document).on('blur', '[data-input]', (e) => {
      let $inputTarget = $(e.target)
      $inputTarget.off('keyup', getSearchValue)
    })

    function routeSearch(target) {
      let $target = $(target)
      let val = $target.val()
      if (val) {
        let routeName = $target.data('input')
        Router.reload(`/${routeName}`, { routeName, search: val })
        $target.val('').trigger('blur')
      }
    }

    function getSearchValue(e) {
      if (e.keyCode === 13) {
        routeSearch(e.target)
      }
    }
  }

  uploadAgency() {
    $(document).on('click', '[data-upload]', (e) => {
      let $target = $(e.target)
      let submitType = $target.data('upload')
      let $fileInpt = $(`[data-input-query=${submitType}]`)
      let $img = $(`[data-uplod-img=${submitType}]`)
      $fileInpt.trigger('click')

      $fileInpt.one('change', async () => {
        let imgFile = $fileInpt[0].files[0]
        if (!imgFile) {
          return false
        }

        try {
          let form = new FormData()
          let query = $fileInpt[0].name
          form.append(query, imgFile);
          let imgUrl = await Http({ type: 'uploadAvatar', data: form })
          $img[0].src = imgUrl
          $fileInpt[0].defaultValue = imgUrl

          // cropper && cropper.replace(imgUrl, true)
          // let cropper = new Cropper($img[0], {
          //   viewMode: 1,
          //   aspectRatio: 1 / 1,
          //   dragMode: 'crop',
          //   preview: '.blog-upload_preview',
          //   cropend() {
          //     console.log(cropper.getCroppedCanvas().toDataURL('image/jpg'));
          //   }
          // })
        } catch (error) {
          console.log(error);
        }
      })

    })


  }
}