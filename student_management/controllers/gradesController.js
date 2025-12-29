let {Grade, Student, Course} = require('../model/schemas');

function getAll(req, res) {
    Grade.find()
        .populate('student')
        .populate('course')
        .then((grades) => {
            res.send(grades);
        }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let grade = new Grade();

    grade.student = req.body.student;
    grade.course = req.body.course;
    grade.grade = req.body.grade;
    grade.date = req.body.date;

    grade.save()
        .then((grade) => {
                res.json({message: `grade saved with id ${grade.id}!`});
            }
        ).catch((err) => {
        console.log(err);
        res.status(400).send('cant post grade ', err.message);
    });
}

module.exports = {getAll, create};
