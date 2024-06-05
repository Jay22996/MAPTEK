var userModel = require("../Model/User_details");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");

exports.login = async (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);

  var find = await userModel.find({
    $or: [{ email: req.body.email }, { mobile_number: req.body.email }],
  });
console.log(find.length);
  if (find.length == 1) {
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      find[0].password
    );
    if (isPasswordMatch) {
      res.status(200).json({
        status: "user is logged in",
        data: find,
      });
    } else {
      res.status(200).json({
        status: "password does not match",
      });
    }
  } else {
    res.status(200).json({
      status: "please register",
    });
  }
};

exports.register = async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ status: "error", message: "Password is required" });
    }

    var password = await bcrypt.hash(req.body.password, 10);
    req.body.password = password;
    var data = await userModel.create(req.body);
    res.status(200).json({
      status: "user_data added",
      data,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to register user",
      error: error.message,
    });
  }
};


exports.Otpp = async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var number = req.body.number;

  var otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jay00289@gmail.com",
        pass: "fnsobaxdehdeaquq",
      },
    });

    const mailOptions = {
      from: "jay00289@gmail.com",
      to: `${email}`,
      subject: "One time otp",
      text: `${otp}`,
    };

    // Use async/await to make sendMail asynchronous
    await transporter.sendMail(mailOptions);

    // Send response after email is sent
    res.status(200).json({
      status: `Email sent successfully`,
      otp,
      email,
      password,
      number,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      status: "Error",
      message: "Failed to send email",
      error: error.message,
    });
  }
};
