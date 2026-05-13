require("dotenv").config();

const express = require("express");
const twilio = require("twilio");
const { appendRecord } = require("./excelStore");
const { parseMessage } = require("./messageParser");

const app = express();
const port = process.env.PORT || 3000;
const excelFilePath = process.env.EXCEL_FILE_PATH || "./data/daily-information.xlsx";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    status: "running",
    service: "WhatsApp Daily Information Bot"
  });
});

app.post("/whatsapp", maybeValidateTwilioRequest, async (req, res) => {
  try {
    const from = req.body.From || "";
    const body = req.body.Body || "";
    const parsed = parseMessage(body);

    await appendRecord(excelFilePath, {
      receivedAt: new Date().toISOString(),
      from,
      ...parsed
    });

    const response = new twilio.twiml.MessagingResponse();
    response.message("Received. Your daily information has been recorded in Excel.");

    res.type("text/xml").send(response.toString());
  } catch (error) {
    console.error("Failed to record WhatsApp message:", error);

    const response = new twilio.twiml.MessagingResponse();
    response.message("Sorry, I could not record that message. Please try again.");

    res.status(500).type("text/xml").send(response.toString());
  }
});

function maybeValidateTwilioRequest(req, res, next) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    return next();
  }

  const signature = req.header("X-Twilio-Signature");
  const protocol = req.header("X-Forwarded-Proto") || req.protocol;
  const host = req.header("X-Forwarded-Host") || req.header("host");
  const url = `${protocol}://${host}${req.originalUrl}`;

  if (twilio.validateRequest(authToken, signature, url, req.body)) {
    return next();
  }

  return res.status(403).send("Invalid Twilio signature");
}

app.listen(port, () => {
  console.log(`WhatsApp Daily Information Bot is running on port ${port}`);
});
