const mysql = require('mysql2/promise');

const CODE_EXPIRY_MONTHS = 2;

async function checkVouchersValidity() {
  try {
    // Connect to the MySQL server
    const connection = await mysql.createConnection(
      process.env.DB_URL);
    // Get all active vouchers
    const [rows] = await connection.execute('SELECT * FROM voucher WHERE valid = ?', ['active']);

    const currentDate = new Date();

    // Check each voucher for validity
    for (const voucher of rows) {
      const expiryDate = new Date(voucher.date);

      if (expiryDate <= currentDate) {
        // Set the voucher as expired if its expiry date has passed
        await connection.execute('UPDATE voucher SET valid = ? WHERE code = ?', ['expired', voucher.code]);
        console.log(`Voucher with ID ${voucher.id} has expired.`);
      }
    }

    // Close the MySQL connection
    await connection.end();
  } catch (error) {
    console.error('Error checking vouchers validity:', error);
  }
}

checkVouchersValidity();
