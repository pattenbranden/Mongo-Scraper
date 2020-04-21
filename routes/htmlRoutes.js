var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.redirect("/articles");
  });

  app.get("/articles", function(req, res) {
    Article.find()
      .sort({ _id: -1 })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          var artcl = { article: doc };
          res.render("index", artcl);
        }
      });
  });
  app.get("/favorites", function(req, res) {
    Article.find({ favorite: true })
      .sort({ _id: -1 })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          var artcl = { article: doc };
          res.render("index", artcl);
        }
      });
  });
  app.get("/readArticle/:id", function(req, res) {
    let articleId = req.params.id;
    var hbsObj = {
      article: [],
      body: []
    };

    Article.findOne({ _id: articleId })
      .populate("comment")
      .exec(function(err, storedArticle) {
        if (err) {
          throw err;
        } else {
          hbsObj.article = storedArticle;

          axios
            .get(storedArticle.link)
            .then(function(response) {
              let $ = cheerio.load(response.data);
              $(".content-wrapper").each(function(i, element) {
                hbsObj.body = $(element)
                  .children("#article-body")
                  .find("p")
                  .text();

                res.render("article", hbsObj);
                console.log(hbsObj);
                return false;
              });
            })
            .catch(error => {
              console.warn(error);
            });
        }
      });
  });

  app.get("/scrape", function(req, res) {
    axios.get("https://www.pcgamer.com/news/").then(function(response) {
      var $ = cheerio.load(response.data);
      $(".listingResult").each(function(i, element) {
        var result = {};
        var titlesArray = [];
        $(".sponsored-post").remove();
        console.log("begin scrape " + i);
        result.title = $(this)
          .children("a.article-link")
          .find("h3.article-name")
          .text();

        result.link = $(this)
          .children("a.article-link")
          .attr("href");

        result.img = $(this)
          .children(".article-link")
          .children("article")
          .children("div.image")
          .children("figure")
          .attr("data-original");

        result.category = $(this)
          .children(".article-link")
          .children("article")
          .children(".content")
          .find(".synopsis")
          .find("span.free-text-label")
          .text();

        result.synopsis = $(element)
          .children(".article-link")
          .children("article")
          .children(".content")
          .find(".synopsis")
          .after("span")
          .text()
          .split("\n")[1];

        if (
          result.title &&
          result.link &&
          result.img &&
          result.category &&
          result.synopsis
        ) {
          if (titlesArray.indexOf(result.title) === -1) {
            titlesArray.push(result.title);

            Article.count({ title: result.title }, function(err, count) {
              if (count === 0) {
                var entry = new Article(result);

                entry.save(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("saved");
                  }
                });
              }
            });
          } else {
            console.log("Article already exists.");
          }
        } else {
          console.log("Not saved to DB, missing data");
        }
      });
      res.redirect("/");
    });
  });
  // route for setting an article to saved
  app.put("/favorite/:id", function(req, res) {
    Article.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      {
        new: true
      }
    )
      .then(function(dbArticle) {
        res.render("article", {
          articles: dbArticle
        });
      })
      .catch(function(err) {
        if (err) {
          throw err;
        } else {
          res.redirect(303, "/readArticle/" + articleId);
        }
      });
  });
  app.post("/comment/:id", function(req, res) {
    let user = req.body.name;
    let content = req.body.comment;
    let articleId = req.params.id;

    var commentObj = {
      name: user,
      body: content
    };

    var newComment = new Comment(commentObj);

    newComment.save(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log(doc._id);
        console.log(articleId);

        Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { comment: doc._id } },
          { new: true }
        ).exec(function(err) {
          if (err) {
            console.log(err);
          } else {
            res.redirect(303, "/readArticle/" + articleId);
          }
        });
      }
    });
  });
  //delete a comment

  app.delete("/comment/:id", function(req, res) {
    function delComment() {
      Comment.findOneAndRemove({ _id: req.params.id }, function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Comment deleted.");
        }
      });
    }
    delComment();
    res.end();
  });

  //return raw json from our database
  app.get("/articles-json", function(req, res) {
    Article.find({}, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.json(doc);
      }
    });
  });
};
