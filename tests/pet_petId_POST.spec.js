import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const petId = 10

const successQueryParams = {
  name: 'doggie',
  status: 'available'
}

const invalidInputQueryParams = {
  name: 'testname',
  status: 'invalid_status_enum'
}

const defaultErrorQueryParams = {
  name: 'errorPet',
  status: 'errorStatus'
}

// -------------------- 1. Query Params → JSON --------------------
test.describe('/pet/{petId} - POST Query Params → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestUrl = `${baseURL}/pet/${petId}?${new URLSearchParams(successQueryParams).toString()}`
    console.log('200 Query Params→JSON Request URL:', requestUrl)
    const response = await request.post(`${baseURL}/pet/${petId}`, {
      headers: {
        'Accept': 'application/json'
      },
      params: successQueryParams
    })

    const body = await response.json()
    console.log('200 Query Params→JSON Response Body:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', successQueryParams.name)
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestUrl = `${baseURL}/pet/${petId}?${new URLSearchParams(invalidInputQueryParams).toString()}`
    console.log('400 Query Params→JSON Request URL:', requestUrl)
    const response = await request.post(`${baseURL}/pet/${petId}`, {
      headers: {
        'Accept': 'application/json'
      },
      params: invalidInputQueryParams
    })
    console.log('400 Query Params→JSON Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestUrl = `${baseURL}/pet/${petId}?${new URLSearchParams(defaultErrorQueryParams).toString()}`
    console.log('Default Query Params→JSON Request URL:', requestUrl)
    const response = await request.post(`${baseURL}/pet/${petId}`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      },
      params: defaultErrorQueryParams
    })

    const body = await response.json()
    console.log('Default Query Params→JSON Response Body:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. Query Params → XML --------------------
test.describe('/pet/{petId} - POST Query Params → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestUrl = `${baseURL}/pet/${petId}?${new URLSearchParams(successQueryParams).toString()}`
    console.log('200 Query Params→XML Request URL:', requestUrl)
    const response = await request.post(`${baseURL}/pet/${petId}`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: successQueryParams
    })

    const text = await response.text()
    console.log('200 Query Params→XML Response Body:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain(`<name>${successQueryParams.name}</name>`)
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestUrl = `${baseURL}/pet/${petId}?${new URLSearchParams(invalidInputQueryParams).toString()}`
    console.log('400 Query Params→XML Request URL:', requestUrl)
    const response = await request.post(`${baseURL}/pet/${petId}`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: invalidInputQueryParams
    })
    console.log('400 Query Params→XML Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestUrl = `${baseURL}/pet/${petId}?${new URLSearchParams(defaultErrorQueryParams).toString()}`
    console.log('Default Query Params→XML Request URL:', requestUrl)
    const response = await request.post(`${baseURL}/pet/${petId}`, {
      headers: {
        'Accept': 'application/xml',
        'X-Force-Error': 'true'
      },
      params: defaultErrorQueryParams
    })
    console.log('Default Query Params→XML Response Body:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})
