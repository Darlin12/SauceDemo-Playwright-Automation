/** The /signup page: the account information form. */
export class SignupPage {
  constructor(page) {
    this.page = page;

    this.titleMr = page.locator('#id_gender1');
    this.name = page.locator('input[data-qa="name"]');
    this.email = page.locator('input[data-qa="email"]');
    this.password = page.locator('input[data-qa="password"]');
    this.days = page.locator('select[data-qa="days"]');
    this.months = page.locator('select[data-qa="months"]');
    this.years = page.locator('select[data-qa="years"]');
    this.firstName = page.locator('input[data-qa="first_name"]');
    this.lastName = page.locator('input[data-qa="last_name"]');
    this.address = page.locator('input[data-qa="address"]');
    this.country = page.locator('select[data-qa="country"]');
    this.state = page.locator('input[data-qa="state"]');
    this.city = page.locator('input[data-qa="city"]');
    this.zipCode = page.locator('input[data-qa="zipcode"]');
    this.mobileNumber = page.locator('input[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');

    this.accountCreatedTitle = page.locator('h2[data-qa="account-created"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
  }

  /** Fills every required field and submits the form. */
  async createAccount(user) {
    await this.titleMr.check();
    await this.password.fill(user.password);
    await this.days.selectOption(user.dateOfBirth.day);
    await this.months.selectOption(user.dateOfBirth.month);
    await this.years.selectOption(user.dateOfBirth.year);
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.address.fill(user.address);
    await this.country.selectOption(user.country);
    await this.state.fill(user.state);
    await this.city.fill(user.city);
    await this.zipCode.fill(user.zipCode);
    await this.mobileNumber.fill(user.mobileNumber);
    await this.createAccountButton.click();
  }

  async continueAfterCreation() {
    await this.continueButton.click();
  }
}
