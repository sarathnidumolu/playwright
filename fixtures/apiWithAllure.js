import { test as base } from '@playwright/test';
import * as testInfo from "allure-js-commons";
 
export const test = base.extend({
  request: async ({ request }, use) => {
    const wrapped = new Proxy(request, {
      get(target, prop) {
        if (typeof target[prop] === 'function') {
          return async (...args) => {
            // ---- Before API Call ----
            await test.step(`API Request: ${prop.toString().toUpperCase()} ${args[0]}`, async () => {
              await testInfo.attachment(
                'Request Details',
                JSON.stringify(
                  {
                    method: prop.toString().toUpperCase(),
                    url: args[0],
                    options: args[1] || {}
                  },
                  null,
                  2
                ),
                'application/json'
              );
            });
 
            const response = await target[prop](...args);
 
            let respBody;
            try {
              respBody = await response.json();
            } catch {
              respBody = await response.text();
            }
 
            const respHeaders = response.headers();
 
            await test.step(`API Response: ${response.status()} ${args[0]}`, async () => {
              await testInfo.attachment(
                'Response Details',
                JSON.stringify(
                  {
                    status: response.status(),
                    headers: respHeaders,
                    cookies: respHeaders['set-cookie'] || 'No cookies',
                    contentType: respHeaders['content-type'] || 'N/A',
                    body: respBody
                  },
                  null,
                  2
                ),
                'application/json'
              );
            });
 
            return response;
          };
        }
        return target[prop];
      }
    });
 
    await use(wrapped);
  }
});
           