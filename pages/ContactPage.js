/** The /contact_us page and its form. */
export class ContactPage {
  constructor(page) {
    this.page = page;

    this.title = page.getByRole('heading', { name: 'Get In Touch' });
    this.name = page.locator('input[data-qa="name"]');
    this.email = page.locator('input[data-qa="email"]');
    this.subject = page.locator('input[data-qa="subject"]');
    this.message = page.locator('#message');
    this.fileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('input[data-qa="submit-button"]');
    this.successMessage = page.locator('.status.alert-success');
  }

  async goto() {
    await this.page.goto('/contact_us');
  }

  async fillForm({ name, email, subject, message }) {
    await this.name.fill(name);
    await this.email.fill(email);
    await this.subject.fill(subject);
    await this.message.fill(message);
  }

  /**
   * Submitting raises a native confirm dialog. Playwright dismisses dialogs
   * automatically, which would cancel the submission, so it is accepted here.
   */
  async submit() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }
}
