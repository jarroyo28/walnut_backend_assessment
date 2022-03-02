const express = require("express");
const app = express();
const PORT = 3000;
const axios = require("axios");
const morgan = require("morgan");

// Middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Logging requests to the console
app.use(morgan("dev"));

// This is for the first route of the assessment
app.get("/api/ping", (req, res, next) => {
  res.status(200).json({ success: true });
});

// Second route of the assessment
app.get("/api/posts", (req, res, next) => {
  let tags = req.query.tags;
  // sortBy and direction are optional
  let sortBy = req.query.sortBy;
  if (!sortBy) {
    // If there is no specified sortBy param, the default is id
    sortBy = "id";
  }
  let direction = req.query.direction;
  if (!direction) {
    // If there is no specified direction param, the default is asc
    direction = "asc";
  }

  // valid values for the sortBy and direction parameters
  let sortByValues = ["id", "reads", "likes", "popularity"];
  let directionValues = ["asc", "desc"];

  // Check to see if tags parameter is present, if not send an error response
  // Also checks to see if the sortBy parameter and direction parameter is valid
  if (!tags) {
    res.status(400).json({ error: "Tags parameter is required" });
  } else if (sortBy && sortByValues.indexOf(sortBy) === -1) {
    res.status(400).json({ error: "sortBy parameter is invalid" });
  } else if (direction && directionValues.indexOf(direction) === -1) {
    res.status(400).json({ error: "direction parameter is invalid" });
  } else {
    let listOfTags = tags.split(",");
    console.log(listOfTags);
    // I create an array of endpoints depending on the number of tags there are
    let endpoints = listOfTags.map((tag) => {
      return `http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`;
    });
    console.log(endpoints);

    // axios.all allows us to make concurrent HTTP requests to the API
    // will create an array of endpoints and then use axios.all on it

    // I call the all method on the axios instance, This maps through each of the items in the endpoints’ array.
    // Then, using the GET method on the Axios instance to make a request to our list of endpoints, we get each response from the server.
    axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
      // There are 9 possible tags that can be used by the user
      axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
        let data = [];
        data.push(tag1);
        data.push(tag2);
        data.push(tag3);
        data.push(tag4);
        data.push(tag5);
        data.push(tag6);
        data.push(tag7);
        data.push(tag8);
        data.push(tag9);
        // Create a hash table to get rid of duplicates
        let post = {};
        let posts = [];

        for (let i = 0; i < data.length; i++) {
          // If there is a tag for the blog, then store the blog into a variable
          if (data[i] !== undefined) {
            let blog = data[i].data.posts;
            console.log(blog);
            // this will store the blog post onto the hash table, no duplicates will be made because we are storing them by id
            for (let i = 0; i < blog.length; i++) {
              post[blog[i].id] = blog[i];
            }
          } else {
            break;
          }
        }

        // We will return the blog posts in the correct format, as an array
        for (let key in post) {
          posts.push(post[key]);
        }

        // Will sort the posts depending on the direction
        if (direction === "desc") {
          posts = posts.sort((a, b) => (b[sortBy] > a[sortBy] ? 1 : -1));
        } else {
          posts = posts.sort((a, b) => (b[sortBy] < a[sortBy] ? 1 : -1));
        }

        res.status(200).json({ posts: posts });
      })
    );
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
