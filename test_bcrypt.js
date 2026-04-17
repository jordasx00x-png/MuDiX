import bcrypt from 'bcryptjs';

async function test() {
  const hash = "$2b$10$8DrspSPmWVlwSi34aT1rF.H.pZLO9bvTAqUdjx3aBWvtcGLs6DLHS";
  const isValid = await bcrypt.compare("password123", hash);
  console.log("Is valid:", isValid);
}

test();
