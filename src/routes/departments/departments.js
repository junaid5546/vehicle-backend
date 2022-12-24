const router = require("express").Router();
const departments = require("../../model/departments/departments");

//CREATE DEPARTMENT
router.post("/departments", async (req, res) => {
  try {
    const newdepartment = new departments({
      nameEn: req.body.nameEn,
      nameAr: req.body.nameAr,
    });
    const savedepartment = await newdepartment.save();
    res.status(200).json({
      code: 200,
      message: "Successfully created",
      result: savedepartment,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

//GET ALL DEPARTMENTS
router.get("/departments", async (req, res) => {
  try {
    const getall_departments = await departments.find();
    res.status(400).json({
      code: 200,
      message: "record founded",
      result: getall_departments,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

module.exports = router;
