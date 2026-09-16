/** The home page: session state and the footer subscription form. */
export class HomePage {
  constructor(page) {
    this.page = page;

    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.loggedInAs = page.locator('li', { hasText: 'Logged in as' });

    this.subscriptionTitle = page.getByRole('heading', { name: 'Subscription' });
    this.subscriptionEmail = page.locator('#susbscribe_email');
    this.subscriptionButton = page.locator('#subscribe');
    this.subscriptionSuccess = page.locator('.alert-success');
  }

  async goto() {
    await this.page.goto('/');
  }

  async logout() {
    await this.logoutLink.click();
  }

  async subscribe(email) {
    await this.subscriptionEmail.fill(email);
    await this.subscriptionButton.click();
  }
}
