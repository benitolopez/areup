# Are Up?

Are Up? is a lightweight monitoring tool that checks the availability of a list of URLs to ensure they are online. Additionally, it includes a special feature to detect WordPress MySQL error messages, allowing for more specific monitoring of WordPress sites.

This project is a simple and quick solution that works for my specific needs. It is not intended as a universal solution, but I made it public so others can use it as inspiration. Feel free to adapt and modify it to suit your own requirements.

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/benitolopez/areup.git
   cd areup
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `urls.txt` file**

   Create a urls.txt file in the root directory of the project. This file should contain the list of URLs you want to monitor, with each URL on a new line:

   ```bash
   https://google.com/
   https://www.reddit.com/
   https://github.com/
   ```

4. **Export the variables**

   You need to set up environment variables for email notifications. Create a .env file in the root directory with the following content:

   ```env
   EMAIL_HOST="your-email-host"
   EMAIL_PORT="your-email-port"
   EMAIL_USER="your-email-username"
   EMAIL_PASS="your-email-password"
   EMAIL_FROM_ADDRESS="your-from-address"
   EMAIL_TO_ADDRESS="your-to-address"
   ```

   **Note**: I recommend using [Mailtrap.io](https://mailtrap.io) for testing email notifications.

5. **Run the application**

   ```bash
   node index.js
   ```

   The application will check each URL listed in urls.txt and send an alert email if any of them are down or if a WordPress MySQL error is detected.

6. **Deploy the application**

   If you want to run this tool on a server and perform checks periodically, you can set up a cron job. For instance, to check the URLs every 30 minutes, add the following cron job to your server:

   ```bash
   */30 * * * * /usr/bin/node /path/to/areup/index.js >> /path/to/areup/cron.log 2>&1
   ```

   This cron job will execute the script every 30 minutes, logging the output to `cron.log` for later review.
