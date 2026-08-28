import pool from "./_db.js";
import 'dotenv/config'; 
import bcrypt from "bcryptjs";

const TEST_USER_NAME = "Usuário de Teste";
const TEST_USER_EMAIL = "teste@email.com";
const TEST_USER_PASSWORD = "123456";

async function seedUser() {
  console.log("Iniciando o script para cadastrar o usuário de teste...");

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [TEST_USER_EMAIL]
    );

    if (existingUser.rows.length > 0) {
      console.warn(
        ` Aviso: O usuário com e-mail "${TEST_USER_EMAIL}" já existe. Nenhuma ação foi tomada.`
      );
      return;
    }

    console.log("Gerando hash da senha...");
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(TEST_USER_PASSWORD, saltRounds);

    await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
      [TEST_USER_NAME, TEST_USER_EMAIL, passwordHash]
    );

    console.log(`Usuário "${TEST_USER_NAME}" cadastrado com sucesso!`);
  } catch (error) {
    console.error("Erro ao executar o script de seed:", error);
  } finally {
    console.log("Finalizando a conexão com o banco de dados.");
    await pool.end();
  }
}

seedUser();