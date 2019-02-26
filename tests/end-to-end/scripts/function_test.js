const path = require('path');
const should = require('chai').should();
const { expect } = require('chai');
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
let obj = JSON.parse(fs.readFileSync('./end-to-end/test_data/data.json', 'utf8'));



describe('Microarray function Test', function() {

    this.timeout(0);
    let driver,
        website;

    let clickOption = async function (selector, optionText, optionSelector=By.css('option')) {
        const selectInput = await driver.findElement(selector);
        const options = await selectInput.findElements(optionSelector);
        for (const option of options) {
            if (await option.getText() === optionText) {
                await option.click();
                break;
            }
        }
    };

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
            let analysisBtn =  await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
        	analysisBtn.click();
        } else {
            console.log("No TEST_WEBSITE set");
            this.skip();
        }
    });

    after(async function() {
        //driver.close();
    });

    it('Should be able to enter Accession Code and load data"', async function() {
    
        let input = await driver.findElement(By.id('input-access-code'));
        expect(input).to.exist;
        input.sendKeys(obj.accession_code)

        let loadBtn = await driver.findElement(By.id('btn-project-load-gse'));
        loadBtn.click();

        await driver.wait(until.elementLocated(By.id('gsm-select')), 60*1000);
        let numOfRecord  = await driver.findElement(By.id('gsm-select'));
        numOfRecord.getText().then(function(value){

        	expect(value).to.contain(obj.gsm_number_of_records)
        })


    });


     it('Should be able to manager group"', async function() {
    	
    	 let group_1 = await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[2]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/table/tbody/tr[1]/td[1]/span/label/span[1]/input'));
    	group_1.click();
    	let manageGroupBtn=  await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[2]/div[1]/div[1]/div[1]/button'));
    	manageGroupBtn.click();
    	 await driver.wait(until.elementLocated(By.xpath('//*[@id="input_group_name"]')), 10*1000);
    	let groupNameInput=  await driver.findElement(By.xpath('//*[@id="input_group_name"]'));
    	groupNameInput.sendKeys(obj.group_1);
    	let groupNameAddBtn=  await driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[1]/div[2]/div[1]/p[6]/label/button'));
    	groupNameAddBtn.click()
    	let groupManageCloseBtn= await  driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[1]/div[3]/button'));
    	groupManageCloseBtn.click()

    	await driver.wait(until.elementIsNotVisible(By.xpath('/html/body/div[6]/div/div[2]/div/div[1]')), 50*1000);
    	 await driver.wait(until.elementLocated(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[2]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/table/tbody/tr[2]/td[1]/span/label/span[1]/input')), 60*1000);
    	let group_2 = await  driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[2]/div[1]/div[2]/div[3]/div/div/div/div/div/div/div/table/tbody/tr[2]/td[1]/span/label/span[1]/input'));
    	group_2.click();
    	manageGroupBtn.click();
    	
   		groupNameInput= await  driver.findElement(By.xpath('//*[@id="input_group_name"]'));
    	groupNameInput.sendKeys(obj.group_2);
    	groupNameAddBtn= await  driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[1]/div[2]/div[1]/p[6]/label/button'));
    	groupNameAddBtn.click()
    	groupManageCloseBtn= await  driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[1]/div[3]/button'));
    	groupManageCloseBtn.click()

    });

     it('Should be able to select groups"', async function() {
    	
    	 await driver.wait(until.elementIsEnabled(By.id("select-group-1")), 10*1000);

    	 clickOption(By.id('select-group-1'), obj.group_1);

    	 clickOption(By.id('select-group-1'), obj.group_2);

    	 let runContrastBtn = await driver.findElement(By.id("btn-run-contrast"));
    	 runContrastBtn.isEnabled().then(function(value){
    	 	expect(value).to.equal(true)
    	 })
    });


     it('Should be able to submit job to queue"', async function() {
    	
     	 await driver.wait(until.elementIsEnabled(By.id("btn-run-contrast")), 10*1000);
     	 let ckBox = await driver.findElement(By.xpath('//*[@id="checkbox_queue"]/label/span[1]'));
        expect(ckBox).to.exist;
      	ckBox.getAttribute("class").then(
      		function(value){
      			if(value!="ant-checkbox ant-checkbox-checked"){
      				ckBox.click()
      			}
      		})

     	  let runContrastBtn = await driver.findElement(By.id("btn-run-contrast"));
     	  runContrastBtn.click()

     	   await driver.wait(until.elementLocated(By.id("rcDialogTitle1")), 10*1000);
     	   let modalClose = await driver.findElement(By.xpath("/html/body/div[7]/div/div[2]/div/div[1]/div[3]/button"))
     	    modalClose.click()
     	    await driver.wait(until.elementNotVisible(By.id("rcDialogTitle1")), 10*1000);
    });


      it('Should be able to run contrast locally"', async function() {
    	
    	 await driver.wait(until.elementIsEnabled(By.id("btn-run-contrast")), 10*1000);

 		let ckBox = await  driver.findElement(By.xpath('//*[@id="checkbox_queue"]/label/span[1]'));
        expect(ckBox).to.exist;
      	ckBox.getAttribute("class").then(
      		function(value){
      			if(value=="ant-checkbox ant-checkbox-checked"){
      				ckBox.click()
      			}
      		})

    	 let runContrastBtn = await driver.findElement(By.id("btn-run-contrast"));
     	  runContrastBtn.click()
     	   
     	   await driver.wait(until.elementIsNotVisible(By.xpath('//*[@id="tab_analysis"]/div[1]/div[1]')), 5*60*1000);
    });
	
	
});

