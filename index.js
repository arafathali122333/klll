const app = require("express")();

let chrome = {};
let puppeteer;

const delay = time => {
	return new Promise(function(resolve) { 
		setTimeout(resolve, time)
	});
}

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();
    await page.goto("https://translate.google.co.in");
    await delay(2000);
	await page.keyboard.type("hi");
  await delay(1000);
    let yy = await page.$$('.zQ0atf');
	await yy[1].click();
	await delay(1500);
	await page.keyboard.type("tamil");
	await delay(1500);
	await page.keyboard.press("Enter");
	await delay(5000);
	let rr = await page.$$('.ryNqvb');
	let value = await page.evaluate(el => el.textContent, rr[0]);
    res.send(value);
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;