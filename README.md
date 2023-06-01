# emotic-server

用nodejs构建

## 启动步骤
- 1、配置node环境
- 2、安装mongodb进入mongodb文件夹下的终端输入mongod启动数据库
- 3、新建数据库名为emotic
- 4、在此项目文件夹下输入指令
```sh
npm install
npm start
```

## 接口列表
***
### 登录

|  接口  | 说明 |
|------ |----- |
|[/user/getMenu](#login)| 登录接口|

### 未审核表情包接口
|  接口  | 说明 |
|------ |----- |
|[/index/getMenu](#read)| 查询未审核接口|
|[/index/create](#create) | 上传表情包接口|
|[/index/edit](#login) | 审核或者编辑未审核表情包接口|
|[/index/del](#del) | 删除未审核表情包接口|

### 过审表情包接口
|  接口  | 说明 |
|------ |----- |
|[/emotic/getOneEmo](#getOneEmo)| <font color=red>随机获得单个表情</font>|
|[/emotic/readEmotic](#readEmotic)| 查询过审表情包|
|[/emotic/editEmotic](#editEmotic) | 编辑过审表情包接口|
|[/emotic/delEmotic](#delEmotic) | 删除过审表情包接口|
***

## 错误码列表
|  错误码  | 说明 |
|------ |----- |
|   200   | 正确 |
|   404   | 未找到接口 |
|   500   | 错误|
|   304   | 获取表成功|

## 接口详情

***

* <span id = "login">登录接口</span>
  * 接口地址：/user/getMenu
  * 返回格式：Json
  * 请求方式：Post
  * 请求示例：http://www.baidu/user/getMenu
  * 接口备注：采用MD5加密登录将返回token和路由
  * 请求参数说明：

    | 名称 | 类型 | 必填 |说明|
              |----- |------| ---- |----|
    |password | string |true|用户名|
    |username | string |true|用户密码|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |data | object|菜单|
    |token | string|token|

  * JSON返回示例： {"code":200,"data":{"
    menu":[{"path":"/admin","name":"admin","label":"表情管理","icon":"picture","url":"Admin.vue"},{"path":"/emotic","name":"emotic","label":"表情管理(已审核)","icon":"picture","url":"Emotic.vue"}]
    ,"token":"5i6T130VG","message":"获取成功"}}

***
* <span id = "read">查询未审核接口</span>
  * 接口地址：/index/read
  * 返回格式：Json
  * 请求方式：Get
  * 请求示例：http://www.baidu.com/index/read?name=&sortname=&sortorder=&page=1&limit=7
  * 接口备注：获得列表和查询
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
      |----- |------| ---- |----|
  |name | string |false|词条|
  |sortname | string |false|排序名|
  |sortorder | string |false|升降序|
  |page | string |false|第几页|
  |limit | string |true|每页最大行数|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |count | string|未审核总行数|
    |list | object|这一页查询到的表|

  * JSON返回示例： 数据太大就不展示了


* <span id = "create">上传表情包接口</span>
  * 接口地址：/index/create
  * 返回格式：Json
  * 请求方式：Post
  * 请求示例：http://www.baidu.com/index/creat
  * 接口备注：用户上传表情包
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
    |----- |------| ---- |----|
  |fileList | array |true|图链|
  |other | string |false|上传者|
  |tags | array |true|词条|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |code | Int|状态码|

  * JSON返回示例： {"code":200,"data":{"message":"添加成功"}}


* <span id = "edit">审核或者编辑未审核表情包接口</span>
  * 接口地址：/index/edit
  * 返回格式：Json
  * 请求方式：Post
  * 请求示例：http://www.baidu.com/index/edit
  * 接口备注：管理人员对未审核表情包进行审核或者编辑
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
      |----- |------| ---- |----|
  |audit | string |true|是否审核|
  |fileList | array |true|图链|
  |id | string |true|编号id|
  |other | string |false|上传者|
  |tags | array |true|词条|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |code | Int|状态码|

  * JSON返回示例： {"code":200,"data":{"message":"修改成功"}}


* <span id = "del">删除未审核表情包接口</span>
  * 接口地址：/index/del
  * 返回格式：Json
  * 请求方式：Post
  * 请求示例：http://www.baidu.com/index/del
  * 接口备注：管理人员对未审核表情包进行删除
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
       |----- |------| ---- |----|
  |id | string |true|编号id|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |code | Int|状态码|

  * JSON返回示例： {"code":200,"message":"删除成功"}
***
* <span id="readEmotic"><font color='red'>查询过审表情包</font></span>
  * 接口地址：/emotic/readEmotic
  * 返回格式：Json
  * 请求方式：Get
  * 请求示例：http://www.baidu.com/emotic/readEmotic?name=&sortname=&sortorder=&page=1&limit=7
  * 接口备注：已审查的表情包供emotic平台用户端调用或后台人员查看
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
    |----- |------| ---- |----|
  |name | array |false|词条|
  |sortname | string |false|排序名|
  |sortorder | string |false|升降序|
  |page | string |false|第几页|
  |limit | string |false|每页最大行数|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |count | string|已审核总行数|
    |list | object|这一页查询到的表|

  * JSON返回示例： 数据太大就不展示了


* <span id = "editEmotic">编辑过审表情包接口</span>
  * 接口地址：/emotic/editEmotic
  * 返回格式：Json
  * 请求方式：Post
  * 请求示例：http://www.baidu.com/emotic/editEmotic
  * 接口备注：管理人员对过审表情包进行编辑
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
       |----- |------| ---- |----|
  |audit | string |true|是否审核|
  |fileList | array |true|图链|
  |id | string |true|编号id|
  |other | string |false|上传者|
  |tags | array |true|词条|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |code | Int|状态码|

  * JSON返回示例： {"code":200,"data":{"message":"修改成功"}}


* <span id = "delEmotic">删除审核表情包接口</span>
  * 接口地址：/emotic/delEmotic
  * 返回格式：Json
  * 请求方式：Post
  * 请求示例：http://www.baidu.com/emotic/delEmotic
  * 接口备注：管理人员对过审表情包进行删除
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
      |----- |------| ---- |----|
  |id | string |true|编号id|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |------|----|
    |code | Int|状态码|

  * JSON返回示例： {"code":200,"message":"删除成功"}
***
* <span id="readEmotic"><font color='red'>随机获得单个表情</font></span>
  * 接口地址：/emotic/getOneEmo
  * 返回格式：Json
  * 请求方式：Get
  * 请求示例：http://www.baidu.com//emotic/getOneEmo?name=
  * 接口备注：使用此接口将根据tag随机获取表情包里的一个表情，近似词gpt调用失败或者没找到就用“万能表情”
  * 请求参数说明：

  | 名称 | 类型 | 必填 |说明|
      |----- |------| ---- |----|
  |name  | array |false|词条|

  * 返回参数说明：

    | 名称 | 类型 |说明|
              |----- |-------|----|
    |data  | string|base64图片|

  * JSON返回示例： 数据太大就不展示了，就是返回一张base64图片
