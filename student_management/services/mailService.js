const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendInvitation = async (email) => {
const link = `${process.env.FRONT_URL}`;


  await transporter.sendMail({
    to: email,
    subject: 'Invitation à la plateforme Student Management',
    html: `
      <p>Vous avez été invité à accéder à la plateforme.</p>
      <a href="${link}">Se connecter avec Google</a>
    `
  });
};
