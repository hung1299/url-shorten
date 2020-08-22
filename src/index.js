const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { nanoid } = require('nanoid');
const yup = require('yup');

require('./db/db');
const Url = require('./model/Url');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const url = await Url.findOne({ slug });

    if (!url) {
      throw new Error('url not found');
    }

    res.redirect(url.url);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post('/url', async (req, res) => {
  let { slug, url } = req.body;

  url = url.trim();
  try {
    await schema.validate({
      slug,
      url,
    });

    if (!slug) {
      slug = nanoid(5).toLowerCase();
    } else {
      slug = slug.trim().toLowerCase();
      const existing = await Url.findOne({ slug });
      if (existing) {
        throw new Error('Slug in use');
      }
    }

    const newUrl = new Url({
      url,
      slug,
    });

    const created = await newUrl.save();
    res.json(created);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
