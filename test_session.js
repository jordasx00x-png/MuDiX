
async function testSession() {
  const baseUrl = 'http://localhost:3000';
  let cookie = '';

  console.log('--- Step 1: Initial session test ---');
  const res1 = await fetch(`${baseUrl}/api/session-test`);
  const text1 = await res1.text();
  console.log('Response 1 Status:', res1.status);
  try {
    const data1 = JSON.parse(text1);
    console.log('Response 1 JSON:', data1);
    cookie = res1.headers.get('set-cookie');
    console.log('Cookie:', cookie);
  } catch (e) {
    console.log('Response 1 is not JSON:', text1.substring(0, 100));
    return;
  }

  if (!cookie) {
    console.log('❌ No cookie received in Step 1.');
    return;
  }

  // Extract only the session ID part of the cookie
  const sessionCookie = cookie.split(';')[0];

  console.log('\n--- Step 2: Session test with cookie ---');
  const res2 = await fetch(`${baseUrl}/api/session-test`, {
    headers: { 'cookie': sessionCookie }
  });
  const text2 = await res2.text();
  console.log('Response 2 Status:', res2.status);
  try {
    const data2 = JSON.parse(text2);
    console.log('Response 2 JSON:', data2);

    if (data2.testCount === 2) {
      console.log('\n✅ Session persistence verified locally!');
    } else {
      console.log('\n❌ Session persistence failed locally.');
    }
  } catch (e) {
    console.log('Response 2 is not JSON:', text2.substring(0, 100));
  }
}

testSession().catch(console.error);
