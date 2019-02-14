const puppeteer = require('puppeteer');
const { savePath } = require('../config/default.config');
const srcToImg = require('./srcToImg');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.log('go to https://image.baidu.com/');

  await page.setViewport({
    width: 1920,
    height: 1080
  })
  console.log('reset viewport');

  // await page.focus('#kw');
  // await page.keyboard.sendCharacter('狗');
  // await page.click('.s_btn')
  await page.focus('#kw');
  await page.keyboard.sendCharacter('狗');;
  await page.click('.s_search');
  console.log('go to search list');

  page.on('load', async () => {
    console.log('page load done, start fetch');

    // evaluate
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img');
      console.log('获取完成')
      return Array.prototype.map.call(images, img => img.src);
    })

    console.log(`get ${srcs.length} images, start download`);

    srcs.forEach(async src => {
      // console.log(src)
      await srcToImg(src, savePath);
    })
    // $$eval
    // const imgsCounts = await page.$$eval('img.main_img', imgs => imgs.map(i => i.src))
    

  });
 

  

  // await browser.close();
})();
