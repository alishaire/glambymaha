const axios = require("axios");

async function mailjet(receiverEmail, receiverName, subject, message) {
  const apiKey = "042e7596d4a3f1df53eb6b01adadde85";
  const secretKey = "6e4e7e54a549b485053a65f4abdded23";
  const senderEmail = "scriptwithahmad@gmail.com";
  const senderName = "Muhammad Ahmad ushop";

  const apiEndpoint = "https://api.mailjet.com/v3.1/send";

  const auth = {
    username: apiKey,
    password: secretKey,
  };

  const emailPayload = {
    Messages: [
      {
        From: {
          Email: senderEmail,
          Name: senderName,
        },
        To: [
          {
            Email: receiverEmail,
            Name: receiverName,
          },
        ],
        Subject: subject,
        TextPart: message,
        HTMLPart: `<p>${message}</p>`,
      },
    ],
  };

  const headers = {
    "Content-Type": "application/json",
  };

  // Making the API request using axios
  try {
    var { data } = await axios.post(apiEndpoint, emailPayload, {
      auth,
      headers,
    });
    return data;
  } catch (error) {
    console.log(error)
    console.error(
      "Failed to send email:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
}

export default mailjet;
