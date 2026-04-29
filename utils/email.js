const nodemailer = require("nodemailer");

const sendMessage = async (email,code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "komilovbehruz550@gmail.com",
      pass: "shu yer qoldi! ...",
    },
  });


  await transporter.sendMail({
    from: "komilovbehruz550@gmail.com",
    to: email,
    subject: "Lesson",
    text: code,
  });
};

module.exports = {
sendMessage      
}