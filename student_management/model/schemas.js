let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StudentSchema = Schema({
    studentNumber: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    // 🔗 lien vers le compte utilisateur
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },

    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
});

let student = mongoose.model('Student', StudentSchema);

let courseSchema = Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }
});

let Course = mongoose.model('Course', courseSchema);

let gradeSchema = Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    grade: { type: Number, min: 0, max: 20, required: true },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date(); // pas dans le futur
            },
            message: "La date de la note ne peut pas être dans le futur"
        }
    }
});

let Grade = mongoose.model('Grade', gradeSchema);

// Exports the modeles
module.exports = {
    Student: student,
    Course: Course,
    Grade: Grade,
}