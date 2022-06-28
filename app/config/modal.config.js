export default {
  'login': {
    formType: 'login',
    title: '登录',
    formData: [
      {
        label: "用户名",
        query: "username",
        type: "text",
        placeholder: "用户名: 6-16位 字母数字"
      },
      {
        label: "密码",
        query: "password",
        type: "password",
        placeholder: "密码: 8-12位 最少包含一位(数字/大小写字母)"
      }
    ],
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
        isSubmit: true
      }
    ]
  },
  'register': {
    formType: 'register',
    title: '注册',
    formData: [
      {
        label: "用户名",
        query: "username",
        type: "text",
        placeholder: "用户名: 6-16位 字母数字"
      },
      {
        label: "密码",
        query: "password",
        type: "password",
        placeholder: "密码: 8-12位 最少包含一位(数字/大小写字母)"
      },
      {
        label: "邮箱",
        query: "email",
        type: "text",
        placeholder: "请输入邮箱地址"
      }
    ],
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
        isSubmit: true
      }
    ]
  },
  'postColumn': {
    formType: 'postColumn',
    title: '添加分类',
    formData: [
      {
        label: "分类名称",
        query: "name",
        type: "text",
        placeholder: "请填写分类名称"
      }
    ],
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
        isSubmit: true
      }
    ]
  },
  'info': {
    formType: 'putUserInfo',
    title: '个人信息',
    formData: [
      {
        label: "用户名",
        query: "username",
        type: "text",
        readonly: true,
        placeholder: "用户名: 6-8位 字母数字"
      },
      {
        label: "昵称",
        query: "nikname",
        type: "text",
        placeholder: "请输入昵称"
      },
      {
        label: "邮箱",
        query: "email",
        type: "text",
        placeholder: "请输入邮箱地址"
      },
      {
        label: "签名",
        query: "signature",
        type: "txt",
        placeholder: "请输入你的个性签名"
      },
      {
        label: "修改头像",
        query: "avatar",
        type: "file",
        isFile: true
      },
    ],
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
        isSubmit: true
      }
    ]
  }
}