const Joi = require('joi');
const express = require('express');
const app = express();

//dis middleware
app.use(express.json())

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req, res) => {
    res.send('Hello y\'all!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses)
});

app.post('/api/courses', (req, res) => {
    /*const schema = {
        name: Joi.string().min(3).required()
    };

    const result = schema.validate(req.body);
    console.log(result); */

    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send('Not legit bruv');
        return;
    }
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);

})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id = parseInt(req.params.id));
    if (!course) res.status(404).send('A course with that ID was not found.')
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    //look up the course
    // if invalid, retiurn 400

    //validate
    //if invalid, return 400

    //update course
    //return updated course
})









const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))