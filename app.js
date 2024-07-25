const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const createError = require('http-errors');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/car', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/', indexRouter);

// Error handling middleware
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
