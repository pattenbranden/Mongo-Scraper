$(document).ready(function() {
  $(".save-btn").on("click", function() {
    var newFavArticle = $(this).data();
    newFavArticle.favorite = true;
    console.log("favorite was clicked");
    var id = $(this).attr("data-articleid");

    $.ajax("/favorite/" + id, {
      type: "put",
      data: newFavArticle
    }).then(function() {
      location.reload();
    });
  });

  $(".unsave-btn").on("click", function() {
    var newUnFavArticle = $(this).data();
    var id = $(this).attr("data-articleid");
    newUnFavArticle.favorite = false;
    console.log("unfavorite was clicked");
    $.ajax("/favorite/" + id, {
      type: "put",
      data: newUnFavArticle
    }).then(function() {
      location.reload();
    });
  });

  $(document).on("click", ".delete-comment", function() {
    var commentID = $(this).attr("data-commentId");
    $.ajax("/comment/" + commentID, {
      type: "DELETE"
    });
  });
  $(document).ajaxStop(() => {
    location.reload(true);
  });
  console.log("our JS loaded succesfully");
});
