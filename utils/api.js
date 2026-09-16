import { expect } from '@playwright/test';

/**
 * Helpers for the site's public API, used to create and remove the accounts
 * the tests need. Doing this over HTTP keeps the UI tests focused on the
 * behaviour they actually verify.
 *
 * The API answers HTTP 200 and reports the real outcome in a JSON body served
 * as `text/html`, so the payload is parsed by hand.
 */
export async function createAccount(request, user) {
  const response = await request.post('/api/createAccount', {
    form: {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.dateOfBirth.day,
      birth_month: user.dateOfBirth.month,
      birth_year: user.dateOfBirth.year,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address,
      address2: '',
      country: user.country,
      zipcode: user.zipCode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobileNumber,
    },
  });

  const payload = JSON.parse(await response.text());
  expect(payload.responseCode).toBe(201);
  return user;
}

export async function deleteAccount(request, user) {
  await request.delete('/api/deleteAccount', {
    form: { email: user.email, password: user.password },
  });
}
