const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const knex = require('../db/knex');


router.get('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  let status = "";


  if (isAuth) {
    const userName = req.user.name
    const userId = req.user.id;
    status = `${userName} さん，ようこそ`
    knex("tasks")
      .select("*")
      .where({user_id: userId})
      .then(function (results) {
        res.render('index', {
          title: 'ToDo App',
          todos: results,
          isAuth: isAuth,
          status: status,
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          title: 'ToDo App',
          isAuth: isAuth,
          errorMessage: [err.sqlMessage],
          status: status,
        });
      });
  } else {
    res.render('index', {
      title: 'ToDo App',
      isAuth: isAuth,
      status: status,
    });
  }
});

router.post('/', (req, res, next) => {
  const userId = req.user.id;
  const isAuth = req.isAuthenticated();
  const todo = req.body.add;

  console.log(todo)
  console.log(userId)

  knex("tasks")
    .insert({user_id: userId, content: todo})
    .then(function () {
      res.redirect('/')
    })
    .catch((err) => {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        status: "",
      });
    });
});

// セッション確認用のエンドポイント
router.get(
  '/session-test',
  (req, res) => {
    console.log('\n')
    console.log(req.session.hoge)
    req.session.hoge = "hoge"
    console.log(req.session.hoge)
    console.log('\n')
  }
);

// /signupへのリクエストをsignup.jsに流すことができるようにする
router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/signout', require('./signout'));

module.exports = router;