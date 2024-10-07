import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import ConfirmationModal from './ConfirmationModal';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, CircularProgress } from '@mui/material';
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };
    fetchUsers();
  }, []);

  // Handle user creation
  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  // Handle user update
  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) => prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user)));
  };

  // Handle user deletion
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${userToDelete}`);
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userToDelete));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Table
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search by name..."
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)}>
        Create New User
      </Button>
      <CreateUserModal open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onUserCreated={handleUserCreated} />
      {selectedUser && (
        <EditUserModal
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          userData={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
      <ConfirmationModal 
        open={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDeleteUser} 
      />
      
      {/* Loading Spinner */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>
                      <Button variant="outlined" color="primary" style={{ marginRight: '10px' }}>View Details</Button>
                    </Link>
                    <Button variant="outlined" color="secondary" onClick={() => { setSelectedUser(user); setEditModalOpen(true); }} style={{ marginRight: '10px' }}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteClick(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default UserTable;
