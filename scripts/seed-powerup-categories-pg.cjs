const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Create a new pool instance
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fantasypro',
  password: 'postgres',
  port: 5432,
});

async function main() {
  try {
    // Define power-up categories
    const categories = [
      {
        id: uuidv4(),
        name: 'Common',
        description: 'Common power-ups that are easier to obtain',
      },
      {
        id: uuidv4(),
        name: 'Rare',
        description: 'Rare power-ups with special effects',
      },
      {
        id: uuidv4(),
        name: 'Legendary',
        description: 'Legendary power-ups with powerful effects',
      },
    ];

    // Insert categories into the database
    for (const category of categories) {
      const query = `
        INSERT INTO "PowerUpCategory" (id, name, description, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW(), NOW())
        ON CONFLICT (name) DO NOTHING;
      `;
      
      await pool.query(query, [category.id, category.name, category.description]);
    }

    console.log('Power-up categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding power-up categories:', error);
  } finally {
    await pool.end();
  }
}

main();