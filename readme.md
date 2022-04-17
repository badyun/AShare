# AShare 
###### 一款阿里云多账户直链解析程序
###### 支持绑定多个账号，分享单加密目录，分享单目录，批量获取文件夹内容直链，获取单文件直链，在线预览等

## 交流QQ群
299791604

## 安装注意事项
如果直链作为第三方资源站的引用，需要在资源站的头部加上如下meta
```
<meta name=referrer content=never>
```


## 准备工作

1. 装了宝塔的linux服务器一台
2. 在网页上登录好你的阿里云盘账号

### 第一步-获取阿里云盘的refresh_token

```
#按下f12
#复制下面的代码，直接到控制台执行

JSON.parse(localStorage.getItem('token')).refresh_token

#出来的结果就是refresh_token
```

### 第二步-去你的宝塔新建一个站点

域名设置一个你自己的域名，php版本选择纯静态


### 第三步-到站点 /usr/local/bin 目录，上传直链程序

上传好后设置直链程序的权限

### 第四步-到你服务器的 /usr/lib/systemd/system 目录，新增启动文件

文件名为：AShare.service

文件内容如下：

```
[Unit]
Description=AShare server daemon
Documentation=no
After=no
Wants=no

[Service]
EnvironmentFile=no
ExecStart=/usr/local/bin/AShare
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/bin/kill -9 $MAINPID
KillMode=process
Restart=on-failure
RestartSec=1s

[Install]
WantedBy=multi-user.target
```

### 第五步-启动服务
登录终端后执行下面的命令可以启动服务

```
systemctl start AShare.service
```


执行下面的名称查看程序的运行端口和初始账号密码
```
systemctl status AShare.service
```

如需停止服务，则执行下面的命令
```
systemctl stop AShare.service
```

再次进入第二步添加的站点设置页，添加反向代理
代理就是就是上图看到的服务运行地址，在我这里就是
http://127.0.0.1:5201

### 第六步-打开系统，根据上面安装的账号密码登录系统，开始新增阿里云盘账号

点击新增账号，填入你第一步获取的refresh_token，点击确定即可

