import axios from 'axios';

const BASE_URL = 'https://site-backend.be-kite.com/api/v1';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

async function run() {
  const loginRes = await client.post('/dashboard/login', {
    email: 'admin@bekite.com',
    password: 'password123',
  });
  const token = loginRes.data.token;
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  const endpoints = [
    { name: '1. Solutions', url: '/dashboard/solutions' },
    { name: '2. Projects', url: '/dashboard/projects' },
    { name: '3. Project Categories', url: '/dashboard/project-categories' },
    { name: '4. Products', url: '/dashboard/products' },
    { name: '5. Product Categories', url: '/dashboard/categories' },
    { name: '6. Brand Showcases', url: '/dashboard/brand-showcases' },
    { name: '7. Job Site', url: '/dashboard/job-site' },
  ];

  for (const ep of endpoints) {
    console.log(`\n========================================`);
    console.log(`Testing validation for: ${ep.name} (${ep.url})`);
    try {
      await client.post(ep.url, {}, { headers: authHeaders });
      console.log(`  ⚠️ Succeeded unexpectedly with empty payload!`);
    } catch (err) {
      if (err.response) {
        console.log(`  Status: ${err.response.status} ${err.response.statusText}`);
        console.log(`  Validation Errors:`, JSON.stringify(err.response.data?.errors || err.response.data, null, 2));
      } else {
        console.log(`  Error:`, err.message);
      }
    }
  }
}

run().catch(console.error);
