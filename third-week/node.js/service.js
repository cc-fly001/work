

// const express = require("express");
// const app = express();

// app.use(express.json());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,POsT,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// })

// app.post("/api", (req, res) => {
//   const requestBody = req.body;
//   console.log("接收到的请求体:", requestBody);
//   res.json({ status: "success", data: requestBody });
// });

// app.listen(3000, () => console.log("后端运行在http://localhost:3000"));





// const express = require("express");
// const multer = require("multer");
// const app = express();

// // 配置 multer，用于处理文件上传
// const upload = multer({ dest: "uploads/" }); // 文件将存储在 uploads 文件夹中

// // 允许跨域
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// // 处理表单提交的路由
// app.post("/api", upload.single("file"), (req, res) => {
//   const query = req.body.query; // 获取表单中的文本内容
//   const model = JSON.parse(req.body.model); // 获取模型数据
//   const file = req.file || null; // 获取上传的文件信息

//   console.log("content:", query);
//   console.log("modelList:", model);
//   console.log("接收到的文件信息:", file);

//   res.json({
//     status: "success",
//     message: "数据接收成功",
//     data: {
//       query,
//       model,
//       file,
//     },
//   });
// });

// // 启动服务器
// app.listen(3000, () => {
//   console.log("服务器运行在 http://localhost:3000");
// });


const express = require("express");
const app = express();

// 允许跨域
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 解析 JSON 请求体
app.use(express.json({ limit: "10mb" })); // 增加请求体大小限制以支持 Base64 图片

// 处理表单提交的路由
app.post("/api", (req, res) => {
  const { content, image, modelList } = req.body;
  console.log("IMG(base64):", image ? image.substring(0, 100) + "..." : "无图片");
  console.log("content:", content);
  console.log("modelList:", JSON.stringify(modelList, null, 2));

  res.json({
    status: "success",
    message: "数据接收成功",
    data: {
      content,
      image,
      modelList,
    },
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000");
});
