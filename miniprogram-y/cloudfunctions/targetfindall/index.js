// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 从云数据库获取数据
  if (event){
    try {
      return await db.collection('targets').get()
      .then(res => {console.log(res.data)}).catch(err => {console.log(err)})

    } catch (e) {
      // console.log("qqqqqqqqqqqqqqqqqqqq");
      console.error(e)
    }
  }
  // 云函数要有返回值
  // 返回是否成功状态
  return {
    status: "ok"
  }
}


// 数据格式
// data: {
//   content: that.data.content,
//   deadline: that.data.deadline + " 00:00:00",
//   reward: that.data.reward,
//   punishment: that.data.punishment
// }