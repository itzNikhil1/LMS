const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   GET /api/students
// @desc    Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/students
// @desc    Add a new student
router.post('/', async (req, res) => {
  const { studentId, name, email, phone, course, year } = req.body;

  try {
    let student = await Student.findOne({ studentId });
    if (student) {
      return res.status(400).json({ message: 'Student with this ID already exists' });
    }

    student = new Student({
      studentId, name, email, phone, course, year
    });

    await student.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student
router.put('/:id', async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
