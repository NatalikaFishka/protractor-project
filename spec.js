const EC = protractor.ExpectedConditions;

describe('Test of delta.com with Protractor', () => {
  beforeEach(() => {
    browser.get('https://www.delta.com/');
    browser.manage().window().maximize();
    browser.waitForAngular();
    element.all(by.id('fsrFocusFirst'))
      .then((items) => {
        if (items.length) {
          element(by.id('fsrFocusFirst')).click();
        }
      })
  });

  it('Site should have a title', () => {
    expect(browser.getTitle()).toEqual('Airline Tickets & Flights: Book Direct with Delta Air Lines - Official Site');
  });

  it('Should search for Moscow airport and see SVO displayed as selected', () => {
    let fromAirport = element(by.id('fromAirportName'));
    fromAirport.click().then(() => {
      element(by.id('search_input')).sendKeys('Moscow').sendKeys(protractor.Key.ENTER)
        .then(() => expect(element(by.css('#fromAirportName .airport-code')).getText()).toEqual('SVO'));
    });
  });

  it('Should scroll down and click on "Can I cancel..." card', () => {
    browser.executeScript("document.querySelector('.section.cardcd').scrollIntoView()");
    element.all(by.css('.componentLink')).first().click()
      .then(() => expect(browser.getCurrentUrl()).toEqual('https://www.delta.com/us/en/travel-update-center/cancel-change-requirements'));
  });

  it('Search for cotonovirus info from popular topic', () => {
    element.all(by.linkText("Search")).first().click().then(() => element(by.linkText('Coronavirus')).click());
    browser.sleep(2000);
    element(by.css('.h1')).getText()
      .then((text) => expect(text.startsWith('Coronavirus')).toBeTruthy());
  });

  it('Should fail to login with invalid credentials and see error message', () => {
    element(by.css('.login-btn')).click();
    browser.sleep(2000);
    element(by.id('userId')).sendKeys('987465287');
    element(by.id('password')).sendKeys('MyBestPassword');
    element(by.css('.loginButton')).click();
    browser.wait(EC.visibilityOf(element(by.css('.overlayText'))), 5000)
      .then(() => element(by.css('.overlayText')).getText())
      .then((errorText) => expect(errorText.startsWith("Oops!")).toBeTruthy());
  });

  it('Switch to Russian and confirm it', () => {
    browser.executeScript("document.querySelector('#footer-language-selector').scrollIntoView()");
    element(by.id('footer-language-selector')).click();
    element(by.id('search_input')).sendKeys('Россия')
      .then(() => element(by.partialLinkText('Россия')).click());
    browser.wait(EC.urlIs('https://ru.delta.com/eu/ru'), 5000)
      .then((result) => expect(result).toBeTruthy());
  });
});
