var bcrypt = require("bcryptjs");
var pool = require("../db/index.js");
var mysql = require("mysql");
async function handle_request(msg, callback) {
  console.log(
    "=====================In the kafka-backend citywise====================="
  );
  console.log("Message body:" + JSON.stringify(msg));
 // msg.id = 1;

  let queryString =
    "SELECT city AS `key`, AVG(applicant_id) AS value" +
    " FROM job_application_submitted" +
    " WHERE" +
    " recruiter_id =" +
    mysql.escape(msg.id) +
    " GROUP BY (city)";

  console.log(queryString);

  pool.getConnection((err, con) => {
    if (err) {
      console.log("Error occurred while creating a connection ", err);
      callback("Error occured", null);
    } else {
      con.query(queryString, (err, rows) => {
        if (err) {
          console.log("Error occurred while executing query ", err);
          callback("Error occured", null);
        } else {
          console.log("result:" + JSON.stringify(rows));
          if (rows.length > 0) {
            console.log("Rows: " + JSON.stringify(rows));
            callback(null, rows);
          } else {
            callback("No such user present", null);
          }
          console.log(
            "============================Out of the kafka-backend citywise====================="
          );
        }
      });
    }
    con.release();
  });
}

exports.handle_request = handle_request;
