const EC = protractor.ExpectedConditions;

describe('Test of delta.com with Protractor', () => {
  beforeEach(() => {
    browser.get('https://www.delta.com/');
    browser.manage().window().maximize();
    browser.waitForAngular()
      .then(() => element.all(by.id('fsrFocusFirst')))
      .then((items) => {
        if (items.length) {
          element(by.id('fsrFocusFirst')).click();
        }
      })
      .then(() => element.all(by.css('button.cookie-close-icon')))
      .then((items) => {
        if (items.length) {
          element(by.css('button.cookie-close-icon')).click();
        }
      })
  });

  afterEach(() => {
    browser.executeScript('window.localStorage.clear();');
    browser.executeScript('window.sessionStorage.clear();');
    browser.driver.manage().deleteAllCookies();
  });

  it('Site should have correct title', () => {
    expect(browser.getTitle()).toEqual('Airline Tickets & Flights: Book Direct with Delta Air Lines - Official Site');
  });

  it('Should search for Moscow airport and see SVO displayed as selected', () => {
    element(by.id('fromAirportName')).click().then(() => {
      element(by.id('search_input')).sendKeys('Moscow').sendKeys(protractor.Key.ENTER)
        .then(() => expect(element(by.css('#fromAirportName .airport-code')).getText()).toEqual('SVO'));
    });
  });

  it('Select passengers option from drop-down', () => {
    element(by.id('passengers-val')).click()
      .then(() => browser.wait(element(by.id('passengers-desc')).isDisplayed()))
      .then(() => element.all(by.css('#passengers-desc .select-ui-optionList')))
      .then((options) => {
        let optionToPick = Math.floor(Math.random() * Math.floor(options.length));
        options[optionToPick].click();
        return options[optionToPick].getText();
      })
      .then((expectedText) => expect(element(by.id('passengers-val')).getText()).toEqual(expectedText))
  });

  it('Should scroll down and click on "Can I cancel..." card', () => {
    browser.executeScript("document.querySelector('.section.cardcd').scrollIntoView()");
    element.all(by.css('.componentLink')).first().click()
      .then(() => expect(browser.getCurrentUrl()).toEqual('https://www.delta.com/us/en/travel-update-center/cancel-change-requirements'));
  });

  it('Search for cotonovirus info from popular topic', () => {
    element.all(by.linkText("Search")).first().click()
      .then(() => element(by.linkText('Coronavirus')).click())
      .then(() => browser.waitForAngularEnabled(false))
      .then(() => browser.wait(EC.visibilityOf(element.all(by.css('.h1')).first()), 5000))
      .then(() => element.all(by.css('.h1')).first().getText())
      .then((text) => expect(text.startsWith('Coronavirus')).toBeTruthy())
  });

  it('Should fail to login with invalid credentials and see error message', () => {
    element(by.css('.login-btn')).click()
      .then(() => browser.wait(EC.visibilityOf(element(by.id('userId'))), 5000))
      .then(() => {
        element(by.id('userId')).sendKeys('987465287');
        element(by.id('password')).sendKeys('MyBestPassword');
      })
      .then(() => element(by.css('.loginButton')).click())
      .then(() => browser.wait(EC.visibilityOf(element(by.css('.overlayText'))), 5000))
      .then(() => element(by.css('.overlayText')).getText())
      .then((errorText) => expect(errorText.startsWith("Oops!")).toBeTruthy());
  });

  it('Switch to Russian and confirm it', () => {
    browser.executeScript("document.querySelector('#footer-language-selector').scrollIntoView()")
    browser.wait(() => element(by.id('footer-language-selector')).isDisplayed(), 5000)
      .then(() => element(by.id('footer-language-selector')).click())
      .then(() => browser.wait(EC.visibilityOf(element(by.id('search_input')))))
      .then(() => element(by.id('search_input')).sendKeys('Россия'))
      .then(() => element(by.partialLinkText('Россия')).click())
      .then(() => browser.wait(EC.urlIs('https://ru.delta.com/eu/ru'), 5000))
      .then((result) => expect(result).toBeTruthy());
  });

  it('Go to Facebook and switch back', () => {
    browser.executeScript("document.querySelector('#footer-facebook').scrollIntoView()")
      .then(() => element(by.id('footer-facebook')).click())
      .then(() => browser.wait(EC.visibilityOf(element(by.partialLinkText('YES,')))), 5000)
      .then(() => element(by.partialLinkText('YES,')).click())
      .then(() => browser.wait(() => browser.getAllWindowHandles().then((res) => res.length === 2), 5000))
      .then(() => browser.getAllWindowHandles())
      .then((hendlers) => browser.switchTo().window(hendlers[1]))
      .then(() => browser.waitForAngularEnabled(false))
      .then(() => browser.getCurrentUrl())
      .then((result) => expect(result).toEqual('https://www.facebook.com/delta'))
      .then(() => browser.getAllWindowHandles())
      .then((hendlers) => browser.switchTo().window(hendlers[0]))
      .then(() => browser.getCurrentUrl())
      .then((result) => expect(result).toEqual('https://www.delta.com/'))
  });
});
