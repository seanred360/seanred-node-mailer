const express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
const router = express.Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv/config");

var transport = {
  host: "mail.privateemail.com", // Don’t forget to replace with the SMTP host of your provider
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  debug: true,
  logger: true,
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

router.post("/send", (req, res, next) => {
  const name = req.body.senderName;
  const email = req.body.senderEmail;
  const message = req.body.senderMessage;
  const content = `name: ${name} \n email: ${email} \n message: ${message} `;

  const mail = {
    from: {
      name: name,
      address: process.env.USER,
    },
    to: process.env.USER, // Change to email address that you want to receive messages on
    subject: "seanred.io: New Message from Contact Form",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });

      transporter.sendMail(
        {
          from: {
            name: name,
            address: process.env.USER,
          },
          to: email,
          subject: "Thank you for contacting Sean Redmon",
          text: `Thank you for contacting me! I will get back to you as soon as possible. \n\nForm details\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Message sent: " + info.response);
          }
        }
      );
    }
  });
});

app.use(cors());
app.use(express.json());
app.use("/", router);
server.listen(process.env.PORT || 5000, process.env.HOST || "0.0.0.0", () => {
  console.log(`Server is listening at port ${process.env.PORT || 5000}`);
});
