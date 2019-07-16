import bodyParser from "body-parser"
import express from "express"
import health from "./routes/health"
const GoogleSheet = require("google-spreadsheet")
const { promisify } = require("util")
const creds = require("./client_access.json")

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

app.use("/health", health)
app.get("/", (req, res) => res.send("Hello World!"))
app.get("/expense/list", async (req, res) => {
  const list = await fetchSpreadsheet()
  res.status(200).send(list)
})

app.post("/expense/submit", (req, res) => {
  const { name, classtype, expensetype, amount, date } = req.body
  spreadsheet(name, classtype, expensetype, amount, date)
  res.sendStatus(200)
})


app.listen("8080", () => {
  console.log("Starting application on port: 8080")
})
