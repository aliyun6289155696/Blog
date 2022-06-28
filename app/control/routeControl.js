import Template from './templateControl'
import Http from '../module/http';
import Edite from '../module/editor'
import SMERouter from '../route'
import Comment from '../module/comment'
import store from 'store'
import Packery from 'packery'
import modalMap from '../config/modal.config'
import Message from '../module/message'



const router = new SMERouter('page');
const userInfoName = 'UA_info'
let comment = null

// 根据路由名称获取渲染父元素和模版
const ROUTE_MAP = {
  'write': {
    wrap: ".blog-container_wrap",
  },
  'index': {
    wrap: ".blog-head_login",
    tempName: 'user'
  },
  'editor/submit': {
    wrap: ".blog-container_wrap",
    tempName: 'article'
  },
  // 每篇文章
  'article': {
    wrap: ".blog-container_wrap",
    tempName: 'article'
  },
  // 用户文章列表
  'articles': {
    wrap: '.blog-container_wrap',
    tempName: 'articles'
  },
  'columns': {
    wrap: ".blog-container_wrap",
    tempName: 'columns'
  },
  'info': {
    wrap: ".blog-container_wrap",
    tempName: 'info'
  },
  'toolbar': {
    wrap: ".blog-toolbar",
    tempName: 'toolbar'
  },
  'slider': {
    wrap: ".blog-slider_wrap",
    tempName: 'slider'
  },
}

function routeHandle(routeName) {
  if (ROUTE_MAP[routeName]) {
    //动态修改 router的实例wrap容器元素
    router['_mount'] = document.querySelector(ROUTE_MAP[routeName]['wrap'])
  }
}

/*
  模板名称 默认为 routeName 路由名称
  如果 路由表对应路由属性 有tempName属性 那 模板名称 对应tempName属性值
*/
function renderHandle(routeName, data) {
  routeHandle(routeName)
  let { tempName } = ROUTE_MAP[routeName]
  if (!tempName) {
    tempName = routeName
  }
  return {
    dom: Template.render(tempName, data),
    cb: function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  }
}

//应用级中间件
router.use((req) => {
  req.routeName = req.body.routeName
  // 源码res==router, 从而实现所有路由页面先清除toolbal，需要才在对应路由渲染
  router.render(renderHandle('toolbar', { list: [] }))
})

router.route('/index', async (req, res, next) => {
  let routeName = req.routeName
  // 尝试帮用户登录
  try {
    let userInfo = await Http({
      type: 'getUserInfo'
    })
    store.set(userInfoName, userInfo)

    res.render(renderHandle(routeName, { isLogin: true, avatar: userInfo.avatar }))
    res.render(renderHandle('slider', userInfo))
  } catch (error) {
    res.render(renderHandle(routeName, { isLogin: false }))
  }

  router.go('/articles', { ...req.body, routeName: 'articles' })
})

router.route('/info', async (req, res, next) => {
  let routeName = req.routeName
  let data = modalMap[routeName]
  let result = store.get(userInfoName)
  if (!result) {
    new Message('请先登录').warning()
    return;
  }
  data.formData.map(item => {
    if (item.query in result) {
      item.value = result[item.query]
    }
    return item
  })
  res.render(renderHandle(routeName, data))
})

router.route('/articles', async (req, res, next) => {
  let routeName = req.routeName
  let columnId = req.body.columnId
  let q = req.body.search
  try {
    let result = await Http({ type: routeName, data: { column: columnId, q } })
    result.list = result.list.map((item) => {
      let len = ~~($('.blog-container').width() / 16) - 5
      item.content = `${$(item.content).text().slice(0, len)}...`
      return item
    })
    result.columnId = columnId
    res.render(renderHandle(routeName, result))
    res.render(renderHandle('toolbar', { list: [{ route: 'write', icon: 'edit', content: '写文章' }] }))
  } catch (error) {
    console.log(error);
  }
})

// 用户点击文章时   创建文章提交时 进入文章详情页
router.route('/article', async (req, res, next) => {
  let routeName = req.routeName
  try {
    let id = req.body.articleId
    let result = await Http({ type: 'getArticleById', data: { id } })
    res.render(renderHandle(routeName, result))
    //toolbar渲染
    res.render(renderHandle('toolbar', {
      list: [
        {
          icon: 'heart-empty',
          content: result.like_num
        },
        {
          icon: 'eye-open',
          content: result.hit_num
        },
        {
          icon: 'edit',
          content: result.comment_num
        }
      ]
    }))

    if (!comment) {
      comment = new Comment({
        aid: id,
        callback: async (data) => {
          if (!data) {
            return false
          }
          await Http({ type: 'postComment', data })
          console.log(id);
          router.reload('/article', { routeName: 'article', articleId: data.aid })
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
})


router.route('/write', async (req, res, next) => {
  let routeName = req.routeName
  let columnId = req.body.columnId
  try {
    // 获取当前用户分类列表
    let { list } = await Http({ type: 'columns', data: { uid: store.get('uid') } })
    list = list.map((item) => {
      item.selected = item._id === columnId
      return item
    })
    if (!columnId && list.length > 0) {
      list[0].selected = true
    }
    res.render(renderHandle(routeName, { list }))

    // 富文本编辑器初始化
    new Edite(async (data) => {
      if (!data) {
        return false
      }

      let { id: articleId } = await Http({ type: 'postArticle', data })
      router.go('/article', { routeName: 'article', articleId })
    })
    $('.blog-container').css({
      height: 'auto'
    })
  } catch (error) {
    console.log(error);
  }
})

router.route('/columns', async (req, res, next) => {
  let routeName = req.routeName
  try {
    let { list } = await Http({ type: 'columns', data: { uid: store.get('uid') } })
    // 添加属性用于修改元素大小
    list = list.map(item => {
      let len = item.aids.length
      item.size = Math.min((len + 2) * 2, 8)
      return item
    })

    res.render(renderHandle(routeName, { list }))
    new Packery('.blog-column', {})
  } catch (error) {
    console.log(error);
  }
})

//如果没有routeName 重定向到 初始目录
router.route('*', (req, res, next) => {
  if (!req.routeName || req.routeName === 'undefined') {
    router.go('/index', { routeName: "index" })
  }
})


export default router



/*
   params 同 express 路由地址 :后变量
   query hash后 的 ?后的queryString键值对对象
   body 调用go方法 第二个实参 存储位置是sessionStorage
   url 完整的 去除# 的hash字段值
   route 响应的路由地址 

   hack技巧

     1. 运行时hack
     2. 源码hack
 
 */