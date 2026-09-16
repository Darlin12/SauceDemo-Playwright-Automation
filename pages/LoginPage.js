/** The /login page, which holds both the login form and the sign-up form. */
export class LoginPage {
  constructor(page) {
    this.page = page;

    const loginForm = page.locator('.login-form');
    const signupForm = page.locator('.signup-form');

    this.loginEmail = loginForm.locator('input[data-qa="login-email"]');
    this.loginPassword = loginForm.locator('input[data-qa="login-password"]');
    this.loginButton = loginForm.locator('button[data-qa="login-button"]');
    this.loginError = loginForm.locator('p[style="color: red;"]');

    this.signupForm = signupForm;
    this.signupName = signupForm.locator('input[data-qa="signup-name"]');
    this.signupEmail = signupForm.locator('input[data-qa="signup-email"]');
    this.signupButton = signupForm.locator('button[data-qa="signup-button"]');
    this.signupError = signupForm.locator('p[style="color: red;"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  /** Submits the "New User Signup!" form, which leads to /signup. */
  async startSignup(name, email) {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }
}
