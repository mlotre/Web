import { useEffect, useState } from 'react';
import {
  Typography, Container, Button, Box, TextField, Alert,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Divider,
  Grid, MenuItem, Select, FormControl, InputLabel, Chip, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
// İkonlar
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';

interface Course {
  id: number;
  title: string;
  description: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myEnrollments, setMyEnrollments] = useState<number[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number>(1);

  // Kategori yönetimi
  const [categoryName, setCategoryName] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);

  // Kategori düzenleme
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editCategoryId2, setEditCategoryId2] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchCategories();    // 1. Kategorileri getir
    fetchCourses();       // 2. Dersleri getir
    fetchMyEnrollments(); // 3. Kayıtlarımı getir
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategoryId(response.data[0].id);
      }
    } catch (err) {
      console.error('Kategoriler getirilemedi', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      const response = await api.get('/enrollments');
      const userId = localStorage.getItem('userId');
      if (userId) {
        const myCourses = response.data
          .filter((e: any) => e.user.id === Number(userId))
          .map((e: any) => e.course.id);
        setMyEnrollments(myCourses);
      }
    } catch (err) {
      console.error("Kayıtlar çekilemedi", err);
    }
  };

  const handleAddCourse = async () => {
    if (!title) return;
    try {
      await api.post('/courses', {
        title: title,
        description: desc,
        categoryId: selectedCategoryId
      });
      setSuccess('Ders eklendi.');
      setTitle('');
      setDesc('');
      fetchCourses();
    } catch (err) {
      setError('Ders eklenemedi.');
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setError('Kategori adı boş olamaz');
      return;
    }
    try {
      await api.post('/categories', { name: categoryName });
      setSuccess('Kategori eklendi.');
      setCategoryName('');
      fetchCategories();
    } catch (err) {
      setError('Kategori eklenemedi.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz? İçindeki tüm dersler de silinecek!')) return;
    try {
      await api.delete(`/categories/${id}`);
      setSuccess('Kategori silindi.');
      fetchCategories();
      fetchCourses();
    } catch (err) {
      setError('Kategori silinemedi.');
    }
  };

  const handleEditCategoryClick = (cat: Category) => {
    setEditCategoryId2(cat.id);
    setEditCategoryName(cat.name);
    setEditCategoryOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      setError('Kategori adı boş olamaz.');
      return;
    }
    try {
      await api.patch(`/categories/${editCategoryId2}`, { name: editCategoryName });
      setSuccess('Kategori güncellendi.');
      setEditCategoryOpen(false);
      fetchCategories();
    } catch (err) {
      setError('Kategori güncellenemedi.');
    }
  };

  const handleDelete = async (id: number) => {
    if(!window.confirm('Bu dersi tamamen silmek istediğinize emin misiniz?')) return;
    try { await api.delete(`/courses/${id}`); setSuccess('Ders silindi.'); fetchCourses(); } 
    catch (err) { setError('Silinemedi.'); }
  };

  const handleOpenEdit = (course: Course) => {
    setEditId(course.id);
    setEditTitle(course.title);
    setEditDesc(course.description);
    setEditCategoryId(course.categoryId);
    setEditOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!editId || !editTitle) return;
    try {
      await api.patch(`/courses/${editId}`, {
        title: editTitle,
        description: editDesc,
        categoryId: editCategoryId
      });
      setSuccess('Güncellendi.');
      setEditOpen(false);
      fetchCourses();
    } catch (err) {
      setError('Güncellenemedi.');
    }
  };

  const handleEnroll = async (courseId: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      await api.post('/enrollments', { userId: Number(userId), courseId: courseId });
      setSuccess('Kayıt olundu!'); fetchMyEnrollments();
    } catch (err) { setError('Kayıt hatası.'); }
  };

  const handleUnenroll = async (courseId: number) => {
    const userId = localStorage.getItem('userId');
    if(!window.confirm('Bu dersten kaydınızı silmek istiyor musunuz?')) return;
    
    try {
      await api.post('/enrollments/unenroll', { userId: Number(userId), courseId: courseId });
      setSuccess('Dersten kaydınız silindi.');
      fetchMyEnrollments(); 
    } catch (err) {
      setError('İşlem başarısız oldu.');
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 3 }}>
        <Box>
          <Typography variant="h4">Panel</Typography>
          <Typography variant="body2" color="text.secondary">
            Hoş geldin, {role === 'admin' ? 'Öğretmen' : 'Öğrenci'} olarak giriş yaptın.
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {role === 'admin' && (
            <Button variant="contained" onClick={() => navigate('/users')}>Kullanıcılar</Button>
          )}
          <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>Çıkış</Button>
        </Box>
      </Paper>

      {/* İSTATİSTİK KARTLARI */}
      <Grid container spacing={3} mb={4}>
        {/* @ts-ignore */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: 'primary.dark', borderRadius: 2, mr: 2 }}>
              <ClassIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">{courses.length}</Typography>
              <Typography variant="body2" color="text.secondary">Toplam Ders Sayısı</Typography>
            </Box>
          </Paper>
        </Grid>
        {/* @ts-ignore */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: 'success.dark', borderRadius: 2, mr: 2 }}>
              <SchoolIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">{myEnrollments.length}</Typography>
              <Typography variant="body2" color="text.secondary">Kayıtlı Olduğum Dersler</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {role === 'admin' && (
        <>
          {/* KATEGORİ YÖNETİMİ */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, borderLeft: '6px solid #66bb6a' }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <CategoryIcon sx={{ mr: 1 }} /> Kategori Yönetimi
            </Typography>
            <Grid container spacing={2} alignItems="center" mb={2}>
              {/* @ts-ignore */}
              <Grid item xs={12} md={8}>
                <TextField
                  label="Yeni Kategori Adı"
                  fullWidth
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  size="small"
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={handleAddCategory}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Kategori Ekle
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" mb={1}>Mevcut Kategoriler:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((cat) => (
                <Box key={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    label={cat.name}
                    color="primary"
                    variant="outlined"
                    onClick={() => handleEditCategoryClick(cat)}
                    sx={{ cursor: 'pointer' }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCategory(cat.id)}
                    sx={{ ml: -1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {categories.length === 0 && (
                <Typography variant="body2" color="text.secondary">Henüz kategori yok</Typography>
              )}
            </Box>
          </Paper>

          {/* DERS EKLEME */}
          <Paper elevation={3} sx={{ p: 3, mb: 5, borderRadius: 3, borderLeft: '6px solid #90caf9' }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <AddCircleOutlineIcon sx={{ mr: 1 }} /> Yeni Ders Ekle
            </Typography>
            <Grid container spacing={2} alignItems="center">
              {/* @ts-ignore */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Ders Başlığı"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size="small"
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Kısa Açıklama (Opsiyonel)"
                  fullWidth
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  size="small"
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={selectedCategoryId}
                    label="Kategori"
                    onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleAddCourse}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  EKLE
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Ders Listesi</Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Kategori Filtrele</InputLabel>
          <Select
            value={filterCategoryId || ''}
            label="Kategori Filtrele"
            onChange={(e) => setFilterCategoryId(e.target.value ? Number(e.target.value) : null)}
          >
            <MenuItem value="">Tümü</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {courses
          .filter((course) => !filterCategoryId || course.categoryId === filterCategoryId)
          .map((course) => {
            const category = categories.find((c) => c.id === course.categoryId);
            const isEnrolled = myEnrollments.includes(course.id);
            return (
              // @ts-ignore
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Paper elevation={4} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                  <Box mb={1}>
                    <Chip
                      label={category?.name || 'Kategori Yok'}
                      size="small"
                      color="primary"
                      icon={<CategoryIcon />}
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Box mb={2} flexGrow={1}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description ? course.description : 'Açıklama bulunmuyor.'}
                    </Typography>
                  </Box>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  
                  {isEnrolled ? (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="warning" 
                      onClick={() => handleUnenroll(course.id)}
                      startIcon={<CancelIcon />}
                    >
                      Dersten Çık
                    </Button>
                  ) : (
                    <Button size="small" variant="contained" onClick={() => handleEnroll(course.id)}>Kayıt Ol</Button>
                  )}

                  {role === 'admin' && (
                    <Box>
                      <Button size="small" sx={{ minWidth: 0, mr: 1 }} color="primary" onClick={() => handleOpenEdit(course)}>
                        <EditOutlinedIcon />
                      </Button>
                      <Button size="small" sx={{ minWidth: 0 }} color="error" onClick={() => handleDelete(course.id)}>
                        <DeleteOutlineIcon />
                      </Button>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {courses.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>Henüz sistemde kayıtlı bir ders bulunmuyor.</Alert>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Dersi Düzenle</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb:2}}>Bilgileri güncelleyip kaydedebilirsiniz.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Ders Adı"
            fullWidth
            variant="filled"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Açıklama"
            fullWidth
            variant="filled"
            multiline
            rows={3}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Kategori</InputLabel>
            <Select
              value={editCategoryId}
              label="Kategori"
              onChange={(e) => setEditCategoryId(Number(e.target.value))}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">İPTAL</Button>
          <Button onClick={handleUpdateCourse} variant="contained">KAYDET</Button>
        </DialogActions>
      </Dialog>

      {/* KATEGORİ DÜZENLEME DIALOG */}
      <Dialog open={editCategoryOpen} onClose={() => setEditCategoryOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Kategoriyi Düzenle</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Kategori adını güncelleyebilirsiniz.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Kategori Adı"
            fullWidth
            variant="filled"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditCategoryOpen(false)} color="inherit">İPTAL</Button>
          <Button onClick={handleUpdateCategory} variant="contained" color="success">KAYDET</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}