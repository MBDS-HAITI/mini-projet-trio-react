let { Course, Grade, Student } = require('../model/schemas');
const { AppError } = require('../middlewares/errorHandler');
const controller = {};

// ==============================
// GET /api/courses
// ==============================
controller.getAll = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Erreur getAll courses:", error);
    next(error);
  }
};

// ==============================
// POST /api/courses
// ==============================
controller.create = async (req, res, next) => {
  try {
    const course = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
};

// ==============================
// PUT /api/courses/:id
// ==============================
controller.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      throw new AppError("Cours introuvable", 404);
    }

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// ==============================
// DELETE /api/courses/:id
// ==============================
controller.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ❌ Vérifier s'il y a des étudiants inscrits
    const studentsCount = await Student.countDocuments({ courses: id });
    if (studentsCount > 0) {
      throw new AppError(
        `Impossible de supprimer : ${studentsCount} étudiant(s) sont inscrits à ce cours`,
        400
      );
    }

    const gradesCount = await Grade.countDocuments({ course: id });
    if (gradesCount > 0) {
      throw new AppError(
        `Impossible de supprimer : ${gradesCount} note(s) existent pour ce cours`,
        400
      );
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      throw new AppError("Cours introuvable", 404);
    }

    res.json({ message: 'Cours supprimé avec succès', course: deletedCourse });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET /api/courses/me
// ==============================
controller.getMyCourses = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      throw new AppError("Non authentifié", 401);
    }
    const student = await Student.findOne({ user: userId });
    if (!student) {
      throw new AppError("Profil étudiant introuvable", 404);
    }

    // On récupère les cours via les notes
    const grades = await Grade.find({ student: student._id })
      .populate('course', 'name code');

    const courses = grades.map(g => g.course);

    // Supprimer doublons
    const uniqueCourses = Array.from(
      new Map(courses.map(c => [c._id.toString(), c])).values()
    );

    res.json(uniqueCourses);
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET /api/courses/:id
// ==============================
controller.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      throw new AppError("Cours introuvable", 404);
    }

    const grades = await Grade.find({ course: id });
    const stats = {
      totalGrades: grades.length,
      averageGrade: grades.length > 0
        ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
        : 0
    };

    res.json({ ...course.toObject(), stats });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET /api/courses/:id/students
// ==============================
controller.getEnrolledStudents = async (req, res, next) => {
  try {
    const { id } = req.params;

    const grades = await Grade.find({ course: id }).populate(
      'student',
      'firstName lastName email studentNumber'
    );

    const students = grades.map(g => g.student);

    res.json({
      courseId: id,
      students,
      totalStudents: students.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
