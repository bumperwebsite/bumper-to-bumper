import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const page = list.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          resolve(page.webSocketDebuggerUrl);
        } else if (list.length > 0 && list[0].webSocketDebuggerUrl) {
          resolve(list[0].webSocketDebuggerUrl);
        } else {
          reject(new Error('No page target found'));
        }
      });
    }).on('error', reject);
  });
}

function cdpSession(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  return {
    async send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        callbacks.set(reqId, { resolve, reject });
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    },
    waitReady() {
      return new Promise(resolve => {
        if (ws.readyState === WebSocket.OPEN) resolve();
        else ws.onopen = resolve;
      });
    },
    close() {
      ws.close();
    }
  };
}

async function run() {
  const wsUrl = await getWsUrl();
  const cdp = cdpSession(wsUrl);
  await cdp.waitReady();

  console.log('Connected to Chrome DevTools Protocol');
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  // Step 1: Navigate to /products
  console.log('Navigating to http://localhost:5173/products...');
  await cdp.send('Page.navigate', { url: 'http://localhost:5173/products' });
  await new Promise(r => setTimeout(r, 1500));

  // Step 2: Add item to cart via localStorage
  console.log('Setting test cart in localStorage...');
  await cdp.send('Runtime.evaluate', {
    expression: `
      const sampleItem = {
        id: "moco-x5-4gb-64gb-oled-multimedia-player",
        quantity: 1,
        product: {
          id: "moco-x5-4gb-64gb-oled-multimedia-player",
          name: "Moco X5 4GB 64GB OLED Multimedia Player",
          category: "Infotainment",
          price: 24999,
          image: "/images/products/moco-x5-4gb-64gb-oled-multimedia-player.svg"
        }
      };
      localStorage.setItem('btb_cart_items', JSON.stringify([sampleItem]));
      window.location.href = '/checkout';
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  // Step 3: Check if email field exists
  const checkFields = await cdp.send('Runtime.evaluate', {
    expression: `
      ({
        hasName: !!document.querySelector('#customer-name'),
        hasPhone: !!document.querySelector('#customer-phone'),
        hasEmail: !!document.querySelector('#customer-email') || !!document.querySelector('input[type="email"]'),
        hasVehicle: !!document.querySelector('#customer-vehicle'),
        hasNotes: !!document.querySelector('#customer-notes')
      })
    `,
    returnByValue: true
  });

  console.log('Form Fields Detected:', checkFields.result.value);

  // Take screenshot of checkout form
  const ss1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.resolve(__dirname, 'test_renders', 'checkout_form_with_cart.png'), Buffer.from(ss1.data, 'base64'));
  console.log('Saved checkout_form_with_cart.png');

  // Step 4: Fill form and submit
  console.log('Filling form fields and submitting order...');
  const submitResult = await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const nameInput = document.querySelector('#customer-name');
        const phoneInput = document.querySelector('#customer-phone');
        const vehicleInput = document.querySelector('#customer-vehicle');
        const notesInput = document.querySelector('#customer-notes');

        // Helper to trigger react onChange
        function setReactInput(input, value) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          nativeInputValueSetter.call(input, value);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        function setReactTextarea(input, value) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          nativeInputValueSetter.call(input, value);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        setReactInput(nameInput, "Karthik Subramanian");
        setReactInput(phoneInput, "9840123456");
        setReactInput(vehicleInput, "Hyundai Creta 2024");
        setReactTextarea(notesInput, "Evening studio appointment requested.");

        const submitBtn = document.querySelector('.btb-checkout-btn-submit');
        submitBtn.click();
        return true;
      })()
    `,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 1500));

  // Step 5: Check modal
  const checkModal = await cdp.send('Runtime.evaluate', {
    expression: `
      ({
        modalPresent: !!document.querySelector('.btb-order-modal'),
        orderId: document.querySelector('.btb-order-modal__meta-item .text-red')?.textContent || '',
        customerText: document.querySelector('.btb-order-modal__meta-item:last-child .btb-meta-val')?.textContent || '',
        hasDownloadBtn: !!document.querySelector('.btb-modal-btn-download'),
        hasWhatsAppBtn: !!document.querySelector('.btb-modal-btn-wa')
      })
    `,
    returnByValue: true
  });

  console.log('Order Modal State:', checkModal.result.value);

  // Take screenshot of confirmation modal
  const ss2 = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.resolve(__dirname, 'test_renders', 'checkout_confirmation_modal.png'), Buffer.from(ss2.data, 'base64'));
  console.log('Saved checkout_confirmation_modal.png');

  cdp.close();
  console.log('E2E Verification completed successfully!');
}

run().catch(err => {
  console.error('E2E verification error:', err);
  process.exit(1);
});
