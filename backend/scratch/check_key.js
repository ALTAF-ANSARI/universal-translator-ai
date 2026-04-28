require('dotenv').config();
const key = process.env.GOOGLE_API_KEY;
console.log(`Key: [${key}]`);
console.log(`Length: ${key ? key.length : 'undefined'}`);
if (key && key.trim() !== key) {
  console.log('Warning: Key has leading/trailing whitespace!');
}
