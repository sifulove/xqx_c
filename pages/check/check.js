// pages/check/check.js
var app = getApp();
var appData = app.globalData;


Page({

  /**
   * 页面的初始数据
   */
  data: {
  obj:{},
  info:{},
  money:0,
  resultMoney:0,
  ratio:0,
  isChoose:"nor"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
  
    if (options.q){
      console.log(options.q);
      // http%3A%2F%2Fmini.xqx.com%2Fapp_person%2F%3FmerchantId%3D10099
      var res = options.q.split("%2Fapp_person%2F%3FmerchantId%3D")[1];
      console.log(res);
      this.loadInfo(res);
    }
    this.loadInfo(options.id);
    
  },
  choose:function(){
    
  },
  inputMoney:function(e){

    if (this.data.info.discountMode=="MR"){
        this.setData({
          money: e.detail.value,
          resultMoney: this.data.info.rebate == 0 ? e.detail.value:e.detail.value * parseInt(this.data.info.rebate) 
        });
      
    }
    if (this.data.info.discountMode == "MD") {
      console.log(this.data.info.mInfo);
      var self = this;
      
      var result = e.detail.value;
      self.setData({
        money: parseFloat(e.detail.value),
        resultMoney: result
      });
      this.data.info.mInfo.forEach(function(item){
        
        if (parseFloat(e.detail.value) >= parseFloat(item.full / 100)) {
         
          result = result > parseFloat(e.detail.value) - parseFloat(item.subtract / 100) || result == 0 ? parseFloat(e.detail.value) - parseFloat(item.subtract / 100) : result;
          
          self.setData({
            money: parseFloat(e.detail.value),
            resultMoney: result
          });
          
        } 
      });
    }
    if (this.data.info.discountMode == 'undefined' || this.data.info.discountMode == 'null' || !this.data.info.discountMode){
      this.setData({
        money: parseFloat(e.detail.value),
        resultMoney: parseFloat(e.detail.value) //减去 减满
      });
      console.log(this.data.resultMoney);
    }

    console.log(this.data.resultMoney);
  },
  //
  inputFinish:function(e){
    var self = this;
    if (self.data.money == 0 || self.data.money >= 99999.99) {
      wx.showToast({
        title: "请输入0.01-99999.99的金额",
        icon: 'none',
        duration: 2000
      })
    }
  },
  qrmdTap: function () {

    var self = this;

    /**
     * money	String	是	实际支付金额
session	String	是	session
token	String	是	token
merchantId	String	是	商户id
origionPrice	String	是	原始价格
discountId	String	是	折扣id 打折id 满减此项为空
discounInfo	String	是	折扣信息 打折为 打折具体数值 满减为商户详情mInfo
     */
    if (self.data.money == 0 || self.data.money >= 99999.99){
      wx.showToast({
        title: "请输入0.01-99999.99的金额",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    appData.Tool.getToLocation("session").then(function (session){
      console.log(session, self.data.info);
      console.log();
      // appData.Tool.getToLocation("").then(function () {
      appData.Tool.createPay({ merchantName: self.data.info.name, money: self.data.money * 100 + "", session: session, token: "", origionPrice: this.data.money*100, merchantId: self.data.info.id, ratio: self.data.info.ratio ? self.data.info.ratio:"0" }).then(function (result) {
        wx.hideLoading()
          console.log(result);

        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': 'MD5',
          'paySign': result.paySign,
          'success': function (res) {
            console.log(res);
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })

            self.setData({
              info: result.data,
            });
            wx.navigateTo({
              url: '../PaymentSuccess/PaymentSuccess?money=' + self.data.money,
            })
          },
          'fail': function (res) {
            console.log(res);
            wx.showToast({
              title: '失败',
              icon: 'none',
              duration: 2000
            })
          }
        })

          

        }).catch(function (error) {
            console.log(error);
          });
      })
    // })
    
  },
loadInfo:function(id){
  var self = this;
  appData.Tool.getMerchantDiscountInfo({ cnd:id}).then(function (result) {
      wx.hideLoading()
      
      self.setData({
        info: result.data,
        ratio: result.data.ratio
      });
    console.log(self.data.info);
    }).catch(function (error) {
      console.log(error);
    });
  
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})