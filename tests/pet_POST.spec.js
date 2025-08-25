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
      <photoUrl>http://example.com/photo1</photoUrl>
    </photoUrls>
    <tags>
      <tag>
        <id>1</id>
        <name>tag1</name>
      </tag>
    </tags>
    <status>available</status>
  </pet>`;

const formUrlEncoded = new URLSearchParams({
  id: '10',
  name: 'doggie',
  'category.id': '1',
  'category.name': 'Dogs',
  'photoUrls[0]': 'http://example.com/photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
})

const badForm = new URLSearchParams({ wrong: 'data' })

// -------------------- 1. JSON → JSON --------------------
test.describe('/pet - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = { invalid: 'payload' }
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBe(400);

  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = { name: '', photoUrls: [] }
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('422 JSON→JSON:', await response.text())
    expect(response.status()).toBe(422);
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = { id: 99999, name: 'error-pet', photoUrls: ['url'], status: 'available' }
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true' // Assuming this header triggers a default error
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON → XML --------------------
test.describe('/pet - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',

      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload:', requestPayload)
    console.log('200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = { wrong: 'input' }
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('400 JSON→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = { name: '', photoUrls: [] }
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('422 JSON→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = { id: 99999, name: 'error-pet', photoUrls: ['url'], status: 'available' }
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('Default JSON→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 3. XML → JSON --------------------
test.describe('/pet - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',

      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('200 XML→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
  })


  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = ` < invalid > < data / > < / invalid > `
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('400 XML→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = ` < pet > < name > < / name > < photoUrls / > < / pet > `
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('422 XML→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',

        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('Default XML→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML → XML --------------------
test.describe('/pet - POST XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',

      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('Request Payload:', requestPayload)
    console.log('200 XML→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = ` < pet > < invalid > < / invalid > < / pet > `
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('400 XML→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = ` < pet > < name > < / name > < photoUrls / > < / pet > `
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('422 XML→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',

        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('Default XML→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 5. FORM → JSON --------------------
test.describe('/pet - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',

      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('200 FORM→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('400 FORM→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ name: '', 'photoUrls[0]': '' }).toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('422 FORM→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',

        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('Default FORM→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM → XML --------------------
test.describe('/pet - POST FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',

      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload:', requestPayload)
    console.log('200 FORM→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',

      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('400 FORM→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ name: '', 'photoUrls[0]': '' }).toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',


      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('422 FORM→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString()
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',

        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    console.log('Request Payload:', requestPayload)
    console.log('Default FORM→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})
