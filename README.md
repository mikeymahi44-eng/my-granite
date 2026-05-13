# WhatsApp Daily Information Bot

This project is a small WhatsApp bot that receives daily information through a Twilio WhatsApp webhook and saves each message into an Excel sheet.

## What It Does

- Receives WhatsApp messages at the `/whatsapp` webhook endpoint.
- Extracts common fields from the message, such as name, date, category, amount, status, and notes.
- Appends every received message to `data/daily-information.xlsx`.
- Sends a WhatsApp confirmation reply after recording the entry.

## Example WhatsApp Message

```text
Name: Ravi Kumar
Date: 2026-05-13
Category: Sales
Amount: 15000
Status: Completed
Notes: Payment collected today
```

The bot also records the full original message, so even unstructured messages are not lost.

## Requirements

- Node.js 18 or newer
- A Twilio account with WhatsApp Sandbox or an approved WhatsApp sender
- A public URL for local testing, such as ngrok

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Start the bot:

```bash
npm start
```

4. For local testing, expose your local server:

```bash
ngrok http 3000
```

5. In Twilio, set the WhatsApp incoming message webhook to:

```text
https://your-public-url.ngrok-free.app/whatsapp
```

Use `POST` as the webhook method.

## Excel Output

The Excel file is created automatically at:

```text
data/daily-information.xlsx
```

Columns included:

- Received At
- WhatsApp Number
- Name
- Date
- Category
- Amount / Quantity
- Status
- Notes
- Raw Message

## Optional Security

Add your Twilio Auth Token to `.env` to validate that webhook requests are genuinely coming from Twilio:

```text
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

You can leave it empty while first testing locally.

## Uploading To GitHub

Create a new GitHub repository, upload these project files, then run:

```bash
npm install
npm start
```

Do not commit your `.env` file or generated Excel files. They are intentionally ignored by `.gitignore`.
