const fs = require("fs");
const path = require("path");
const axios = require("axios");
const nodemailer = require("nodemailer");

/**
 * Reads URLs from a file.
 *
 * @param {string} filePath - The path to the file.
 * @returns {string[]} - An array of URLs.
 */
function readUrlsFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data.split("\n").filter(Boolean);
  } catch (err) {
    console.error("Error reading URLs from file:", err);
    return [];
  }
}

const filePath = path.join(__dirname, "urls.txt");
const urls = readUrlsFromFile(filePath);

/**
 * Creates a nodemailer transporter object.
 *
 * @type {Object}
 * @property {string} host - The email host.
 * @property {number} port - The email port.
 * @property {Object} auth - The authentication credentials.
 * @property {string} auth.user - The email user.
 * @property {string} auth.pass - The email password.
 */

var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an alert email with the list of down URLs.
 *
 * @param {Array<Object>} downUrls - The array of down URLs.
 * @param {string} downUrls[].url - The URL of the down website.
 * @param {string} downUrls[].error - The error message associated with the down website.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully, or rejects with an error.
 */
const sendAlertEmail = async (downUrls) => {
  const text = downUrls.map((url) => `${url.url}: ${url.error}`).join("\n");
  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    to: process.env.EMAIL_TO_ADDRESS,
    subject: "Website Down Alert",
    text: `The following websites are down:\n\n${text}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Alert email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * Checks the status of multiple websites.
 *
 * @returns {Promise<void>} A promise that resolves when the website check is complete.
 */
const checkWebsites = async () => {
  const downUrls = [];

  for (const url of urls) {
    try {
      console.log(`Checking ${url}...`);
      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error("URL is down!");
      }

      if (response.data.includes("Error establishing a database connection")) {
        throw new Error("MySQL is down!");
      }
    } catch (error) {
      downUrls.push({ url, error: error.message });
    }
  }

  if (downUrls.length > 0) {
    await sendAlertEmail(downUrls);
  }
};

// Run the website check
checkWebsites();
