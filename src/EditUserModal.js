import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const EditUserModal = ({ open, onClose, userData, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    street: '',
    city: '',
    companyName: '',
    website: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        username: userData.username || '',
        street: userData.address.street || '',
        city: userData.address.city || '',
        companyName: userData.company?.name || '',
        website: userData.website || '',
      });
    }
  }, [userData]);

  const validate = () => {
    const errors = {};
    if (!formData.name || formData.name.length < 3) {
      errors.name = 'Name is required and must be at least 3 characters';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      errors.email = 'A valid email is required';
    }
    const phonePattern = /^\d{10}$/;
    if (!formData.phone || !phonePattern.test(formData.phone)) {
      errors.phone = 'A valid phone number is required (10 digits)';
    }
    if (!formData.street) {
      errors.street = 'Street is required';
    }
    if (!formData.city) {
      errors.city = 'City is required';
    }
    if (formData.companyName && formData.companyName.length < 3) {
      errors.companyName = 'Company name must be at least 3 characters';
    }
    const urlPattern = /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/;
    if (formData.website && !urlPattern.test(formData.website)) {
      errors.website = 'A valid URL is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${userData.id}`, {
          ...formData,
          address: { street: formData.street, city: formData.city },
          company: { name: formData.companyName },
        });
        onUserUpdated(response.data);
        onClose();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.street}
            helperText={errors.street}
            required
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.city}
            helperText={errors.city}
            required
          />
          <TextField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
          <TextField
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.website}
            helperText={errors.website}
          />
          <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
            Update User
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
