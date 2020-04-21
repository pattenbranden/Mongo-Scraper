# Mongo-Scraper

This application scrapes PCGAMER for news articles stores them with Mongoose for MongoDB for later viewing.
You can also save articles to easily return to them later for more viewing by clicking the link, setting the stored object's favorite boolean to true.
In addition, you can leave comments on articles, stored in their own collection and associated with the article.
View this application deployed here: https://pcgamer-scraper.herokuapp.com/articles

Some notes from the developer(me): 

<br> After hearing my classmate talk about materialize I gave it a try. It's very interesting how these different libraries aren't really all that different, Bootstrap, Bulma, and Materialize all share commonalities in how they function.

<br> Cheerio was fun to learn, as scraping is a big part of why I was interested in learning web development. I had to learn how to ignore certain div tags as the class they used was the same as the articles, only with the extra class .sponsored-post, since it was missing information and it went against my schema. I accomplished this using the .remove() method to simply cut them out entirely so I don't have to worry about iterating over them.

Handlebars proved difficult this time, as I used @allow-prototype-methods. I will have to do more research, I believe Mongoose's .lean() will provide me the functionality I need without the security vulnerabilities. 

It was my first time using Morgan, and that was a nicety I didn't know I was missing out on! It makes following how my application's redirects easy by checking my console to see what routes my application was hitting.

TODOs: Split up routes so it's less of a mess. Replace @allow-prototype-access for Handlebars with .lean(), clean up the page's display so it provides more information per scroll.
