const puppeteer = require("puppeteer");

const express = require("express");
const iPhone = puppeteer.KnownDevices["iPhone 6"];
const ipd = puppeteer.KnownDevices["iPad Pro"];
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post("/user1", async (req, res) => {
  const browser = await puppeteer.launch({
    // devtools: true,
    // headless: false,
    ignoreHTTPSErrors: true,
    defaultViewport: {
      width: 840,
      height: 1320,
      isMobile: true,
    },
  });

  const page = await browser.newPage();
  await page.emulate(iPhone);

  await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 1000);

  await page.goto(`https://instagram.com/virat.kohli`);
  await page.emulate(ipd);

  await page.screenshot({
    path: "screenshot.jpg",
  });
  console.log("firstlog");
  console.log("here1");
  try {
    await page.waitForSelector("._aagu");

    await page.click("._aagu");
    console.log("here2");
  } catch (error) {
    console.log("Account is private!");
    return { success: false, error: error.message };
  }

  let avgLikes = 0;
  let avgComments = 0;
  const likesSelector =
    "span.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.xt0psk2.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj span";
  // const likesSelector =
  //   ".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.xr1yuqi.xkrivgy.x4ii5y1.x1gryazu.x1n2onr6.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.x1a02dak.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1 > span > a > span > span";
  const commentsSelector =
    ".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x12nagc.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1 > a > span > span";

  await page.waitForSelector("._abl-");
  const posts = await page.$$("._aagw");
  await page.waitForTimeout(5000);
  console.log("0");
  console.log("-0");

  // await posts[posts.length - 1].click();
  await page.waitForTimeout(5000);
  console.log("1");
  await page.waitForSelector(likesSelector);
  console.log("2");

  try {
    console.log("3");

    avgLikes += await page.$eval(likesSelector, (elem) =>
      parseInt(elem.innerHTML.replaceAll(",", ""))
    );
    avgComments += await page.$eval(commentsSelector, (elem) =>
      parseInt(elem.innerHTML.replaceAll(",", ""))
    );
    console.log("likes ", avgLikes, "comms ", avgComments);
    await page.waitForTimeout(2000);
    await page.click("._abl-");

    for (let i = 0; i < 15; i++) {
      try {
        avgLikes += await page.$eval(likesSelector, (elem) =>
          parseInt(elem.innerHTML.replaceAll(",", ""))
        );
        avgComments += await page.$eval(commentsSelector, (elem) =>
          parseInt(elem.innerHTML.replaceAll(",", ""))
        );
        console.log("likes ", avgLikes, "comms ", avgComments);
        await page.$$eval("._abl-", (elem) => elem[1].click());
      } catch (error) {
        console.log("err occured");
        i++;
        continue;
      }
    }
    const getSocialMediaStats = async (selector) => {
      const elements = document.querySelectorAll(selector);
      return {
        posts: elements[0]?.innerText, // First element for "posts"
        following: elements[1]?.innerText, // Second element for "following"
        followers: elements[2]?.innerText, // Third element for "likes"
      };
    };
    const stats = await page.evaluate(
      getSocialMediaStats,
      "span.html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs"
    );

    data = {
      engagementRate: (avgLikes + avgComments) / 15,
      likesRate: avgLikes / 15,
      comments: avgComments / 15,
      posts: stats.posts,
      following: stats.following,
      followers: stats.followers,
    };

    res.json({ success: true, data: data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("running on port 3300");
});
