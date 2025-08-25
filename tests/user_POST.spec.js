import { expect } from '@playwright/test';
import { test } from '../fixtures/apiWithAllure';

const exampleUserJson = {
  id: 10,
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: 1
};

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

const exampleUserForm = new URLSearchParams({
  id: '10',
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: '1'
});

const invalidUserJson = { wrongField: 'value' };
const invalidUserXml = ` <InvalidUser><wrongField>value</wrongField></InvalidUser> `;
const invalidUserForm = new URLSearchParams({ wrongField: 'value' });

const validationUserJson = { username: '', email: '' };
const validationUserXml = ` <User><username></username><email></email></User> `;
const validationUserForm = new URLSearchParams({ username: '', email: '' });

// -------------------- 1. JSON → JSON --------------------
test.describe('/user - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: exampleUserJson
    });
    const body = await response.json();
    console.log('200 JSON→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('username', 'theUser');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: invalidUserJson
    });
    console.log('400 JSON→JSON:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: validationUserJson
    });
    console.log('422 JSON→JSON:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: invalidUserJson
    });
    const body = await response.json();
    console.log('Default JSON→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. JSON → XML --------------------
test.describe('/user - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: exampleUserJson
    });
    const text = await response.text();
    console.log('200 JSON→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain('<username>theUser</username>');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: invalidUserJson
    });
    console.log('400 JSON→XML:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: validationUserJson
    });
    console.log('422 JSON→XML:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: invalidUserJson
    });
    console.log('Default JSON→XML:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});

// -------------------- 3. XML → JSON --------------------
test.describe('/user - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: exampleUserXml
    });
    const body = await response.json();
    console.log('200 XML→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('username', 'theUser');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: invalidUserXml
    });
    console.log('400 XML→JSON:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: validationUserXml
    });
    console.log('422 XML→JSON:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: invalidUserXml
    });
    const body = await response.json();
    console.log('Default XML→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 4. XML → XML --------------------
test.describe('/user - POST XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: exampleUserXml
    });
    const text = await response.text();
    console.log('200 XML→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain('<username>theUser</username>');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: invalidUserXml
    });
    console.log('400 XML→XML:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: validationUserXml
    });
    console.log('422 XML→XML:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: invalidUserXml
    });
    console.log('Default XML→XML:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});

// -------------------- 5. FORM → JSON --------------------
test.describe('/user - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: exampleUserForm.toString()
    });
    const body = await response.json();
    console.log('200 FORM→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('username', 'theUser');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: invalidUserForm.toString()
    });
    console.log('400 FORM→JSON:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: validationUserForm.toString()
    });
    console.log('422 FORM→JSON:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: invalidUserForm.toString()
    });
    const body = await response.json();
    console.log('Default FORM→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 6. FORM → XML --------------------
test.describe('/user - POST FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: exampleUserForm.toString()
    });
    const text = await response.text();
    console.log('200 FORM→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain('<username>theUser</username>');
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: invalidUserForm.toString()
    });
    console.log('400 FORM→XML:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: validationUserForm.toString()
    });
    console.log('422 FORM→XML:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: invalidUserForm.toString()
    });
    console.log('Default FORM→XML:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});