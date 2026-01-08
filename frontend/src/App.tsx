import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Users from './pages/Users';

// --- KARANLIK TEMA AYARLARI ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Karanlık modu aktif et
    background: {
      default: '#121212', // Arka plan rengi (Çok koyu gri)
      paper: '#1e1e1e',   // Kartların rengi (Bir tık açık gri)
    },
    primary: {
      main: '#90caf9', // Mavi butonların karanlık moddaki tonu
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Yazı tipi
    h4: {
      fontWeight: 700, // Başlıkları kalın yap
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Butonları ovalleştir
          textTransform: 'none', // Harfleri otomatik büyütme
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Kartları ovalleştir
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.5)', // Şık bir gölge ekle
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled', // Kutucukların içini dolu yap (Karanlıkta daha iyi durur)
      }
    }
  }
});

function App() {
  return (
    // Tüm siteyi bu tema ile sarmalıyoruz
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline: Arka plan rengini tüm sayfaya yayar */}
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;