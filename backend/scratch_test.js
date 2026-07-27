const db = require("./config/db");

async function test() {
  try {
    const [members] = await db.query("SELECT birth_date FROM members LIMIT 1");
    if (members.length > 0) {
      console.log("Birth Date:", members[0].birth_date);
      console.log("Type:", typeof members[0].birth_date);
      console.log("Instance of Date?", members[0].birth_date instanceof Date);

      const bdayDate = new Date(members[0].birth_date);
      console.log("bdayDate.getDate():", bdayDate.getDate());
      console.log("bdayDate.getMonth():", bdayDate.getMonth());
    } else {
      console.log("No members found.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
test();
