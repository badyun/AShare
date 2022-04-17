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


## 全新安装的话，参考下面的过程

### 更改yum源

```
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650183650101/2c896a82af7a05429ea6755185ae6948)


### 安装nodejs环境

```
yum install nodejs -y
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650183700744/5b255685fe1c663e897350fa4e0e4ce4)


### 安装pm2管理器

```
npm i pm2 -g
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650183755061/d7cb6e64633cfd755f4f319780ecf19d)


### 安装git

```
yum install git -y
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650183793737/634a083a82af129109aeccb59966c37d)


### 下载源码

```
git clone https://github.com/badyun/AShare.git
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650183942316/84e6f6ca4c16a76c72af22e43933db6a)


### 进入源码目录

```
cd AShare
```

### 安装依赖

```
npm i
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650183965497/521f9f0398a9c799caa5619d77da774d)


### 启动服务

```
pm2 start app.js --name AShare -i max
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650184004802/b51275e76cd04174a5340ca15c56625b)


### 添加进程守护和开机启动

```
pm2 save
pm2 startup
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650184023541/74a9cc43f627b75b6bb5bd1b8a7d1562)


### 查看启动日志（默认账户密码）

```
pm2 log AShare
```
![1.png](https://sf1-scmcdn-tos.pstatp.com/obj/ad-tetris-site/file/1650184041026/0e048fc02ead2bc9f157ab966ed9c49b)


### 如果要使用443或者80啥的，就自己去设置下反代吧
