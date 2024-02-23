const express = require('express');
const app = express();
const mongoose = require('mongoose')
app.use(express.json());

// Define Mongoose Schema for courses
const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true,
        min: 0 // Ensure units is a positive number
    },
    tags: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0; // Ensure tags is a non-empty array
            },
            message: props => `${props.value} is not a valid array of tags!`
        }
    }
});

const Course = mongoose.model('Course', courseSchema);

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/Courses')
    .then(()=>{
        console.log('Connected to MongoDB')
    })
    .catch((err)=>{
        console.error('Connection Failed!',err);
    })

// Route handler for GET request to '/courses'
app.get('/courses', async (req, res) => {
    try {
        // Retrieve all courses from the database
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Route handler for GET request to '/courses/sorted'
app.get('/courses/sorted', async (req, res) => {
    try {
        // Retrieve all courses
        const courses = await Course.find();

        // Flatten the courses array
        const flattenedCourses = courses.reduce((acc, curr) => {
            Object.values(curr.toObject()).forEach(year => {
                if (Array.isArray(year)) {
                    year.forEach(course => {
                        acc.push(course);
                    });
                }
            });
            return acc;
        }, []);

        // Sort the flattened courses alphabetically by their descriptions
        const sortedCourses = flattenedCourses.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });

        res.json(sortedCourses);
    } catch (error) {
        console.error('Error fetching sorted courses:', error);
        res.status(500).json({ error: 'Failed to fetch sorted courses' });
    }
});

// Route handler for GET request to '/courses/BSIS'
app.get('/courses/BSIS', async (req, res) => {
    try {
        const allCourses = await Course.find(); // Retrieve all documents

        // Filter courses with the tag 'BSIS' from all documents and extract desired fields
        const BSISCourses = allCourses.reduce((acc, curr) => {
            Object.values(curr.toObject()).forEach(level => {
                if (Array.isArray(level)) {
                    level.forEach(course => {
                        if (course.tags.includes('BSIS')) {
                            // Extract desired fields
                            const { code, description } = course;
                            acc.push({ code, description });
                        }
                    });
                }
            });
            return acc;
        }, []);

        res.json(BSISCourses);
    } catch (error) {
        console.error('Error fetching BSIS courses:', error);
        res.status(500).json({ error: 'Failed to fetch BSIS courses' });
    }
});

// Route handler for GET request to '/courses/BSIT'
app.get('/courses/BSIT', async (req, res) => {
    try {
        const allCourses = await Course.find(); // Retrieve all documents

        // Filter courses with the tag 'BSIT' from all documents and extract desired fields
        const BSITCourses = allCourses.reduce((acc, curr) => {
            Object.values(curr.toObject()).forEach(level => {
                if (Array.isArray(level)) {
                    level.forEach(course => {
                        if (course.tags.includes('BSIT')) {
                            // Extract desired fields
                            const { code, description } = course;
                            acc.push({ code, description });
                        }
                    });
                }
            });
            return acc;
        }, []);

        res.json(BSITCourses);
    } catch (error) {
        console.error('Error fetching BSIT courses:', error);
        res.status(500).json({ error: 'Failed to fetch BSIT courses' });
    }
});


// Define the port for the server to listen on
const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
    console.log(`Listening on http://localhost: ${port}...`)
});
