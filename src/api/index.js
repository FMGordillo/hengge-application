import lowdb from "lowdb";
import { subDays, subYears } from "date-fns";
import Memory from "lowdb/adapters/Memory";

const db = lowdb(new Memory());
db.defaults({
  emails: [
    {
      from: "aaa@example.com",
      to: "zzz.zzz@example.com",
      subject: "[ HR-888 ] Notice of official announcement",
      hasAttachments: true,
      date: new Date()
    },
    {
      from: "bbb.bbb@example.com",
      to: "yyy@example.com",
      subject: '[web-333] "Web Contact"',
      hasAttachments: false,
      date: subDays(new Date(), 3)
    },
    {
      from: "bbb.bbb@example.com",
      to: "yyy@example.com",
      subject:
        'A really longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong subject"',
      hasAttachments: false,
      date: subDays(new Date(), 3)
    },
    {
      from: "bbb.bbb@example.com",
      to: "yyy@example.com",
      subject: "A past event",
      hasAttachments: false,
      date: subYears(new Date(), 2)
    }
  ]
}).write();

function testDb() {
  const result = db
    .get("emails")
    .orderBy("date", "desc")
    .value();
  return result;
}

function getMail(id) {
  const result = db.get("emails");
}

export { testDb };
