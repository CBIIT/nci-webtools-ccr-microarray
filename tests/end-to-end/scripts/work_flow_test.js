const path = require('path');
const should = require('chai').should();
const { expect } = require('chai');
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
let config = JSON.parse(fs.readFileSync('./test_data/data.json', 'utf8'));



describe('Microarray Work Flow Test', function() {

    this.timeout(0);
    let driver,
        website;

    let clickOption = async function(selector, optionText, optionSelector = By.css('option')) {
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
                .setFirefoxOptions(new firefox.Options().headless())
                .build();

            //let driver = new Builder().forBrowser('firefox').build();
            website = url;
            await driver.get(website);
            await driver.wait(until.elementLocated(By.xpath('//*[@id="tab_about"]/div/section/div/h3[2]')), 20000);
            let analysisBtn = await driver.findElement(By.xpath('//*[@id="li-analysis"]/a'));
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


        // get access code input
        let input = await driver.findElement(By.id('input-access-code'));
        expect(input).to.exist;

        // type accession code
        input.sendKeys(config.accession_code)

        // click load button
        let loadBtn = await driver.findElement(By.id('btn-project-load-gse'));
        loadBtn.click();

        // wait loading to be complete
        await driver.wait(until.elementLocated(By.id('gsm-select')), 60 * 1000);

        // verify unber of gsm loaded
        let numOfRecord = await driver.findElement(By.id('gsm-select'));
        numOfRecord.getText().then(function(value) {

            expect(value).to.contain(config.gsm_number_of_records)
        })


    });


    it('Should be able to manage group"', async function() {

        // click first element as group 1
        let group_1 = await driver.findElement(By.xpath("/html/body/div[2]/div/div/div/div[2]/div[3]/div[1]/div[3]/div/div[3]/div[1]/div[3]/div[3]/div/div/div/div/div/div/div/table/tbody/tr[1]/td[1]/span/label/span/input"));
        group_1.click();


        // open manage group modal
        let manageGroupBtn = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div/div[2]/div[3]/div[1]/div[3]/div/div[3]/div[1]/div[2]/div[1]/button'));
        manageGroupBtn.click();

        // wait modal open 
        await driver.wait(until.elementLocated(By.xpath('//*[@id="input_group_name"]')), 20 * 1000);

        // type group name
        let groupNameInput = await driver.findElement(By.xpath('//*[@id="input_group_name"]'));
        groupNameInput.sendKeys(config.group_1);

        // click add btn
        let groupNameAddBtn = await driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[2]/div[2]/div[1]/p[6]/label/button'));
        groupNameAddBtn.click()


        // close modal 
        let groupManageCloseBtn = await driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[2]/div[3]/button'));
        groupManageCloseBtn.click()

        // wait modal close
        let el = driver.findElement(By.xpath('//*[@id="rcDialogTitle0"]'));
        await driver.wait(until.elementIsNotVisible(el), 50 * 1000);

        // check if second element in the datatable exist
        await driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div/div/div/div[2]/div[3]/div[1]/div[3]/div/div[3]/div[1]/div[3]/div[3]/div/div/div/div/div/div/div/table/tbody/tr[2]/td[1]/span/label/span/input')), 20 * 1000);


        // click 2rd element as group 1
        let group_2 = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div/div[2]/div[3]/div[1]/div[3]/div/div[3]/div[1]/div[3]/div[3]/div/div/div/div/div/div/div/table/tbody/tr[2]/td[1]/span/label/span/input'));
        group_2.click();


        // open manage group modal
        manageGroupBtn = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div/div[2]/div[3]/div[1]/div[3]/div/div[3]/div[1]/div[2]/div[1]/button'));
        manageGroupBtn.click();

        // type group name
        groupNameInput = await driver.findElement(By.xpath('//*[@id="input_group_name"]'));
        groupNameInput.sendKeys(config.group_2);

        // click add btn
        groupNameAddBtn = await driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[2]/div[2]/div[1]/p[6]/label/button'));
        groupNameAddBtn.click()

        // close modal 
        groupManageCloseBtn = await driver.findElement(By.xpath('/html/body/div[6]/div/div[2]/div/div[2]/div[3]/button'));
        groupManageCloseBtn.click()

    });

    it('Should be able to select groups"', async function() {

        // wait group selection option to be enable
        let el = await driver.findElement(By.id("select-group-1"));
        await driver.wait(until.elementIsEnabled(el), 20 * 1000);


        // select group 1
        clickOption(By.id('select-group-1'), config.group_1);
        // select group 2
        clickOption(By.id('select-group-2'), config.group_2);

        // check if run contrast btn has been enabled
        let runContrastBtn = await driver.findElement(By.id("btn-run-contrast"));

        await driver.wait(until.elementIsEnabled(runContrastBtn), 20 * 1000);
        runContrastBtn.isEnabled().then(function(value) {
            expect(value).to.equal(true)
        })

    });


    it('Should be able to submit job to queue"', async function() {
        // make sure  run contrast btn is enabled
        let el = await driver.findElement(By.id("btn-run-contrast"));
        await driver.wait(until.elementIsEnabled(el), 10 * 1000);
        // make sure add to queue  checkbox checked
        let ckBox = await driver.findElement(By.xpath('//*[@id="checkbox_queue"]/label/span[1]'));
        expect(ckBox).to.exist;
        ckBox.getAttribute("class").then(
            function(value) {
                if (value != "ant-checkbox ant-checkbox-checked") {
                    ckBox.click()
                }
            })

        // type email 
        let email = await driver.findElement(By.xpath('//*[@id="input-email"]'));
        email.sendKeys(config.email);
        // click run contrast
        let runContrastBtn = await driver.findElement(By.id("btn-run-contrast"));
        runContrastBtn.click();

        //close popup modal
        await driver.wait(until.elementLocated(By.xpath('//*[@id="rcDialogTitle1"]')), 20 * 1000);
        let modalClose = await driver.findElement(By.xpath("/html/body/div[7]/div/div[2]/div/div[2]/div[3]/button"))
        modalClose.click();
        el = driver.findElement(By.xpath('//*[@id="rcDialogTitle1"]'));
        await driver.wait(until.elementIsNotVisible(el), 10 * 1000);
    });


    it('Should be able to run contrast locally"', async function() {

        let el = driver.findElement(By.xpath('//*[@id="rcDialogTitle1"]'));
        await driver.wait(until.elementIsNotVisible(el), 10 * 1000);

        // make sure  run contrast btn is enabled
        el = await driver.findElement(By.id("btn-run-contrast"));
        await driver.wait(until.elementIsEnabled(el), 10 * 1000);
        // make sure add to queue  checkbox unchecked
        let ckBox = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div/div[2]/div[3]/div[1]/div[1]/div/div[2]/div[2]/div[1]/label/span[1]'));
        expect(ckBox).to.exist;
        ckBox.getAttribute("class").then(
            function(value) {
                console.log(value)
                // uncheck the send to queue checkbox
                if (value == "ant-checkbox ant-checkbox-checked") {
                    let ckBox2 = driver.findElement(By.xpath('//*[@id="select0"]'));
                    ckBox2.click();
                }
                // click run contrast
                let runContrastBtn = driver.findElement(By.id("btn-run-contrast"));
                runContrastBtn.click();
            });
        await driver.sleep(2000);
        // wait untill the run contrast finished
        el =await driver.findElement(By.xpath('/html/body/div[2]/div/div/div/div[2]/div[3]/div[2]/div'));
        await driver.wait(until.elementIsNotVisible(el), 10*60 * 1000);

    });

     it('Should be able to hide the menu and see the datatable"', async function() {
        
        let el =await driver.findElement(By.xpath('//*[@id="btn-controll-data-table-display"]/a[1]'));
        await driver.wait(until.elementIsNotVisible(el), 10 * 1000);
        let tab =await driver.findElement(By.xpath('//*[@id="tab_analysis"]/div[1]/div[3]/div/div[1]/div/div/div/div/div[1]/div[3]'));
         expect(tab).to.exist;
        tab.getAttribute("aria-disabled").then(function(value){
            expect(value).to.contain('false')
        })
    });

    after(async function() {
        driver.close();
    });

});