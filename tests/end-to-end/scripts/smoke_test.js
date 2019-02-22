const path = require('path');
const should = require('chai').should();
const { expect } = require('chai');
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');


describe('Microarray Smoke Test -About Page', function() {

    this.timeout(0);
    let driver,
        website;
    before(async function() {
        const url = process.env.TEST_WEBSITE;
        if (url) {
            driver = await new Builder()
                .forBrowser('firefox')
                //.setFirefoxOptions(new firefox.Options().headless())
                .build();

 //let driver = new Builder().forBrowser('firefox').build();
            website = url;
            await driver.get(website);
            await driver.wait(until.elementLocated(By.xpath('//*[@id="tab_about"]/div/section/div/h3[2]')), 20000);
        } else {
            console.log("No TEST_WEBSITE set");
            this.skip();
        }
    });

    after(async function() {
        driver.close();
    });

    it('Should have title "CCBR Microarray Analysis Workflow"', async function() {
        const title = await driver.getTitle();
        expect(title).is.equal('CCBR Microarray Analysis Workflow');
    });

    it('Should have navigation bar', async function() {
        const nav = await driver.findElement(By.id('header-navbar'));
        expect(nav).to.exist;
    });

});



describe('Microarray Smoke Test -Analysis Page', function() {

    this.timeout(0);
    let driver,
        website;
    before(async function() {
        const url = process.env.TEST_WEBSITE;
        if (url) {
            driver = await new Builder()
                .forBrowser('firefox')
                //.setFirefoxOptions(new firefox.Options().headless())
                .build();

 //let driver = new Builder().forBrowser('firefox').build();
            website = url;
            await driver.get(website);
            await driver.wait(until.elementLocated(By.xpath('//*[@id="tab_about"]/div/section/div/h3[2]')), 20000);
        } else {
            console.log("No TEST_WEBSITE set");
            this.skip();
        }
    });

    after(async function() {
        driver.close();
    });

    it('Should have title "CCBR Microarray Analysis Workflow"', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const result = await driver.findElement(By.id('input-access-code'));
        expect(result).to.exist;
    });

    it('Should Run Contrast Btn diabled', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const result = await driver.findElement(By.id('btn-run-contrast'));
        expect(result).to.exist;
        result.isEnabled().then(function(value){
        	expect(value).to.equal(false)
        })
    });

    it('Should Tab Pre-Normalization diabled', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const preNormal = await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[1]/div/div/div/div/div[1]/div[2]'));
        expect(preNormal).to.exist;
        preNormal.getAttribute("aria-disabled").then(function(value){
        	expect(value).to.equal("true")
        })
    });


    it('Should Tab Post-Normalization diabled', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const postNormal = await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[1]/div/div/div/div/div[1]/div[3]'));
        expect(postNormal).to.exist;
        postNormal.getAttribute("aria-disabled").then(function(value){
        	expect(value).to.equal("true")
        })

    });


it('Should Tab DEG diabled', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const deg = await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[1]/div/div/div/div/div[1]/div[4]'));
        expect(deg).to.exist;
        deg.getAttribute("aria-disabled").then(function(value){
        	expect(value).to.equal("true")
        })
    });


it('Should Tab SSGSEA diabled', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const ssgsea = await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[1]/div/div/div/div/div[1]/div[5]'));
        expect(ssgsea).to.exist;
        ssgsea.getAttribute("aria-disabled").then(function(value){
        	expect(value).to.equal("true")
        })
    });

it('Should Tab GSM enabled', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const gsm = await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[1]/div/div/div/div/div[1]/div[1]'));
        expect(gsm).to.exist;
        gsm.getAttribute("aria-disabled").then(function(value){
        	expect(value).to.equal("false")
        })
    });


it('Should submit a job to queue checked', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        let ckBox = await driver.findElement(By.xpath('//*[@id="checkbox_queue"]/label/span[1]'));
        expect(ckBox).to.exist;
      	ckBox.getAttribute("class").then(
      		function(value){
      			expect(value).to.equal("ant-checkbox ant-checkbox-checked")
      		})
    });

it('Should group selection diabled', async function() {
        const analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        analysisBtn.click();
        const select1 = await driver.findElement(By.id('select-group-1'));
        expect(select1).to.exist;
        select1.isEnabled().then(function(value){
        	expect(value).to.equal(false)
        })
        const select1 = await driver.findElement(By.id('select-group-2'));
        expect(select1).to.exist;
        select1.isEnabled().then(function(value){
        	expect(value).to.equal(false)
        })
    });
	
});


