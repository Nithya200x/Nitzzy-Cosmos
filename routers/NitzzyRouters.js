const express = require('express');
const { getAllNitzzyController,
     createNitzzyController,
     updateNitzzyController, 
     getNitzzyByIdController, 
     deleteNitzzyController, 
     getUserNitzzyController } = require('../controllers/NitzzyController.js');

const router = express.Router();

// router
//GET || all blogs
router.get('/all-blogs', getAllNitzzyController);

//POST || create blog
router.post('/create-blog', createNitzzyController);

//PUT || update blog
router.put('/update-blog/:id', updateNitzzyController);

//GET || single blog
router.get('/single-blog/:id', getNitzzyByIdController);   

//DELETE || delete blog
router.delete('/delete-blog/:id', deleteNitzzyController);

//GET || user blogs
router.get('/user-blog/:id', getUserNitzzyController);
module.exports = router;