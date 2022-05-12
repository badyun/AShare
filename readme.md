# AShare 
###### 一款阿里云多账户直链解析程序
###### 支持绑定多个账号，分享单加密目录，分享单目录，批量获取文件夹内容直链，获取单文件直链，在线预览等

## 交流QQ群
299791604

## 安装注意事项
如果直链作为第三方资源站的引用，需要在资源站的头部加上如下meta
```
<meta name="referrer" content="never">
```

## 全新安装的话，参考下面的过程

### 获取阿里云盘的refresh_token，这里需要用移动端的token

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

```
代理就是就是上图看到的服务运行地址，在我这里就是
http://127.0.0.1:5201
```

### 最后打开系统，根据上面日志里的账号密码登录系统，开始新增阿里云盘账号

点击新增账号，填入你第一步获取的refresh_token，点击确定即可
