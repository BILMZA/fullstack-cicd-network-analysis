const fetch = require("node-fetch");

async function testAPI() {
  try {
    const res = await fetch("http://localhost:5000");
    const text = await res.text();

    if (text.includes("Hello")) {
      console.log("PASS");
      process.exit(0);
    } else {
      console.log("FAIL");
      process.exit(1);
    }
  } catch (err) {
    console.log("ERROR", err);
    process.exit(1);
  }
}

testAPI();