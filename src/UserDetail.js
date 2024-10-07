import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import './UserDetail.css'; // Import the CSS file for custom styles

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box className="user-detail-container">
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>
      <Typography variant="h6"><strong>ID:</strong> {user.id}</Typography>
      <Typography variant="h6"><strong>Name:</strong> {user.name}</Typography>
      <Typography variant="h6"><strong>Username:</strong> {user.username}</Typography>
      <Typography variant="h6"><strong>Email:</strong> {user.email}</Typography>
      <Typography variant="h6"><strong>Phone:</strong> {user.phone}</Typography>
      <Typography variant="h6"><strong>Website:</strong> {user.website}</Typography>
      <Typography variant="h6"><strong>Company:</strong> {user.company.name}</Typography>
      <Typography variant="h6">
        <strong>Address:</strong> {user.address.street}, {user.address.city}
      </Typography>
      <Box mt={2}>
        <Link to="/">
          <Button variant="contained" color="primary">
            Back to Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default UserDetail;
