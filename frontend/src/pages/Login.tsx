import { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Email boş olamaz!');
      return;
    }

    if (!password) {
      setError('Şifre boş olamaz!');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('role', response.data.user.role || 'student');

      navigate('/courses');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Giriş başarısız! Email veya şifre hatalı.';
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" textAlign="center">Giriş Yap</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Şifre"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" size="large" onClick={handleLogin}>GİRİŞ YAP</Button>
        <Link to="/register" style={{ textAlign: 'center' }}>Kayıt Ol</Link>
      </Box>
    </Container>
  );
}