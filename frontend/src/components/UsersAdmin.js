import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const UsersAdmin = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const newUser = { username, email, password, isAdmin };
      await api.post("/api/users/register", newUser, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchUsers();
      setUsername("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/api/users/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditUser = (user) => {
    setEditMode(true);
    setEditUserId(user._id);
    setUsername(user.username);
    setEmail(user.email);
    setIsAdmin(user.isAdmin);
  };

  const editUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { username, email, isAdmin };
      if (password) {
        updatedUser.password = password;
      }
      await api.put(`/api/users/${editUserId}`, updatedUser, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchUsers();
      setEditMode(false);
      setEditUserId(null);
      setUsername("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    const localDate = new Date(date).toLocaleString();
    const utcDate = new Date(date).toUTCString();
    return `Local: ${localDate}, UTC: ${utcDate}`;
  };

  return (
    <div>
      <h1>Users</h1>
      {user && user.isAdmin && (
        <form onSubmit={editMode ? editUser : addUser}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>
            Admin:
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </label>
          <button type="submit">{editMode ? "Update User" : "Add User"}</button>
          {editMode && (
            <button onClick={() => setEditMode(false)}>Cancel</button>
          )}
        </form>
      )}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
            <p>Created At: {formatDate(user.createdAt)}</p>
            <p>Updated At: {formatDate(user.updatedAt)}</p>
            {user && user.isAdmin && (
              <>
                <button onClick={() => startEditUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersAdmin;
