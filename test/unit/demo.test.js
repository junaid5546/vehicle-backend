const server = require("../../app.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

chai.should();
chai.use(chaiHttp);

describe("#HealthCheck GET /api/healthCheck", () => {
  it("It should return message of API is healthy", (done) => {
    chai.request(server).get("/api/health-check").end((err, response)=>{
        expect(response.body.code).to.equal(200);
        expect(response.body.message).to.equal('API is healthy');
        expect(response.body.result).to.equal('API is healthy');
        expect(err).to.be.null;
        done();
    });
  });
});
