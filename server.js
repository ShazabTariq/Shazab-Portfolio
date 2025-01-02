// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = 3230;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/contactForm', { useNewUrlParser: true, useUnifiedTopology: true });

// const contactSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     phone: String,
//     subject: String,
//     message: String,
// });

// const Contact = mongoose.model('Contact', contactSchema);

// app.post('/api/contact', async (req, res) => {
//     const { name, email, phone, subject, message } = req.body;

//     const contact = new Contact({ name, email, phone, subject, message });

//     try {
//         await contact.save();
//         res.status(200).send({ message: 'Message saved successfully' });
//     } catch (error) {
//         res.status(500).send({ message: 'Error saving message' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });
