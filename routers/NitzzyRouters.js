const express = require('express');
const NitzzyCtrl = require('../controllers/NitzzyController.js');

const router = express.Router();

//GET || all blogs
router.get('/all-blogs', NitzzyCtrl.getAllNitzzyController);

//POST || create blog
router.post('/create-blog', NitzzyCtrl.createNitzzyController);

//PUT || update blog
router.put('/update-blog/:id', NitzzyCtrl.updateNitzzyController);

//GET || single blog
router.get('/single-blog/:id', NitzzyCtrl.getNitzzyByIdController);

//DELETE || delete blog
router.delete('/delete-blog/:id', NitzzyCtrl.deleteNitzzyController);

//GET || user blogs
router.get('/user-blog/:id', NitzzyCtrl.getUserNitzzyController);

module.exports = router;
