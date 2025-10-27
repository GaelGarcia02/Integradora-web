import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "salientglobaltech",
});

// Verificar la conexión
pool
  .getConnection()
  .then((connection) => {
    console.log("Conexión a la base de datos establecida con éxito");
    connection.release();
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos", error);
  });
