require("dotenv").config()
import bodyParser from "body-parser"
import express from "express"
import nodemailer from "nodemailer"
import health from "./routes/health"
const GoogleSheet = require("google-spreadsheet")
const { promisify } = require("util")
const creds = require("./client_access.json")
const Emails = require("./Emails.json")

const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
})

//Fetch all the data from spreadsheet
async function fetchSpreadsheet() {
  const doc = new GoogleSheet("1sZHp76yPeLfuXeigccDwGDk4bU_abVQYeOVzzZ9oiwE")
  await promisify(doc.useServiceAccountAuth)(creds)
  const info = await promisify(doc.getInfo)()
  const sheet = info.worksheets[0]
  const rows = await promisify(sheet.getRows)({
    offset: 1
  })
  const data = rows.map(row => [
    row.name,
    row.classtype,
    row.expensetype,
    row.amount,
    row.date
  ])
  return data
}

//Add data to spreadsheet
async function spreadsheet(name, classtype, expensetype, amount, date) {
  const doc = new GoogleSheet("1sZHp76yPeLfuXeigccDwGDk4bU_abVQYeOVzzZ9oiwE")
  await promisify(doc.useServiceAccountAuth)(creds)
  const info = await promisify(doc.getInfo)()
  const sheet = info.worksheets[0]

  const row = {
    name,
    classtype,
    expensetype,
    amount,
    date
  }

  await promisify(sheet.addRow)(row)
}

//Send an email to person who submit the expense form
async function mailer(name) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  })
  const html = `<div>
  <p>Dear ${name}  </p> 
  <p>Thankyou for <strong>submitting your expense </strong>
  If you need any further information please contact us  </p>
  
  <p>kind Regards </p>
  <p>Code your future team</p>
   </div>`

  const emailData = {
    to: Emails[name],
    subject: "Thank you for submitting your expense",
    html,
    replyToEmail: "Do not reply"
  }
  try {
    const sendEmail = await transporter.sendMail(emailData)
    return sendEmail
  } catch (err) {
    throw new Error(err)
  }
}

app.use("/health", health)
app.get("/", (req, res) => res.send("Hello World!"))
app.get("/expense/list", async (req, res) => {
  const list = await fetchSpreadsheet()
  res.status(200).send(list)
})

app.post("/expense/submit", (req, res) => {
  const { name, classtype, expensetype, amount, date } = req.body
  mailer(name)
  spreadsheet(name, classtype, expensetype, amount, date)
  res.sendStatus(200)
})

app.listen("8080", () => {
  console.log("Starting application on port: 8080")
})
