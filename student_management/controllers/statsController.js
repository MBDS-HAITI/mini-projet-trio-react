let { Grade, Student, Course } = require('../model/schemas');
const User = require('../model/user');
const { AppError } = require('../middlewares/errorHandler');
const controller = {};

/**
 * GET /api/stats/admin/dashboard
 * Dashboard administrateur - Vision globale
 */
controller.getAdminDashboard = async (req, res) => {
  try {
    // Compter les entités
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalGrades = await Grade.countDocuments();
    const totalUsers = await User.countDocuments();

    // Moyenne générale de l'établissement
    const allGrades = await Grade.find().select('grade');
    const averageGrade = allGrades.length > 0
      ? allGrades.reduce((sum, g) => sum + g.grade, 0) / allGrades.length
      : 0;

    // Taux de réussite (notes >= 10)
    const passingGrades = allGrades.filter(g => g.grade >= 10).length;
    const successRate = allGrades.length > 0
      ? (passingGrades / allGrades.length) * 100
      : 0;

    // Répartition des notes par cours
    const gradesByCourse = await Grade.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: '$course',
          courseName: { $first: '$courseInfo.name' },
          courseCode: { $first: '$courseInfo.code' },
          average: { $avg: '$grade' },
          count: { $sum: 1 },
          min: { $min: '$grade' },
          max: { $max: '$grade' }
        }
      },
      { $sort: { average: -1 } }
    ]);

    // Distribution des notes par tranches
    const gradeDistribution = [
      { name: 'Excellent (16-20)', count: allGrades.filter(g => g.grade >= 16).length },
      { name: 'Bien (14-16)', count: allGrades.filter(g => g.grade >= 14 && g.grade < 16).length },
      { name: 'Assez bien (12-14)', count: allGrades.filter(g => g.grade >= 12 && g.grade < 14).length },
      { name: 'Passable (10-12)', count: allGrades.filter(g => g.grade >= 10 && g.grade < 12).length },
      { name: 'Insuffisant (<10)', count: allGrades.filter(g => g.grade < 10).length }
    ];

    // Étudiants en difficulté (moyenne < 10)
    const studentsWithAverage = await Grade.aggregate([
      {
        $group: {
          _id: '$student',
          average: { $avg: '$grade' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $project: {
          _id: 1,
          name: {
            $concat: ['$studentInfo.firstName', ' ', '$studentInfo.lastName']
          },
          average: 1,
          count: 1
        }
      },
      { $match: { average: { $lt: 10 } } },
      { $sort: { average: 1 } }
    ]);

    // Top 5 meilleurs étudiants
    const topStudents = await Grade.aggregate([
      {
        $group: {
          _id: '$student',
          average: { $avg: '$grade' }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $project: {
          name: {
            $concat: ['$studentInfo.firstName', ' ', '$studentInfo.lastName']
          },
          average: 1
        }
      },
      { $sort: { average: -1 } },
      { $limit: 5 }
    ]);

    // Évolution des inscriptions (simulation - ajuster selon vos besoins)
    const enrollmentTrend = await Student.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          students: { $sum: 1 }
        }
      },
      {
        $project: {
          month: '$_id',
          students: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } },
      { $limit: 12 }
    ]);

    res.json({
      totalStudents,
      totalCourses,
      totalGrades,
      totalUsers,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      studentsInDifficulty: studentsWithAverage.length,
      gradesByCourse,
      gradeDistribution,
      topStudents,
      enrollmentTrend: enrollmentTrend.length > 0 ? enrollmentTrend : [
        { month: '2024-01', students: 0 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/stats/scolarite/dashboard
 * Dashboard scolarité - Focus étudiants/cours/notes
 */
controller.getScolariteDashboard = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalGrades = await Grade.countDocuments();

    // Moyenne par cours
    const averageByCourse = await Grade.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: '$course',
          courseName: { $first: '$courseInfo.name' },
          courseCode: { $first: '$courseInfo.code' },
          average: { $avg: '$grade' },
          count: { $sum: 1 }
        }
      },
      { $sort: { average: -1 } }
    ]);

    // Étudiants à risque (moyenne < 10)
    const studentsAtRisk = await Grade.aggregate([
      {
        $group: {
          _id: '$student',
          average: { $avg: '$grade' }
        }
      },
      { $match: { average: { $lt: 10 } } },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $project: {
          id: '$_id',
          name: {
            $concat: ['$studentInfo.firstName', ' ', '$studentInfo.lastName']
          },
          email: '$studentInfo.email',
          average: 1
        }
      },
      { $sort: { average: 1 } },
      { $limit: 10 }
    ]);

    // Cours avec le plus/moins d'étudiants
    const coursesByStudents = await Course.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'courses',
          as: 'enrolledStudents'
        }
      },
      {
        $project: {
          name: 1,
          code: 1,
          studentCount: { $size: '$enrolledStudents' }
        }
      },
      { $sort: { studentCount: -1 } }
    ]);

    res.json({
      totalStudents,
      totalCourses,
      totalGrades,
      averageByCourse,
      studentsAtRisk,
      coursesByStudents
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stats/student/dashboard
 * Dashboard étudiant - Son dossier uniquement
 */
controller.getStudentDashboard = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      throw new AppError("Non authentifié", 401);
    }
    const student = await Student.findOne({ user: req.session.userId });
    if (!student) {
      throw new AppError("Aucun profil étudiant lié à ce compte", 404);
    }
    const studentId = student._id;

    const grades = await Grade.find({ student: studentId })
      .populate('course', 'name code')
      .sort({ date: -1 });

    const averageGrade = grades.length > 0
      ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
      : 0;

    const bestGrade = grades.length > 0
      ? Math.max(...grades.map(g => g.grade))
      : 0;

    const worstGrade = grades.length > 0
      ? Math.min(...grades.map(g => g.grade))
      : 0;

    const bestGrades = [...grades]
      .sort((a, b) => b.grade - a.grade)
      .slice(0, 3)
      .map(g => ({
        courseName: g.course?.name,
        grade: g.grade,
        date: g.date
      }));

    const worstGrades = [...grades]
      .sort((a, b) => a.grade - b.grade)
      .slice(0, 3)
      .map(g => ({
        courseName: g.course?.name,
        grade: g.grade,
        date: g.date
      }));

    const gradesByCourse = await Grade.aggregate([
      { $match: { student: student._id } },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: '$course',
          courseName: { $first: '$courseInfo.name' },
          myAverage: { $avg: '$grade' },
          count: { $sum: 1 }
        }
      }
    ]);

    const classAveragesByCourse = await Grade.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: '$course',
          courseName: { $first: '$courseInfo.name' },
          classAverage: { $avg: '$grade' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentNumber: student.studentNumber
      },
      stats: {
        totalGrades: grades.length,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        bestGrade,
        worstGrade
      },
      grades: grades.map(g => ({
        id: g._id,
        course: g.course?.name,
        code: g.course?.code,
        grade: g.grade,
        date: g.date
      })),
      bestGrades,
      worstGrades,
      myAveragesByCourse: gradesByCourse,
      classAveragesByCourse
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stats/student/:id
 * Statistiques détaillées d'un étudiant (ADMIN + SCOLARITE)
 */
controller.getStudentStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate('courses', 'name code');

    if (!student) {
      throw new AppError("Étudiant introuvable", 404);
    }

    const grades = await Grade.find({ student: id })
      .populate('course', 'name code')
      .sort({ date: -1 });

    const averageGrade = grades.length > 0
      ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
      : 0;

    // 📊 Moyenne par cours
    const gradesByCourse = await Grade.aggregate([
      { $match: { student: student._id } },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: '$course',
          courseName: { $first: '$courseInfo.name' },
          courseCode: { $first: '$courseInfo.code' },
          average: { $avg: '$grade' },
          count: { $sum: 1 },
          min: { $min: '$grade' },
          max: { $max: '$grade' }
        }
      },
      { $sort: { average: -1 } }
    ]);

    res.json({
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      },
      totalGrades: grades.length,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      enrolledCourses: student.courses?.length || 0,
      gradesByCourse,
      recentGrades: grades.slice(0, 5)
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stats/course/:id
 * Statistiques d'un cours (ADMIN + SCOLARITE)
 */
controller.getCourseStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate('students', 'firstName lastName email');

    if (!course) {
      throw new AppError("Cours introuvable", 404);
    }

    const grades = await Grade.find({ course: id })
      .populate('student', 'firstName lastName email')
      .sort({ grade: -1 });

    const averageGrade = grades.length > 0
      ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
      : 0;

    const bestGrade = grades.length > 0 ? grades[0].grade : 0;
    const worstGrade = grades.length > 0 ? grades[grades.length - 1].grade : 0;

    // 📊 Distribution des notes
    const distribution = {
      excellent: grades.filter(g => g.grade >= 16).length,
      bien: grades.filter(g => g.grade >= 14 && g.grade < 16).length,
      assezBien: grades.filter(g => g.grade >= 12 && g.grade < 14).length,
      passable: grades.filter(g => g.grade >= 10 && g.grade < 12).length,
      insuffisant: grades.filter(g => g.grade < 10).length
    };

    res.json({
      course: {
        _id: course._id,
        name: course.name,
        code: course.code,
      },
      totalStudents: course.students?.length || 0,
      totalGrades: grades.length,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      bestGrade,
      worstGrade,
      distribution,
      topStudents: grades.slice(0, 5).map(g => ({
        name: g.student
          ? `${g.student.firstName} ${g.student.lastName}`
          : 'Inconnu',
        grade: g.grade
      }))
    });

  } catch (error) {
    next(error);
  }
};

module.exports = controller;
