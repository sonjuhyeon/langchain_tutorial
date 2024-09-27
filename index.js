const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const { send } = require("process");
const bodyParser = require("body-parser");

// console.log(path.join(__dirname));
// /Users/sonjuhyeon/Desktop/AICC/CHAT_NODE

const app = express();
const port = 8080;
app.use(bodyParser.json());

app.post("/chat", (req, res) => {
  const sendQuestion = req.body.question;
  const execPython = path.join(__dirname, "BIZ_CHAT_LC", "bizchat.py");
  const pythonPath = path.join(__dirname, "BIZ_CHAT_LC", "bin", "python3");
  // console.log(sendQuestion, execPython, pythonPath);

  //spawn으로 파이썬 스크립트 실행
  //실행할 파일(script.py) 전달
  const net = spawn(pythonPath, [execPython, sendQuestion]);
  let output = "";

  //파이썬 파일 수행 결과를 받아온다
  net.stdout.on("data", function (data) {
    output += data.toString();
  });

  net.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({ answer: output });
    } else {
      res.status(500).send("Something went wrong");
    }
  });

  net.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.listen(port, () => {
  console.log(`server is running port: ${port}`);
});
