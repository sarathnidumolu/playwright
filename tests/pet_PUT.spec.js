import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const PET_ID = 10
const NON_EXISTENT_PET_ID = 999999999999999999

const examplePetJson = {
  id: PET_ID,
  name: 'doggie',
  category: { id: 1, name: 'Dogs' },
  photoUrls: ['http://example.com/photo1'],
  tags: [{ id: 1, name: 'tag1' }],
  status: 'available'
}

const examplePetXml = `<?xml version="1.0" encoding="UTF-8"?>
<pet>
  <id>${PET_ID}</id>
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
</pet>`

const formUrlEncoded = new URLSearchParams({
  id: String(PET_ID),
  name: 'doggie',
  'category.id': '1',
  'category.name': 'Dogs',
  'photoUrls[0]': 'http://example.com/photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
})

const invalidPetJson = { invalid: 'payload' }
const missingRequiredJson = { id: PET_ID, category: { id: 1, name: 'Dogs' }, status: 'available' }
const petNotFoundJson = { ...examplePetJson, id: NON_EXISTENT_PET_ID }

const invalidPetXml = ` <invalid><data/></invalid> `
const missingRequiredXml = `<?xml version="1.0" encoding="UTF-8"?><pet><id>${PET_ID}</id><status>available</status></pet>`
const petNotFoundXml = `<?xml version="1.0" encoding="UTF-8"?><pet><id>${NON_EXISTENT_PET_ID}</id><name>doggie</name><photoUrls><photoUrl>http://example.com/photo1</photoUrl></photoUrls><status>available</status></pet>`

const badForm = new URLSearchParams({ wrong: 'data' })
const missingRequiredForm = new URLSearchParams({ id: String(PET_ID), status: 'available' })
const petNotFoundForm = new URLSearchParams(formUrlEncoded)
petNotFoundForm.set('id', String(NON_EXISTENT_PET_ID))


// -------------------- 1. JSON → JSON --------------------
test.describe('/pet - PUT JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: examplePetJson
    })

    const body = await response.json()
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', PET_ID)
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('status', 'available')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: invalidPetJson
    })
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: petNotFoundJson
    })
    console.log('404 JSON→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: missingRequiredJson
    })
    console.log('422 JSON→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: examplePetJson
    })

    const body = await response.json()
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON → XML --------------------
test.describe('/pet - PUT JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: examplePetJson
    })
    const text = await response.text()
    console.log('200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<pet>')
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<status>available</status>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: invalidPetJson
    })
    console.log('400 JSON→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: petNotFoundJson
    })
    console.log('404 JSON→XML:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: missingRequiredJson
    })
    console.log('422 JSON→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: examplePetJson
    })
    console.log('Default JSON→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 3. XML → JSON --------------------
test.describe('/pet - PUT XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: examplePetXml
    })

    const body = await response.json()
    console.log('200 XML→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', PET_ID)
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('status', 'available')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: invalidPetXml
    })
    console.log('400 XML→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: petNotFoundXml
    })
    console.log('404 XML→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: missingRequiredXml
    })
    console.log('422 XML→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: examplePetXml
    })

    const body = await response.json()
    console.log('Default XML→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML → XML --------------------
test.describe('/pet - PUT XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: examplePetXml
    })

    const text = await response.text()
    console.log('200 XML→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<pet>')
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<status>available</status>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: invalidPetXml
    })
    console.log('400 XML→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: petNotFoundXml
    })
    console.log('404 XML→XML:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: missingRequiredXml
    })
    console.log('422 XML→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: examplePetXml
    })
    console.log('Default XML→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 5. FORM → JSON --------------------
test.describe('/pet - PUT FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formUrlEncoded.toString()
    })

    const body = await response.json()
    console.log('200 FORM→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', PET_ID)
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('status', 'available')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: badForm.toString()
    })
    console.log('400 FORM→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: petNotFoundForm.toString()
    })
    console.log('404 FORM→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: missingRequiredForm.toString()
    })
    console.log('422 FORM→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: formUrlEncoded.toString()
    })
    const body = await response.json()
    console.log('Default FORM→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM → XML --------------------
test.describe('/pet - PUT FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formUrlEncoded.toString()
    })
    const text = await response.text()
    console.log('200 FORM→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<pet>')
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<status>available</status>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: badForm.toString()
    })
    console.log('400 FORM→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: petNotFoundForm.toString()
    })
    console.log('404 FORM→XML:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: missingRequiredForm.toString()
    })
    console.log('422 FORM→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: formUrlEncoded.toString()
    })
    console.log('Default FORM→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})