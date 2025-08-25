import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const validPetId = 10;
const invalidPetIdFor400 = 'invalidID';
const petIdFor404 = 999999999;

// -------------------- No Request Body → application/json --------------------
test.describe('/pet/{petId} - GET No Request Body → application/json', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${validPetId}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    const body = await response.json()
    console.log(`200 No Request Body→JSON: GET ${baseURL}/pet/${validPetId}`, body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', validPetId)
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('category')
    expect(body.category).toHaveProperty('id', 1)
    expect(body.category).toHaveProperty('name', 'Dogs')
    expect(body).toHaveProperty('photoUrls')
    expect(Array.isArray(body.photoUrls)).toBe(true)
    expect(body.photoUrls.length).toBeGreaterThan(0)
    expect(body).toHaveProperty('status')
    expect(['available', 'pending', 'sold']).toContain(body.status)
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${invalidPetIdFor400}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    console.log(`400 No Request Body→JSON: GET ${baseURL}/pet/${invalidPetIdFor400}`, await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${petIdFor404}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    console.log(`404 No Request Body→JSON: GET ${baseURL}/pet/${petIdFor404}`, await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${validPetId}`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      },
    })
    const body = await response.json()
    console.log(`Default No Request Body→JSON: GET ${baseURL}/pet/${validPetId}`, body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- No Request Body → application/xml --------------------
test.describe('/pet/{petId} - GET No Request Body → application/xml', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${validPetId}`, {
      headers: {
        'Accept': 'application/xml',
      },
    })
    const text = await response.text()
    console.log(`200 No Request Body→XML: GET ${baseURL}/pet/${validPetId}`, text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain(`<id>${validPetId}</id>`)
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<category>')
    expect(text).toContain('<id>1</id>')
    expect(text).toContain('<name>Dogs</name>')
    expect(text).toContain('<photoUrls>')
    expect(text).toContain('<photoUrl>')
    expect(text).toContain('<status>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${invalidPetIdFor400}`, {
      headers: {
        'Accept': 'application/xml',
      },
    })
    console.log(`400 No Request Body→XML: GET ${baseURL}/pet/${invalidPetIdFor400}`, await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${petIdFor404}`, {
      headers: {
        'Accept': 'application/xml',
      },
    })
    console.log(`404 No Request Body→XML: GET ${baseURL}/pet/${petIdFor404}`, await response.text())
    expect(response.status()).toBe(404)
  })
})
