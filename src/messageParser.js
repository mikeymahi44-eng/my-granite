function parseMessage(messageBody) {
  const text = (messageBody || "").trim();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const fields = {};
  const notes = [];

  for (const line of lines) {
    const match = line.match(/^([^:=-]+)\s*[:=-]\s*(.+)$/);
    if (match) {
      const key = normalizeKey(match[1]);
      fields[key] = match[2].trim();
    } else {
      notes.push(line);
    }
  }

  return {
    name: fields.name || fields.employee || fields.sender || "",
    date: fields.date || new Date().toISOString().slice(0, 10),
    category: fields.category || fields.type || fields.subject || "",
    amount: fields.amount || fields.qty || fields.quantity || "",
    status: fields.status || "",
    notes: fields.notes || fields.note || notes.join(" "),
    rawMessage: text
  };
}

function normalizeKey(key) {
  return key.toLowerCase().replace(/\s+/g, "_");
}

module.exports = {
  parseMessage
};
