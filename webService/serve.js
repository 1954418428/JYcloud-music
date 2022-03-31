const express = require("express");
const history = require("connect-history-api-fallback");
const app = express();
app.use(history()); //必须在静态资源之前使用 解决history模式下 404
app.use(express.static(__dirname + "/static"));

app.get("/person", (req, res) => {
  res.send({
    name: "fzy",
    age: 18
  });
});

app.listen(8080, (err) => {
  if (!err) {
    console.log("服务器启动成功了！");
  }
});
