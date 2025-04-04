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
