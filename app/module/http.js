import JSEncrypt from 'jsencrypt'
import axios from 'axios'
import store from 'store'
import Message from './message'

const instance = axios.create()
const BASEURL = 'http://127.0.0.1:3000'
const TIMEOUT = 3000
const tokenName = 'UA_tks'
const pubKeyName = 'UA_publicKey'
const REQUEST_MAP = {
  'register': {
    url: 'admin/register',
    method: 'POST',
    rsaKey: 'password',
    setToken: true
  },
  'login': {
    url: 'admin/login',
    method: 'POST',
    rsaKey: 'password',
    setToken: true
  },
  'pubKey': {
    url: '/keys',
    method: 'GET',
  },
  'index': {
    url: '/index',
    method: 'GET',
    noMessage: true
  },
  'articles': {
    url: '/api/rest/articles',
    method: 'GET'
  },
  'getArticleById': {
    rest: true,
    url: '/api/rest/articles/:id',
    method: 'GET'
  },
  'columns': {
    url: '/api/rest/columns',
    method: 'GET'
  },
  'postArticle': {
    url: '/api/rest/articles',
    method: 'POST'
  },
  'postColumn': {
    url: '/api/rest/columns',
    method: 'POST'
  },
  'postComment': {
    url: '/api/rest/comments',
    method: 'POST'
  },
  'uploadArticle': {
    url: '/upload/article',
    method: 'POST'
  },
  'uploadAvatar': {
    url: '/upload/user',
    method: 'POST'
  },
  'getUserInfo': {
    url: '/user',
    method: 'GET',
    noMessage: true
  },
  'putUserInfo': {
    url: '/user',
    method: 'PUT',
  },
}

instance.defaults.baseURL = BASEURL
instance.defaults.timeout = TIMEOUT
instance.interceptors.request.use(async (config) => {
  const token = store.get(tokenName)
  if (token) {
    config.headers.common['Authorization'] = `Bearer ${token}`
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  let result = response.data
  return result?.data;
}, (error) => {
  //响应状态码不是200就会触发
  return Promise.reject(error);
});


export default async function Http({ type = 'user', data = {} } = {}) {
  if (!(type in REQUEST_MAP)) {
    throw new Error('API请求错误')
  }
  let { url, method, rest = false, rsaKey = false, setToken = false, noMessage = false } = REQUEST_MAP[type]
  method = method.toLocaleLowerCase()
  try {
    if (rest) {
      let restSymbol = url.match(/:(.*)$/)[1]
      url = url.replace(/:(.*)$/, data[restSymbol])
    }
    if (rsaKey && rsaKey in data) {
      data[rsaKey] = await encrypt(data[rsaKey])
    }

    data = method === 'get' ? { params: { ...data } } : data  //若当前属性值为undefined,则获取不到
    let result = await instance[method](url, data)
    if (setToken) {
      let token = result.token;
      store.set('uid', result.userId)
      store.set(tokenName, token)
    }
    return result
  } catch (error) {
    if (!noMessage && error.response) {
      let message = error.response.data.message
      new Message(message).danger()
    }
    return Promise.reject(error)
  }
}

async function encrypt(val) {
  let pubKey = store.get(pubKeyName)
  if (!pubKey || pubKey === 'undefined') {
    let { method, url } = REQUEST_MAP['pubKey']
    try {
      let res = await instance[method.toLocaleLowerCase()](`${url}`)
      pubKey = res.pubKey
      pubKey = pubKey.replace(/\. +/g, '')
      pubKey = pubKey.replace(/[\r\n]/g, '')
      store.set(pubKeyName, pubKey)
    } catch (err) {
      console.log(err);
    }
  }
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(pubKey)
  return encrypt.encrypt(val)
}


/*

  1. host+port
  2. method 分类
  3. 地址分类管理
  4. 返回内容解构

    result.data.data

    axios.get().then(result=>{
      if(result.statusCode)
    })


  接口地址管理
  host port
  http://127.0.0.1:3000


  url
    register  /user/register
    login     /user/login
    getRSA   /getPublicRsa

    method
      post get

  axios[method](url,data)



  request 接口参数管理
    register  username pwd
    login username pwd


    register:{
      getSms:{
        url:'/newW/api/getSms',
        data:{
          mobile: '手机号',
          uuid: 'UuId'
        }
      }
    }
      register/getSms 短信注册
      register/getUuid 获取注册Uuid

  response 返回内容的过滤和管理
*/