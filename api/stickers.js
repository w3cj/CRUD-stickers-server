const express = require('express');

const router = express.Router();

const queries = require('../db/queries');

function isValidId(req, res, next) {
  if(!isNaN(req.params.id)) return next();
  next(new Error('Invalid ID'));
}

function validSticker(sticker) {
  const hasTitle = typeof sticker.title == 'string' && sticker.title.trim() != '';
  const hasURL = typeof sticker.url == 'string' && sticker.url.trim() != '';
  return hasTitle && hasURL;
}

router.get('/', (req, res) => {
  queries.getAll().then(stickers => {
    res.json(stickers);
  });
});

router.get('/:id', isValidId, (req, res, next) => {
  queries.getOne(req.params.id).then(sticker => {
    if(sticker) {
      res.json(sticker);
    } else {
      next();
    }
  });
});

router.post('/', (req, res, next) => {
  if(validSticker(req.body)) {
    queries.create(req.body).then(stickers => {
      res.json(stickers[0]);
    });
  } else {
    next(new Error('Invalid sticker'));
  }
});

module.exports = router;
