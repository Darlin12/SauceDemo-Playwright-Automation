/**
 * Registration is not idempotent: the site rejects an email that already
 * exists. Every run therefore needs its own address, which is what this
 * factory guarantees.
 */
const uniqueSuffix = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

/**
 * @param {object} overrides Fields to replace, e.g. `{ email: 'taken@x.com' }`.
 * @returns {object} A user ready to be registered.
 */
export function buildUser(overrides = {}) {
  const suffix = uniqueSuffix();

  return {
    name: `QA Tester ${suffix}`,
    email: `qa.tester.${suffix}@example.com`,
    password: 'Passw0rd!123',
    title: 'Mr',
    firstName: 'Pedro',
    lastName: 'Alvarez',
    company: 'QA Automation Lab',
    address: 'Av. Winston Churchill, #2',
    country: 'United States',
    state: 'Florida',
    city: 'Doral',
    zipCode: '11202',
    mobileNumber: '7773891200',
    dateOfBirth: { day: '11', month: 'January', year: '2002' },
    ...overrides,
  };
}
