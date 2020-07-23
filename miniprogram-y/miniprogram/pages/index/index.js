//index.js
const app = getApp()
let can_getuserinfo = false

Page({
  data: {
    can_getuserinfo: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bcimgUrl: '../../images/10.jpg',
    router: {}
  },

  onLoad: function() {
    // if (can_getuserinfo != true){
    //   wx.navigateTo({
    //     url: '/pages/login0/login0', //这里是成功登录后跳转的页面
    // })
    // }

    wx.getStorage({
      key: 'can_getuserinfo',
      success: res => {
        console.log(res.data)
        console.log("vvvvvvvvvvvvvvvvv")
        // 不知为何下面是true，不科学
        // if (can_getuserinfo == true){
        //   wx.navigateTo({
        //     url: '/pages/login0/login0', //这里是成功登录后跳转的页面
        // })
        // }
        this.setData({          
          can_getuserinfo: res.data
        })
      },
    //   fail: function(res) {
    //     this.setData({
    //       // number: res.data
    //     })
    //   }

    })
    console.log(can_getuserinfo)
    console.log("kkkkkkkkkkkkkkkk")

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }

        // else
        // {
        //   wx.setStorage({
        //     key: 'can_getuserinfo',
        //     data: '0',
        //   })
        // }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //获取用户头像时调用的函数
  getUserImg: function (e) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo
              var avatarUrl = userInfo.avatarUrl; //获取微信用户头像存放的Url 
              wx.getImageInfo({
                src: avatarUrl,
                success: function (sres)  {       //访问存放微信用户头像的Url 
                  wx.saveImageToPhotosAlbum({   //下载用户头像并保存到相册（默认为手机相册weixin目录下）
                    filePath: sres.path,
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {

    wx.setStorageSync('userInfo', e.detail.userInfo);
    this.setData({
        userInfo:e.detail.userInfo
    })
    if (e.detail.userInfo) { 
      wx.cloud.callFunction({ 
        name: 'saveUserInfo', 
        data: { 
          userInfo: e.detail.userInfo 
        }, 
        
        success: (res) => { 
          console.log(res) 

          if (res.result && res.result._id) { 
            wx.showToast({ title: '保存成功', 
          }) 
        } 
          wx.setStorage({
            key: 'can_getuserinfo',
            data: true,
          })
          // console.log(can_getuserinfo)
          console.log("ggggggggggggggggggggg")
          wx.navigateTo({
            url: '/pages/index/index', //这里是成功登录后跳转的页面
        })


        
      }, 
        fail: (err) => { 
          wx.showToast({ 
            title: '保存失败...', 
            icon: 'none' 
          }) 
        } 
      }) 
    }
  },
  handleTapLogin() {

    let that = this 
    console.log('页面跳转')
    wx.switchTab({
      url: '/pages/tap-target/target-list/target-list'
    })

  },

})
