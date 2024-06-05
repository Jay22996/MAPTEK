var userModel = require("../Model/User_details");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");

exports.login = async (req, res) => {
  var email1 = req.body.email;
  var email = email1.toLowerCase();
  var find = await userModel.find({
    $or: [{ email: email }, { mobile_number: email }],
  });

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
  var password = await bcrypt.hash(req.body.password, 10);
  req.body.password = password;
  var data = await userModel.create(req.body);
  res.status(200).json({
    status: "user_data add",
    data,
  });
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
