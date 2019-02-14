const puppeteer = require('puppeteer');

(async() => {
  let data = ['age', 'word', 'number'];
  // let root = 'https://image.baidu.com/'
  let root = 'http://dict.cn/'

  let {browser, page} = await init(root)
  for (let i = 0; i < data.length; i++) {
    console.log(data[i])
    await getWord(page, data[i])
  }
  // await browser.close()

})()

async function init(root) {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto(root, { waitUntil: 'networkidle2' })
  console.log('page go to ' + root + '   ......')
  return { browser, page }
}

function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {resolve()}, 1000)
  })
}
// 获取近义词
async function getWord(page, target) {
  await sleep()
  await page.focus('#q')
  await page.keyboard.type(target, {delay: 100})
  await page.click('#search')
  console.log(chalk.green('go to search list'))

  page.on('load', async () => {
    console.log('page loading done, start fetch...');
    const wordsCounts = await page.$$eval('.rel .nfo li a', words => words.map(i => i.text.trim()))
    console.log(wordsCounts)
    await page.keyboard.press('Backspace')
  })
}
