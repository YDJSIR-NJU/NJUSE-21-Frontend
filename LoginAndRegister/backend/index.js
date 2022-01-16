// 引入部分
const mysql = require("mysql");
const express = require("express");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
var rand = require("csprng");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const svgCaptcha = require("svg-captcha");
const { fail } = require("assert");
// 全局变量区
const PORT = 3001;
const DEBUG = true;
const duplicated_username = "USERNAME_OCCUPIED";
const invalid_token = "INVALID_USERNAME_OR_TOKEN";
const invalid_captcha = "INVALID_CAPTCHA";

/**=================================================
 *  数据库连接部分
 ==================================================*/
// 数据库配置
// 该数据库运行在docker中
const con = mysql.createConnection({
  host: "", // TODO 
  user: "root",
  password: "", // TODO
  port: 3306,
  database: "user_info",
});

// 定义一个执行 sql 语句的函数 并且返回一个 promise 对象
const exec = (sql) => {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      resolve(result);
    });
  });
  return promise;
};
// 连接数据库
con.connect();

/**=================================================
 *  后端部分
 ==================================================*/

// 解析 Token 密匙，属于机密
const SECRET = ""; // TODO
// 创建使用express框架的服务器
const app = express();

// 解析 post 请求体
app.use(
  session({
    secret: SECRET,
    resave: false,
    cookie: {
      domain: "localhost:" + PORT,
      maxAge: 600000,
    },
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(bodyParser.json({ limit: "1mb" })); //body-parser 解析json格式数据
app.use(
  bodyParser.urlencoded({
    extended: true, //此项必须在 bodyParser.json 下面,为参数编码
  })
);

// 解决跨域问题
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.listen(PORT, () => {
  console.log("\nServer Started, listening port " + PORT + ".\n");
});

app.get("/getcaptcha", (req, res) => {
  const captcha = svgCaptcha.create({
    noise: 3, // 干扰线条的数量
    background: "#50ff33", // 背景颜色
    width: "100",
    height: "40",
  });
  // 将图片的验证码存入到 session 中
  req.session.img_code = captcha.text.toLocaleUpperCase(); // 将验证码转换为大写
  res.type("html");
  res.send(String(captcha.data));
  res.status(200);
});

/**
 * 注册接口
 */
app.post("/register", (req, res) => {
  console.log("\n===>Processing Register Request<===");
  const { username, oripasswd,  email, captcha } = req.body;
  console.log(req.session.img_code);
  console.log("Client Captcha: " + captcha);
  if (captcha.toLocaleUpperCase() != req.session.img_code) {
    console.log("ERROR: captcha wrong!");
    res.send({ RESULT: invalid_captcha });
    return;
  }
  // 用户名不能重复
  const sql0 = `select * from base_info where username='${username}'`;
  try {
    exec(sql0).then((result) => {
      const user = result[0];
      // 如果查询不到用户
      if (user) {
        console.log(user);
        console.log("ERROR: username occupied!");
        res.send({ RESULT: duplicated_username });
        return;
      }
      // 密码需要进行加密
      const salt = rand(128, 28);
      const password = bcrypt.hashSync(salt + oripasswd, 10);
      const sql = `insert into base_info (username, email, hash, passwd, uid) values ('${username}', '${email}', '${salt}', '${password}', NULL)`; // uid会自动编号
      exec(sql).then((result) => {
        console.log(result);
        return;
      });
      res.send({ RESULT: "SUCCESS" });
    });
  } catch {}
});

/**
 * 登录接口
 */
app.post("/login", (req, res) => {
  console.log("\n===>Processing Login Request<===");
  // 从请求中获取请求体
  const { username, password, captcha } = req.body;
  console.log(req.session.img_code);
  console.log("Client Captcha: " + captcha);
  if (captcha.toLocaleUpperCase() != req.session.img_code) {
    console.log("ERROR: captcha wrong!");
    res.send({ RESULT: invalid_captcha });
    return;
  }
  const sql = `select * from base_info where username='${username}'`;
  try {
    exec(sql).then((result) => {
      const user = result[0];

      // 如果查询不到用户
      if (!user) {
        console.log("ERROR: user not registered!");
        res.send({ RESULT: invalid_token });
        return;
      }
      // 判断用户输入的密码和数据库存储的是否对应 返回 true 或者 false
      console.log(user);
      const salt = user.hash;
      const isPasswordValid = bcrypt.compareSync(salt + password, user.passwd);
      if (!isPasswordValid) {
        console.log("ERROR: password wrong!");
        res.send({ RESULT: invalid_token });
        return;
      }
      // 生成 token 将用户的唯一标识 id 作为第一个参数
      // SECRET 作为取得用户 id 密匙
      console.log(user.uid);
      const token = jwt.sign({ uid: user.uid }, SECRET);
      console.log(token);
      req.session.userTokenWord = token;
      user.passwd = "";
      user.hash = "";
      // 如果都通过了 则返回user对象 和 token
      // 返回的 token 存储在客户端 以便后续发起请求需要在请求头里设置
      res.send({ RESULT: "SUCCESS", user, token });
    });
  } catch {}
});

/**
 * 需要鉴权的访问
 */
app.get("/profile", (req, res) => {
  console.log("\n===>Processing Profile Request<===");
  // 从请求头里取出 token
  console.log("req.headers.authorization " + req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  // token 验证取得 用户 id
  const { uid } = jwt.verify(token, SECRET);
  console.log(uid);
  // 查询用户
  try {
    const sql = `select * from base_info where uid='${uid}'`;
    exec(sql).then((result) => {
      console.log(result);
      const user = result[0];
      if (user) {
        user.passwd = "";
        user.hash = "";
        // 返回用户信息
        res.send(user);
      } else {
        res.send({ RESULT: invalid_token });
      }
    });
  } catch {}
});
