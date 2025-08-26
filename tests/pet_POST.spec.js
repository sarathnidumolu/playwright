import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const examplePetJson = {
  id: 10,
  name: 'doggie',
  category: { id: 1, name: 'Dogs' },
  photoUrls: ['http://example.com/photo1'],
  tags: [{ id: 1, name: 'tag1' }],
  status: 'available'
}

const examplePetXml = `<?xml version="1.0" encoding="UTF-8"?>
  <pet>
    <id>10</id>
    <name>doggie</name>
    <category>
      <id>1</id>
      <name>Dogs</name>
    </category>
    <photoUrls>
      <photoUrl>string</photoUrl>
    </photoUrls>
    <tags>
      <tag>
        <id>0</id>
        <name>string</name>
      </tag>
    </tags>
    <status>available</status>
  </pet>`;

const formUrlEncoded = new URLSearchParams({
  id: '10',
  name: 'doggie',
  'category.id': '1',
  'category.name': 'Dogs',
  photoUrls: 'http://example.com/photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
})

const badForm = new URLSearchParams({ wrong: 'data' })

// -------------------- 1. JSON → JSON --------------------
test.describe('/pet - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const data = examplePetJson
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: data
    })
    const body = await response.json()
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('photoUrls')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const data = { invalid: 'payload' }
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: data
    })
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const data = { name: '', photoUrls: [] }
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: data
    })
    console.log('422 JSON→JSON:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const data = { invalid: 'Unexpected' }
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: data
    })
    const body = await response.json()
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON → XML --------------------
test.describe('/pet - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const data = examplePetJson
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: data
    })
    const text = await response.text()
    console.log('200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const data = { wrong: 'input' }
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: data
    })
    console.log('400 JSON→XML:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const data = { name: '', photoUrls: [] }
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: data
    })
    console.log('422 JSON→XML:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const data = { invalid: 'Unexpected' }
    console.log('Request Payload:', JSON.stringify(data))
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: data
    })
    console.log('Default JSON→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 3. XML → JSON --------------------
test.describe('/pet - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const data = examplePetXml
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: data
    })
    const body = await response.json()
    console.log('200 XML→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('photoUrls')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const data = ` < invalid > < data / > < / invalid > `
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: data
    })
    console.log('400 XML→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const data = ` < pet > < name > < / name > < photoUrls / > < / pet > `
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: data
    })
    console.log('422 XML→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const data = ` < invalid > < data / > < / invalid > `
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: data
    })
    const body = await response.json()
    console.log('Default XML→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML → XML --------------------
test.describe('/pet - POST XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const data = examplePetXml
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: data
    })
    const text = await response.text()
    console.log('200 XML→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const data = ` < pet > < invalid > < / invalid > < / pet > `
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: data
    })
    console.log('400 XML→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const data = ` < pet > < name > < / name > < photoUrls / > < / pet > `
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: data
    })
    console.log('422 XML→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const data = examplePetXml
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: data
    })
    console.log('Default XML→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 5. FORM → JSON --------------------
test.describe('/pet - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const data = formUrlEncoded.toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
    const body = await response.json()
    console.log('200 FORM→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('photoUrls')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const data = badForm.toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
    console.log('400 FORM→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const data = new URLSearchParams({ name: '', photoUrls: '' }).toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
    console.log('422 FORM→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const data = badForm.toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: data
    })
    const body = await response.json()
    console.log('Default FORM→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM → XML --------------------
test.describe('/pet - POST FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const data = formUrlEncoded.toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
    const text = await response.text()
    console.log('200 FORM→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const data = badForm.toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
    console.log('400 FORM→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const data = new URLSearchParams({ name: '', photoUrls: '' }).toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
    console.log('422 FORM→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const data = badForm.toString()
    console.log('Request Payload:', data)
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: data
    })
    console.log('Default FORM→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})