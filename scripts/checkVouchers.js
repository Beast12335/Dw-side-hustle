const mysql = require('mysql2/promise');

const CODE_EXPIRY_MONTHS = 2;

async function checkVouchersValidity() {
  try {
    // Connect to the MySQL server
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: {
        ca: fs.readFileSync('path/to/cert.pem'),
        key: fs.readFileSync('path/to/key.pem'),
      },
    });

    console.log('Connected to MySQL server.');

    // Get all active vouchers
    const [rows] = await connection.execute('SELECT * FROM voucher WHERE status = ?', ['active']);

    const currentDate = new Date();

    // Check each voucher for validity
    for (const voucher of rows) {
      const expiryDate = new Date(voucher.expiry_date);

      if (expiryDate <= currentDate) {
        // Set the voucher as expired if its expiry date has passed
        await connection.execute('UPDATE voucher SET status = ? WHERE id = ?', ['expired', voucher.id]);
        console.log(`Voucher with ID ${voucher.id} has expired.`);
      }
    }

    // Close the MySQL connection
    await connection.end();
    console.log('MySQL connection closed.');

  } catch (error) {
    console.error('Error checking vouchers validity:', error);
  }
}

checkVouchersValidity();
