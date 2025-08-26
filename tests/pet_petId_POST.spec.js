import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const PET_ID = 123;

const formUrlEncoded = new URLSearchParams({
  name: 'UpdatedDoggie',
  status: 'sold'
});

const badForm = new URLSearchParams({
  wrong_field: 'bad_value'
});

// -------------------- 1. FORM → JSON --------------------
test.describe(`/pet/${PET_ID} - POST FORM → JSON`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('200 FORM→JSON Request Payload:', requestPayload);
    const response = await request.post(`${baseURL}/pet/${PET_ID}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('200 FORM→JSON Response Body:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', 'UpdatedDoggie');
    expect(body).toHaveProperty('status', 'sold');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString();
    console.log('400 FORM→JSON Request Payload:', requestPayload);
    const response = await request.post(`${baseURL}/pet/${PET_ID}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('400 FORM→JSON Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('Default FORM→JSON Request Payload:', requestPayload);
    const response = await request.post(`${baseURL}/pet/${PET_ID}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Default FORM→JSON Response Body:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. FORM → XML --------------------
test.describe(`/pet/${PET_ID} - POST FORM → XML`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('200 FORM→XML Request Payload:', requestPayload);
    const response = await request.post(`${baseURL}/pet/${PET_ID}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('200 FORM→XML Response Body:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain('<name>UpdatedDoggie</name>');
    expect(text).toContain('<status>sold</status>');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString();
    console.log('400 FORM→XML Request Payload:', requestPayload);
    const response = await request.post(`${baseURL}/pet/${PET_ID}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('400 FORM→XML Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('Default FORM→XML Request Payload:', requestPayload);
    const response = await request.post(`${baseURL}/pet/${PET_ID}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    console.log('Default FORM→XML Response Body:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});
