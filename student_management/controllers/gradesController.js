let { Grade, Student, Course } = require('../model/schemas');
const { AppError } = require('../middlewares/errorHandler');

const controller = {};
const parseDateUTC = (dateStr) => {
  if (!dateStr) return new Date();
  return new Date(dateStr + "T12:00:00.000Z");
};

// Existants (à garder)
controller.getAll = async (req, res, next) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'name code')
      .sort({ date: -1 }); // Plus récentes en premier

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

controller.getMyGrades = async (req, res) => {
  try {
    const userId = req.session.userId; // depuis la session
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: "Étudiant introuvable pour cet utilisateur" });
    }

    const grades = await Grade.find({ student: student._id })
      .populate('course', 'name code')
      .sort({ date: -1 });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

controller.create = async (req, res, next) => {
  try {
    const { student, course, grade, date } = req.body;

    // 🔎 Vérifier étudiant
    const studentDoc = await Student.findById(student);
    if (!studentDoc) {
      throw new AppError("Étudiant introuvable", 404);
    }

    // 🔎 Vérifier cours
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      throw new AppError("Cours introuvable", 404);
    }

    // ✅ Vérifier que l'étudiant est inscrit au cours
    const isEnrolled = studentDoc.courses?.some(
      c => c.toString() === course
    );

    if (!isEnrolled) {
      throw new AppError("❌ L'étudiant n'est pas inscrit à ce cours", 400);
    }

    // 🔢 Vérifier note
    if (grade < 0 || grade > 20) {
      throw new AppError("La note doit être entre 0 et 20", 400);
    }

    // 📅 Parser la date
    const parsedDate = parseDateUTC(date);
    if (date && new Date(date) > new Date()) {
      throw new AppError("La date ne peut pas être dans le futur", 400);
    }
    // 📝 Créer la note
    const newGrade = new Grade({
      student,
      course,
      grade,
      date: parsedDate
    });

    const savedGrade = await newGrade.save();

    // 🔁 Populate pour réponse propre
    const populatedGrade = await Grade.findById(savedGrade._id)
      .populate('student', 'firstName lastName email')
      .populate('course', 'name code');

    res.status(201).json(populatedGrade);

  } catch (error) {
    console.error("❌ Erreur création note:", error);
    next(error);
  }
};



// ========================================
// ✅ NOUVELLES FONCTIONS À AJOUTER
// ========================================

/**
 * GET /api/grades/:id
 * Récupérer une note par son ID
 */
controller.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findById(id)
      .populate('student', 'firstName lastName email studentNumber')
      .populate('course', 'name code');

    if (!grade) {
      throw new AppError("Note introuvable", 404);
    }

    res.json(grade);
  } catch (error) {
    next(error);
  }
};
controller.getMyGradeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      throw new AppError("Étudiant introuvable", 404);
    }

    const grade = await Grade.findOne({
      _id: id,
      student: student._id
    })
      .populate('student', 'firstName lastName email studentNumber')
      .populate('course', 'name code');

    if (!grade) {
      throw new AppError("Note introuvable ou accès interdit", 404);
    }

    res.json(grade);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/grades/student/:studentId
 * Récupérer toutes les notes d'un étudiant
 */
controller.getGradesByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError("Étudiant introuvable", 404);
    }
    const grades = await Grade.find({ student: studentId })
      .populate('course', 'name code')
      .sort({ date: -1 });

    res.json(grades);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/grades/course/:courseId
 * Récupérer toutes les notes d'un cours
 */
controller.getGradesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const grades = await Grade.find({ course: courseId })
      .populate('student', 'firstName lastName email')
      .sort({ grade: -1 }); // Meilleures notes en premier

    res.json(grades);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/grades/:id
 * Modifier une note
 */
controller.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { grade, date } = req.body;

    if (grade !== undefined && (grade < 0 || grade > 20)) {
      throw new AppError("La note doit être entre 0 et 20", 400);
    }

    const updateData = {};
    if (grade !== undefined) updateData.grade = grade;
    if (date) updateData.date = parseDateUTC(date);

    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('student', 'firstName lastName email')
      .populate('course', 'name code');

    if (!updatedGrade) {
      throw new AppError("Note introuvable", 404);
    }

    res.json(updatedGrade);
  } catch (error) {
    next(error);
  }
};


/**
 * DELETE /api/grades/:id
 * Supprimer une note
 */
controller.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedGrade = await Grade.findByIdAndDelete(id);

    if (!deletedGrade) {
      throw new AppError("Note introuvable", 404);
    }

    res.json({
      message: 'Note supprimée avec succès',
      grade: deletedGrade
    });
  } catch (error) {
    next(error);
  }
};

module.exports = controller;