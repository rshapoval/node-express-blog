const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const methodOverride = require('method-override');
const postRoutes = require('./routes/post-routes');
const postApiRoutes = require('./routes/api-post-routes');
const contactRoutes = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');

const errorMdg = chalk.bgKeyword('white').redBright;
const errorSuccess = chalk.bgKeyword('green').white;

const app = express();

app.set('view engine', 'ejs');

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log(errorSuccess('Connected to DB')))
  .catch((error) => console.log(errorMdg(error)));

app.listen(process.env.PORT, (error) => {
  error ? console.log(errorMdg(error)) : console.log(errorSuccess(`listening port ${process.env.PORT}`));
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false }));

app.use(express.static('styles'))

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.use(postRoutes);
app.use(postApiRoutes);
app.use(contactRoutes);

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});
