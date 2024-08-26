import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";

chai.use(chaiHttp);
const { expect } = chai;

describe("Temperature File Upload", () => {
  it("should upload a temperature file and return an image", (done) => {
    chai
      .request(app)
      .post("/upload")
      .attach("temperatureFile", "path_to_test_file/sst.grid")
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res).to.have.header("Content-Type", /image/);
        done();
      });
  });
});
