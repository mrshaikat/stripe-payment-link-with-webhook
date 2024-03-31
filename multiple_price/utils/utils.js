const transporter = require("../config/smtp");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

class Utils {
  async sendEmailForPaymentLink(toEmail, paymentLink, content, res) {
    const template = fs.readFileSync(
      path.join(path.dirname(__dirname), "/templates/emails/payment.hbs"),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(template);
    const result = compiledTemplate({ paymentLink, content });
    let mailOptions = {
      from: "no-reply@gmail.com",
      to: toEmail,
      subject: "Subscription request payment link",
      html: result,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send("Error occurred: " + error.message);
      } else {
        console.log("Email sent: " + info.response);
        res.send("Email sent successfully!");
      }
    });
  }
}

module.exports = new Utils();
