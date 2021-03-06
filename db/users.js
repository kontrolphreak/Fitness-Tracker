const client = require('./client');
const bcrypt = require('bcrypt');

async function getAllUsers() {
    try {
        const { rows } = await client.query(`SELECT * FROM users;`);

        return rows;
    } catch (error) {
        
    }
}

async function createUser({ username, password }) {
    try {
        const {rows: [user]} = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, password])

        return user;
    } catch(error) {
        throw error;
    }
}

async function getUser({ username, password }) {
    try {
        const user = await getUserByUsername(username);

        const passwordsMatch = bcrypt.compareSync(password, user.password);
        if(!passwordsMatch) {
            return;
        }

        return user;
        
    } catch (error) {
        throw error;
    }
}

async function getUserById(userId) {
    try {
      const { rows: [ user ] } = await client.query(`
        SELECT *
        FROM users
        WHERE id=${ userId }
      `);
  
      if (!user) {
        throw {
          name: "UserNotFoundError",
          message: "A user with that id does not exist"
        }
      }
  
      return user;
    } catch (error) {
      throw error;
    }
  }

async function getUserByUsername(username) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;
        `, [username]);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    getUser,
    getAllUsers,
    getUserByUsername,
    getUserById
}