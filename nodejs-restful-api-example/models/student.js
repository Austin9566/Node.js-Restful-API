const { application } = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

// 建立學生資料的 Mongoose Schema（模式）
const studentSchema = new Schema({
  name: {
    type: String,
    required: true, // 必填欄位，不可為空
    minlength: 2, // 最小長度為2個字元
  },
  age: {
    type: Number,
    max: [80, "可能有點太老了！"], // 最大值為80，超過時顯示自訂錯誤訊息 "可能有點太老了！"
    min: [0, "年齡不能小於0！"],
    default: 18, // 設定預設值為 18
  },
  major: {
    type: String,
    required: true, // 必填欄位，不可為空
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "學生merit scholarship太多了！"],
      default: 0,
    },
    other: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
