import { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert, MenuItem } from '@mui/material';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student'); // Varsayılan olarak öğrenci
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Frontend validasyonu
    if (!email.trim()) {
      setError('Email boş olamaz!');
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir email adresi giriniz!');
      return;
    }

    if (!password) {
      setError('Şifre boş olamaz!');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır!');
      return;
    }

    try {
      await api.post('/auth/register', { email, password, fullName, role });
      navigate('/');
    } catch (err: any) {
      // Backend'den gelen hata mesajını göster
      const errorMessage = err.response?.data?.message || 'Kayıt başarısız! Bilgileri kontrol et.';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" textAlign="center">Kayıt Ol</Typography>
        
        {error && <Alert severity="error">{error}</Alert>}

        <TextField label="Ad Soyad" fullWidth value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
          inputProps={{ minLength: 6 }}
          helperText="En az 6 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* ROL SEÇME KUTUSU */}
        <TextField 
          select 
          label="Rolünü Seç" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          fullWidth
        >
          <MenuItem value="student">Öğrenci</MenuItem>
          <MenuItem value="admin">Öğretmen</MenuItem>
        </TextField>
        
        <Button variant="contained" color="success" size="large" onClick={handleRegister}>KAYIT OL</Button>
        <Link to="/" style={{ textAlign: 'center' }}>Giriş Yap</Link>
      </Box>
    </Container>
  );
}