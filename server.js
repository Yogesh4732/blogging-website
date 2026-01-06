const express = require('express');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

/* ---------------- VIEW ENGINE ---------------- */
app.set('view engine', 'ejs');
app.set('views', './views');

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

/* ---------------- ROUTES ---------------- */
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles });
});

app.use('/articles', articleRouter);

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
