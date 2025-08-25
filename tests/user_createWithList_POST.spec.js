import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const exampleUserListJson = [
  {
    id: 1,
    username: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '123-456-7890',
    userStatus: 1
  },
  {
    id: 2,
    username: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'securepass',
    phone: '098-765-4321',
    userStatus: 1
  }
]

const invalidUserListJson = { "notAnArray": "data" }

const validationErrorUserListJson = [
  {
    id: 3,
    username: '',
    firstName: 'Invalid',
    lastName: 'User',
    email: 'invalid-email',
    password: 'short',
    phone: '',
    userStatus: 0
  }
]

const exampleUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>1</id>
  <username>user1</username>
  <firstName>John</firstName>
  <lastName>Doe</lastName>
  <email>john.doe@example.com</email>
  <password>password123</password>
  <phone>123-456-7890</phone>
  <userStatus>1</userStatus>
</User>`;

// -------------------- 1. JSON (Request) → JSON (Response) --------------------
test.describe('/user/createWithList - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserListJson
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload 200 JSON→JSON:', requestPayload)
    console.log('Response Body 200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username')
    expect(body).toHaveProperty('firstName')
    expect(body).toHaveProperty('lastName')
    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('password')
    expect(body).toHaveProperty('phone')
    expect(body).toHaveProperty('userStatus')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidUserListJson
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload 400 JSON→JSON:', requestPayload)
    console.log('Response Body 400 JSON→JSON:', body)
    expect(response.status()).toBeGreaterThanOrEqual(400)
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorUserListJson
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload 422 JSON→JSON:', requestPayload)
    console.log('Response Body 422 JSON→JSON:', body)
    expect(response.status()).toBeGreaterThanOrEqual(422)
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = { "triggerError": true }
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload Default JSON→JSON:', requestPayload)
    console.log('Response Body Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON (Request) → XML (Response) --------------------
test.describe('/user/createWithList - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserListJson
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload 200 JSON→XML:', requestPayload)
    console.log('Response Body 200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>user1</username>')
    expect(text).toContain('<firstName>John</firstName>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidUserListJson
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload 400 JSON→XML:', requestPayload)
    console.log('Response Body 400 JSON→XML:', text)
    expect(response.status()).toBeGreaterThanOrEqual(400)
    expect(text).toContain('error')
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorUserListJson
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload 422 JSON→XML:', requestPayload)
    console.log('Response Body 422 JSON→XML:', text)
    expect(response.status()).toBeGreaterThanOrEqual(422)
    expect(text).toContain('error')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = { "triggerError": true }
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload Default JSON→XML:', requestPayload)
    console.log('Response Body Default JSON→XML:', text)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(text).toContain('error')
  })
})
