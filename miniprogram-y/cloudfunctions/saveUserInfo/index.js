// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化的环境一定要正确，不然会调用云函数失败
cloud.init(
  {
    env:"extarget-env-t7e2r",
  }
);

//数据库连接
let db = cloud.database()
let infolength = 0;


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  console.log("eeeeeeeeeeeeee");
  console.log(event.userInfo.nickName);
  await db.collection('users').where({'userInfo.nickName':event.userInfo.nickName}).get().then(res => {
    // res.data 包含该记录的数据
    infolength = res.data.length
    console.log(infolength)
  }).catch(res=>{
    console.log(res)
  })
  console.log("cccccccccccccccccc")


  // .then(data => { 
  //   console.log(data);   
  //    })
  // 云数据库查询方法
  // hasName = Boolean(db.collection('users').where({'userInfo.nickName':event.userInfo.nickName}).get());
  // console.log(hasName);
  // console.log(hasName === false);
  // console.log(infolength)
  if (infolength === 0){
    try {
      // console.log("qqqqqqqqqqqqqqqqqqqq");
      return await db.collection('users').add({
        data: {
          created: new Date(),
          userInfo: event.userInfo,
          openid: wxContext.OPENID
        }
      }).then(res => {console.log(res)}).catch(err => {console.log(err)})

    } catch (e) {
      // console.log("qqqqqqqqqqqqqqqqqqqq");
      console.error(e)
    }
  }
  // 云函数要有返回值
  return "result"
}