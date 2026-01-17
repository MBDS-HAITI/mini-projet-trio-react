let { Grade, Student, Course } = require('../model/schemas');
const { AppError } = require('../middlewares/errorHandler');
const controller = {};

// =====================
// Tous les étudiants
// =====================
controller.getAll = async (req, res, next) => {
  try {
    const students = await Student.find().populate('courses', 'name code');
    res.json(students);
  } catch (error) {
    next(error);
  }
};

// =====================
// Créer étudiant
// =====================
controller.create = async (req, res, next) => {
  try {
    const student = new Student({
      ...req.body,
      courses: [] // ✅ init
    });
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    next(error);
  }
};

// =====================
// Modifier étudiant
// =====================
controller.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('courses', 'name code');

    if (!updatedStudent) {
      throw new AppError('Étudiant introuvable', 404);
    }

    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

// =====================
// Supprimer étudiant
// =====================
controller.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
     //  Charger l'étudiant AVANT toute vérification
    const student = await Student.findById(id);
    // ❌ lié à un user ?
    if (student.user) {
      throw new AppError(
        "Impossible de supprimer : cet étudiant possède un compte utilisateur actif.",
        400
      );
    }
    // ❌ S'il est inscrit à des cours
    if (student.courses && student.courses.length > 0) {
      throw new AppError(
        "Impossible de supprimer : l'étudiant est inscrit à des cours.",
        400
      );
    }
    const gradesCount = await Grade.countDocuments({ student: id });
    if (gradesCount > 0) {
      throw new AppError(
        `Impossible de supprimer : ${gradesCount} note(s) existent.`,
        400
      );
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Étudiant introuvable' });
    }

    res.json({ message: 'Étudiant supprimé avec succès', student: deletedStudent });
  } catch (error) {
    next(error);
  }
};

// =====================
// Détails étudiant
// =====================
controller.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id)
      .populate('courses', 'name code');

    if (!student) {
     throw new AppError('Étudiant introuvable', 404);
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
};

// =====================
// Profil étudiant connecté
// =====================
controller.getMyProfile = async (req, res, next) => {
  try {
    // ✅ Vérifier l'authentification via la session
    if (!req.session || !req.session.userId) {
      throw new AppError("Non authentifié", 401);
    }

    const userId = req.session.userId;

    // ✅ Trouver l'étudiant lié à ce user
    const student = await Student.findOne({ user: userId })
      .populate('courses', 'name code');

    if (!student) {
       throw new AppError("Aucun profil étudiant lié à ce compte", 404);
    }

    // ✅ Récupérer les notes de cet étudiant
    const grades = await Grade.find({ student: student._id });

    const stats = {
      totalGrades: grades.length,
      averageGrade: grades.length > 0
        ? (grades.reduce((s, g) => s + g.grade, 0) / grades.length).toFixed(2)
        : 0,
      totalCourses: student.courses.length
    };

    // ✅ Réponse finale
    res.json({ ...student.toObject(), stats });

  } catch (error) {
    console.error("❌ getMyProfile error:", error);
     next(error);
  }
};


// =====================
// Inscrire à un cours
// =====================
controller.enrollInCourse = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) throw new AppError('Étudiant introuvable', 404);

    const course = await Course.findById(courseId);
    if (!course) throw new AppError('Cours introuvable', 404);

    const already = student.courses.some(c => c.toString() === courseId);
    if (already) {
       throw new AppError('Étudiant déjà inscrit à ce cours', 400);
    }

    student.courses.push(courseId);
    await student.save();

    res.json({
      message: 'Étudiant inscrit au cours avec succès',
      student: await Student.findById(studentId).populate('courses', 'name code')
    });
  } catch (error) {
   next(error);
  }
};

// =====================
// Désinscrire d’un cours
// =====================
controller.unenrollFromCourse = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) throw new AppError('Étudiant introuvable', 404);

    const gradesCount = await Grade.countDocuments({
      student: studentId,
      course: courseId
    });

    if (gradesCount > 0) {
       throw new AppError(
        `Impossible : ${gradesCount} note(s) existent pour ce cours.`,
        400
      );
    }

    student.courses = student.courses.filter(
      c => c.toString() !== courseId
    );
    await student.save();

    res.json({
      message: 'Étudiant désinscrit du cours avec succès',
      student: await Student.findById(studentId).populate('courses', 'name code')
    });
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
