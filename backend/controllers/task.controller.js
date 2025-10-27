import { pool } from "../db.js";

//* Get all tasks
export const getTasks = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM tasks ORDER BY title DESC"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Get one task
export const getTask = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM tasks WHERE id_task = ?", [
      req.params.id,
    ]);

    if (result.length == 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Create new task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      client_id,
      description_,
      date_,
      start_time,
      end_time,
      assigned_to,
      status_,
    } = req.body;

    const [result] = await pool.query(
      "INSERT INTO tasks(title, client_id, description_, date_, start_time, end_time, assigned_to, status_) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        client_id,
        description_,
        date_,
        start_time,
        end_time,
        assigned_to,
        status_,
      ]
    );

    res.json({
      id_task: result.insertId,
      title,
      client_id,
      description_,
      date_,
      start_time,
      end_time,
      assigned_to,
      status_,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Update a task
export const updateTask = async (req, res) => {
  try {
    const {
      title,
      client_id,
      description_,
      date_,
      start_time,
      end_time,
      assigned_to,
      status_,
    } = req.body;

    const [result] = await pool.query(
      "UPDATE tasks SET title = ?, client_id = ?, description_ = ?, date_ = ?, start_time = ?, end_time = ?, assigned_to = ?, status_ = ? WHERE id_task = ?",
      [
        title,
        client_id,
        description_,
        date_,
        start_time,
        end_time,
        assigned_to,
        status_,
        req.params.id,
      ]
    );

    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      id_task: req.params.id,
      title,
      client_id,
      description_,
      date_,
      start_time,
      end_time,
      assigned_to,
      status_,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* Delete a task
export const deleteTask = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tasks WHERE id_task = ?", [
      req.params.id,
    ]);

    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
