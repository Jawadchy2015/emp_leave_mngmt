const bcrypt = require("bcryptjs");
const pool = require("./db");

async function seedUsers() {
  try {
    const users = [
      {
        username: "admin",
        password: "admin123",
        role: "admin",
        full_name: "System Administrator",
        email: "admin@leaveapp.com",
      },
      {
        username: "manager",
        password: "manager123",
        role: "manager",
        full_name: "Department Manager",
        email: "manager@leaveapp.com",
      },
      {
        username: "employee",
        password: "employee123",
        role: "employee",
        full_name: "General Employee",
        email: "employee@leaveapp.com",
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await pool.query(
        `
        INSERT INTO users (username, password_hash, role, full_name, email)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (username)
        DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email
        `,
        [
          user.username,
          hashedPassword,
          user.role,
          user.full_name,
          user.email,
        ]
      );
    }

    console.log("Users seeded successfully.");
    console.log("Credentials:");
    console.log("admin / admin123");
    console.log("manager / manager123");
    console.log("employee / employee123");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    await pool.end();
  }
}

seedUsers();