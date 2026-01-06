const User = require('../model/user');
const Student = require('../model/schemas');
const { sendInvitation } = require('../services/mailService');
const { AppError } = require('../middlewares/errorHandler');

exports.inviteUser = async (req, res, next) => {
  try {
    const { email, role } = req.body;

      if (!email || !role) {
      throw new AppError("Email et rôle sont obligatoires", 400);
    }

    let user = await User.findOne({ email });
    if (user) {
       throw new AppError("Utilisateur déjà invité ou existant", 400);
    }

    user = new User({
      email,
      role
    });

    await user.save();
    await sendInvitation(email);

    res.json({ message: `Invitation envoyée à ${email}` });
  } catch (err) {
    console.error(err);
     next(err);
  }
};

// 👥 Liste users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// ❌ Supprimer user + détacher étudiant si nécessaire
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1️⃣ Récupérer le user
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("Utilisateur introuvable", 404);
    }

    // 2️⃣ Si c'est un étudiant → détacher le Student
    if (user.role === "STUDENT") {
      await Student.updateOne(
        { user: user._id },
        { $unset: { user: "" } }
      );
    }

    // 3️⃣ Supprimer le user
    await User.findByIdAndDelete(id);

    // 4️⃣ (optionnel mais recommandé) invalider sessions
    if (req.sessionStore) {
      req.sessionStore.all((err, sessions) => {
        if (err) return;
        Object.keys(sessions).forEach((sid) => {
          const sess = sessions[sid];
          if (sess?.userId === id) {
            req.sessionStore.destroy(sid, () => {});
          }
        });
      });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });

  } catch (err) {
    next(err);
  }
};
