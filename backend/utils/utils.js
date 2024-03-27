const transporter = require("../config/smtp");

class Utils {
  async sendEmailForPaymentLink(toEmail, paymentLink, res) {
    let mailOptions = {
      from: "no-reply@gmail.com",
      to: toEmail,
      subject: "Subscription request payment link",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
              /* CSS styles for better email rendering */
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  font-size: 16px;
                  line-height: 1.6;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #007bff;
                  color: #fff;
                  padding: 10px 0;
                  text-align: center;
                  border-top-left-radius: 8px;
                  border-top-right-radius: 8px;
              }
              .content {
                  padding: 20px 0;
              }
              .footer {
                  background-color: #f4f4f4;
                  padding: 10px 0;
                  text-align: center;
                  border-bottom-left-radius: 8px;
                  border-bottom-right-radius: 8px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Subscription Request Payment Link</h1>
              </div>
              <div class="content">
                  <p>Hello,</p>
                  <p>This is a test email template for your subscription request payment link.</p>
                  <p>Please find the payment link below:</p>
                  <a href="${paymentLink}" target="_blank">Payment Link</a> <!-- Dynamic href -->
                  <p>Thank you for your subscription request.</p>
              </div>
              <div class="footer">
                  <p>Best Regards,<br>Bjit Limited.</p>
              </div>
          </div>
      </body>
      </html>
  `,
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
