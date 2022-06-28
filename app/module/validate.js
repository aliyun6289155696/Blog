import { getFormJson } from '../util/util'
import Validator from 'validator.tool'
import $ from 'jquery'


export default class RegExpVerify {
  constructor(formType) {
    // 表单id名称
    this.formType = formType
    this.form = $(`#${this.formType}`)
    return this.submitIntercept()
  }

  submitIntercept() {
    this.forMap = {
      register: {
        username: {
          rule: 'required|is_username',
          msg: '账号必填|账号格式 数字+字母 6-16位'
        },
        password: {
          rule: 'required|is_pwd',
          msg: '密码必填|密码格式 至少包含大写字母+小写字母+数字 8-12位'
        },
        email: {
          rule: 'required|is_email',
          msg: '邮箱必填|请填写正确的邮箱格式'
        }
      },
      login: {
        username: {
          rule: 'required|is_username',
          msg: '账号必填|账号格式 数字+字母 6-16位'
        },
        password: {
          rule: 'required|is_pwd',
          msg: '密码必填|密码格式 至少包含大写字母+小写字母+数字 8-12位'
        }
      },
      postColumn: {
        name: {
          rule: 'required',
          msg: '分类名称必填'
        }
      },
      putUserInfo: {
        email: {
          rule: 'required|is_email',
          msg: '邮箱必填|请填写正确的邮箱格式'
        }
      },
    }
    return this.validatorFactory()
  }
  validatorFactory() {
    let formObj = this.forMap[this.formType]
    let validateArr = this.outPutValidator(formObj)
    return this.creawteRev(validateArr)
  }
  //创建校验对象
  creawteRev(validateArr) {
    return new Promise((resolve, reject) => {
      new Validator(this.formType, validateArr, (obj, evt) => {
        if (obj.errors.length === 0) {
          // 验证成功返回表单对象
          let formData = getFormJson(this.form)
          if (this.formType === 'putUserInfo') {
            let file = this.form.find('input[type="file"]')[0]
            formData[file.name] = file.defaultValue
          }
          resolve(formData)
          return false
        }
        this.errorControl(obj)
        reject(obj.errors)
      }).validate()
    })
  }

  outPutValidator(formObj) {
    return Object.entries(formObj).map(([key, val]) => {
      return {
        'name': key,
        'display': val.msg,
        'rules': val.rule
      }
    })
  }

  errorControl(obj) {
    obj.errors[0]['element'].focus()
    //循环所有错误 反馈信息
    obj.errors.map(({ message, element }) => {
      $(element).parent().addClass('blog-error_input')[0].dataset['msg'] = message
    })
  }

}

/*
  数据校验
  1 静态校验
    submit || onblur  校验 所有表单input or 单个input的内容是否符合规范
   input 内容校验
      正则表达式 规则.test(input.value) => ?pass

      校验类型(账号 密码 邮箱 手机 身份证 汉字 长度 必填) 正则
      错误信息: 针对校验类型返回给用户的错误提示
      校验标识: 通过标识 获取对应input 内容

      通过标识 校验类型 错误信息 inputDOM关联

      submit => 格式化表单对象{key(username):value(val)} => key 查询表 获取对应校验类型正则 + 错误信息 => 进行通道校验 => 校验成功?"下一个input校验":"返回错误信息"=>

    错误反馈展示
      1. input框变色 or input框右侧 标识符号(√ ×)
      2. input 下方or右侧 红色小字提示格式错误
      3. topTips or tosat框 提示

    错误反馈逻辑
      1. 按序排错 (一次一个)
      2. 错误罗列 (所有的错误提示都展示出来)

    用户行为节点 关键Event

    Event节点: submit 提交
    错误反馈: 全反馈 + 临时文本插入 input下方


    校验类型(账号 密码 邮箱 手机 身份证 汉字 长度 必填) 正则

    username (){
      6-8位  数字+字母(Aa) 必填
    }

    pwd(){
      8-12位 至少包含 大写 小写 数字 必填
    }

    组合 + 链式

    设置映射

   1.  username: "required | is_user | max_len(12) | min_len(6)"
   2.  coll.isRequired().minLength(6).maxLength(12).isUser()

  2 动态校验
*/