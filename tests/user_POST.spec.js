import { expect } from '@playwright/test';
import { test } from '../fixtures/apiWithAllure';

const exampleUserJson = {
  id: 1,
  username: "testUser",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  password: "password123",
  phone: "123-456-7890",
  userStatus: 1
};

const exampleUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>1</id>
  <username>testUser</username>
  <firstName>Test</firstName>
  <lastName>User</lastName>
  <email>test@example.com</email>
  <password>password123</password>
  <phone>123-456-7890</phone>
  <userStatus>1</userStatus>
</User>`;

const exampleUserFormUrlEncoded = new URLSearchParams({
  id: '1',
  username: 'testUser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'password123',
  phone: '123-456-7890',
  userStatus: '1'
});

const defaultErrorTriggerJson = { invalid: 'payload' };
const defaultErrorTriggerXml = ` < invalid > < data / > < / invalid > `;
const defaultErrorTriggerForm = new URLSearchParams({ wrong: 'data' });

// -------------------- 1. JSON (Request) → JSON (Response) --------------------
test.describe('/user - POST JSON → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson;
    console.log('Request Payload 200 JSON→JSON:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Response Body 200 JSON→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', exampleUserJson.id);
    expect(body).toHaveProperty('username', exampleUserJson.username);
    expect(body).toHaveProperty('email', exampleUserJson.email);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorTriggerJson;
    console.log('Request Payload Default JSON→JSON:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Response Body Default JSON→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. JSON (Request) → XML (Response) --------------------
test.describe('/user - POST JSON → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson;
    console.log('Request Payload 200 JSON→XML:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Response Body 200 JSON→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain(`<username>${exampleUserJson.username}</username>`);
    expect(text).toContain(`<email>${exampleUserJson.email}</email>`);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorTriggerJson;
    console.log('Request Payload Default JSON→XML:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Response Body Default JSON→XML:', text);
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});

// -------------------- 3. XML (Request) → JSON (Response) --------------------
test.describe('/user - POST XML → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml;
    console.log('Request Payload 200 XML→JSON:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Response Body 200 XML→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('username', 'testUser');
    expect(body).toHaveProperty('email', 'test@example.com');
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorTriggerXml;
    console.log('Request Payload Default XML→JSON:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Response Body Default XML→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 4. XML (Request) → XML (Response) --------------------
test.describe('/user - POST XML → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml;
    console.log('Request Payload 200 XML→XML:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Response Body 200 XML→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain(`<username>testUser</username>`);
    expect(text).toContain(`<email>test@example.com</email>`);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorTriggerXml;
    console.log('Request Payload Default XML→XML:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Response Body Default XML→XML:', text);
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});

// -------------------- 5. FORM (Request) → JSON (Response) --------------------
test.describe('/user - POST FORM → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserFormUrlEncoded.toString();
    console.log('Request Payload 200 FORM→JSON:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Response Body 200 FORM→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('username', 'testUser');
    expect(body).toHaveProperty('email', 'test@example.com');
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorTriggerForm.toString();
    console.log('Request Payload Default FORM→JSON:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Response Body Default FORM→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 6. FORM (Request) → XML (Response) --------------------
test.describe('/user - POST FORM → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserFormUrlEncoded.toString();
    console.log('Request Payload 200 FORM→XML:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Response Body 200 FORM→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain(`<username>testUser</username>`);
    expect(text).toContain(`<email>test@example.com</email>`);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorTriggerForm.toString();
    console.log('Request Payload Default FORM→XML:', requestPayload);
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Response Body Default FORM→XML:', text);
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});
