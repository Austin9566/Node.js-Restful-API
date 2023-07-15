const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");

app.use(express.static("public"));

// 設定應用程式的視圖引擎為 EJS
app.set("view engine", "ejs");
// 設定視圖目錄為 /home/views，使用 Docker 建議加上這一行，否則需要進入容器內部操作，較為繁瑣。
app.set("views", "/home/views");

app.use(express.json()); // 解析 JSON 格式的請求主體
app.use(express.urlencoded({ extended: true })); // 解析 URL 編碼格式的請求主體

// 連接到 MongoDB 伺服器
// 使用 Docker 啟動的 MongoDB 可以直接輸入那個服務的名稱，如下 mongodb。
const dbURI = "mongodb://mongodb:27017/exampleDB";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("成功連接到 MongoDB");
  })
  .catch((err) => {
    console.error("無法連接到 MongoDB:", err);
  });

// 渲染首頁
app.get("/", async (req, res) => {
  res.render("index");
});

// 查詢所有學生資料
app.get("/students", async (req, res) => {
  try {
    let studentData = await Student.find().exec();
    console.log(studentData);
    return res.send(studentData);
  } catch (err) {
    return res.status(500).send("尋找資料時發生錯誤！");
  }
});

// 根據學生 ID 查詢學生資料
app.get("/students/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let searchStudentData = await Student.findOne({ _id: id }).exec();
    return res.send(searchStudentData);
  } catch (err) {
    return res.status(500).send("尋找資料時發生錯誤！");
  }
});

// 新增學生資料
app.post("/students", async (req, res) => {
  try {
    let { name, age, major, merit, other } = req.body;
    let newStudent = new Student({
      name,
      age,
      major,
      scholarship: { merit, other },
    });
    let saveStudent = await newStudent.save();
    return res.send({
      msg: "資料已新增成功！",
      saveObject: saveStudent,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// 更新學生資料
app.put("/students/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { name, age, major, merit, other } = req.body;
    let updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        name,
        age,
        major,
        scholarship: { merit, other },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.send({
      msg: "資料已更新成功！",
      updatedData: updatedStudent,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// 部分更新學生資料
app.patch("/students/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { name, age, major, merit, other } = req.body;

    let updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        name,
        age,
        major,
        "scholarship.merit": merit,
        "scholarship.other": other,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.send({ msg: "資料已更新成功！", updatedData: updatedStudent });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// 刪除學生資料
app.delete("/students/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deleteResult = await Student.deleteOne({ _id: id });
    return res.send({
      msg: "您已將這筆資料刪除！",
      deleteResult: deleteResult,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}/`);
});
