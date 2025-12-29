const User = require('../model/user');
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

// ❌ Supprimer user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
       throw new AppError("Utilisateur introuvable", 404);
    }

    res.json({ message: 'Utilisateur supprimé', user });
  } catch (err) {
    next(err);
  }
};