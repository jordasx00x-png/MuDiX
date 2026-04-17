
async function testHealth() {
  const baseUrl = 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    console.log('Health check:', data);
  } catch (error) {
    console.error('Health check failed:', error);
  }
}
testHealth();
