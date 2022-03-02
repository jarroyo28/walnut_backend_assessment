const { expect } = require("chai");
const axios = require("axios");

describe("Backend Assessment - Blog Posts", () => {
  describe("Route 1: GET /api/ping", () => {
    it("Should respond with a 200 Status and the correct response body", async () => {
      let response = await axios.get("http://localhost:3000/api/ping");
      expect(response.status).to.equal(200);
      // need to use eql to compare objects
      expect(response.data).to.eql({ success: true });
    });
  });

  describe("Route 2: GET /api/posts", () => {
    it("Should respond with a 400 status and the correct response body if there is no tag parameter", async () => {
      try {
        await axios.get("http://localhost:3000/api/posts");
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.eql({
          error: "Tags parameter is required",
        });
      }
    });

    it("Should respond with a 400 status and the correct response body if the sortBy parameter is an invalid value", async () => {
      try {
        await axios.get(
          "http://localhost:3000/api/posts?tags=tech&sortBy=name"
        );
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.eql({
          error: "sortBy parameter is invalid",
        });
      }
    });

    it("Should respond with a 400 status and the correct response body if the direction parameter is an invalid value", async () => {
      try {
        await axios.get(
          "http://localhost:3000/api/posts?tags=tech&direction=name"
        );
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.eql({
          error: "direction parameter is invalid",
        });
      }
    });

    it("Should respond with a 200 status and the correct response body depending on the tags, sortBy and direction parameter", async () => {
      // Will compare my api response body to the hatchways response body, if they are equal, then the response is the same
      let hatchwaysResponse = await axios.get(
        "https://api.hatchways.io/assessment/solution/posts?tags=history,tech&sortBy=likes&direction=desc"
      );
      let apiResponse = await axios.get(
        "http://localhost:3000/api/posts?tags=history,tech&sortBy=likes&direction=desc"
      );
      expect(apiResponse.status).to.equal(200);
      expect(apiResponse.data).to.eql(hatchwaysResponse.data);
    });
  });
});
