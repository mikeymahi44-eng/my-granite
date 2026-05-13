const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const HEADERS = [
  "Received At",
  "WhatsApp Number",
  "Name",
  "Date",
  "Category",
  "Amount / Quantity",
  "Status",
  "Notes",
  "Raw Message"
];

async function appendRecord(filePath, record) {
  const resolvedPath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  if (fs.existsSync(resolvedPath)) {
    await workbook.xlsx.readFile(resolvedPath);
    worksheet = workbook.getWorksheet("Daily Information");
  }

  if (!worksheet) {
    worksheet = workbook.addWorksheet("Daily Information");
    worksheet.addRow(HEADERS);
    worksheet.getRow(1).font = { bold: true };
    worksheet.columns = [
      { width: 22 },
      { width: 20 },
      { width: 20 },
      { width: 14 },
      { width: 20 },
      { width: 18 },
      { width: 16 },
      { width: 35 },
      { width: 50 }
    ];
  }

  worksheet.addRow([
    record.receivedAt,
    record.from,
    record.name,
    record.date,
    record.category,
    record.amount,
    record.status,
    record.notes,
    record.rawMessage
  ]);

  await workbook.xlsx.writeFile(resolvedPath);
}

module.exports = {
  appendRecord
};
