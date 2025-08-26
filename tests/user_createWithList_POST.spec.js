import { expect } from '@playwright/test';
import { test } from '../fixtures/apiWithAllure';

const exampleUserListJson = [
  {
    id: 1,
    username: 'testUser1',
    firstName: 'Test',
    lastName: 'UserOne',
    email: 'test1@example.com',
    password: 'password1',
    phone: '111-222-3333',
    userStatus: 1
  },
  {
    id: 2,
    username: 'testUser2',
    firstName: 'Another',
    lastName: 'UserTwo',
    email: 'test2@example.com',
    password: 'password2',
    phone: '444-555-6666',
    userStatus: 1
  }
];

const invalidUserListJson = [
  {
    id: 'invalid-id',
    username: '',
    firstName: 'Invalid',
    lastName: 'User',
    email: 'invalid-email',
    password: '',
    phone: 'invalid-phone',
    userStatus: 'not-an-integer'
  }
];

// Example for a single User object as per 200 application/xml response schema
const exampleUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>10</id>
  <username>theUser</username>
  <firstName>John</firstName>
  <lastName>James</lastName>
  <email>john@email.com</email>
  <password>12345</password>
  <phone>12345</phone>
  <userStatus>1</userStatus>
</User>`;

// -------------------- 1. application/json (Request) → application/json (Response) --------------------
test.describe('/user/createWithList - POST application/json → application/json', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Request Payload:', requestPayload);
    console.log('200 JSON→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('username');
    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('lastName');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('password');
    expect(body).toHaveProperty('phone');
    expect(body).toHaveProperty('userStatus');
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Request Payload:', requestPayload);
    console.log('Default JSON→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. application/json (Request) → application/xml (Response) --------------------
test.describe('/user/createWithList - POST application/json → application/xml', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Request Payload:', requestPayload);
    console.log('200 JSON→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain('<id>');
    expect(text).toContain('<username>');
    expect(text).toContain('<firstName>');
    expect(text).toContain('<lastName>');
    expect(text).toContain('<email>');
    expect(text).toContain('<password>');
    expect(text).toContain('<phone>');
    expect(text).toContain('<userStatus>');
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Request Payload:', requestPayload);
    console.log('Default JSON→XML:', text);
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});
