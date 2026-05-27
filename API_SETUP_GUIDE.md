# API Integration Guide - Streaming App

## 📋 Overview

Hệ thống gồm:
- **Backend**: Express API chạy trên port 5000 (MySQL)
- **Frontend**: Expo App kết nối đến Backend API

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev  # Hoặc npm start
```

**Backend đã tạo các routes:**
- `GET /api/artists` - Lấy tất cả artists
- `GET /api/artists/:id` - Lấy artist theo ID
- `POST /api/artists` - Tạo artist mới
- `PUT /api/artists/:id` - Cập nhật artist
- `DELETE /api/artists/:id` - Xóa artist
- `GET /api/artists/search?q=term` - Tìm artist theo tên

### 2. Frontend Setup

**Step 1: Tìm IP của máy tính**

Windows:
```bash
ipconfig
# Tìm IPv4 Address (ví dụ: 192.168.1.100)
```

Mac/Linux:
```bash
ifconfig
# hoặc
ip addr
```

**Step 2: Cập nhật `frontend/.env.local`**

```
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```

Ví dụ:
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
```

### 3. Chạy Frontend

```bash
cd frontend
npx expo start
```

**Tuỳ thuộc vào thiết bị:**

- **Android Emulator**: Nhấn `a` để mở emulator
  - API URL: `http://10.0.2.2:5000` (IP special của emulator)
  
- **iOS Simulator**: Nhấn `i` để mở simulator
  - API URL: `http://127.0.0.1:5000`
  
- **Physical Device**: Scan QR code bằng Expo Go
  - API URL: `http://YOUR_LOCAL_IP:5000`

## 📱 Features Implemented

### API Service (`src/server/apiService.ts`)
- Centralized API requests
- Automatic error handling
- Console logging cho debugging

### Custom Hooks (`src/hooks/useArtists.ts`)
- `useArtists()` - Fetch tất cả artists
- `useSearchArtists()` - Search artists theo tên

### Library Screen Integration
- Tab navigation (PLAYLISTS, ARTISTS, ALBUMS)
- Khi chọn ARTISTS tab → Hiển thị artists từ API
- Loading state với spinner
- Error handling với retry button

## 🔍 Testing API

**Sử dụng Postman hoặc curl:**

```bash
# Lấy tất cả artists
curl http://localhost:5000/api/artists

# Lấy artist theo ID
curl http://localhost:5000/api/artists/1

# Tìm artist theo tên
curl "http://localhost:5000/api/artists/search?q=artist_name"

# Tạo artist mới
curl -X POST http://localhost:5000/api/artists \
  -H "Content-Type: application/json" \
  -d '{"name":"New Artist","bio":"Description","image_url":"url"}'
```

## 🐛 Troubleshooting

### "Cannot connect to server"
- Kiểm tra Backend đang chạy: `http://localhost:5000`
- Kiểm tra IP trong `.env.local` có đúng không
- Tắt Firewall hoặc mở port 5000
- Thử ping IP: `ping 192.168.1.100`

### "API request timeout"
- Backend có thể chậm, kiểm tra logs
- Database connection có ok không
- Thử restart backend: `npm run dev`

### "CORS Error"
- Backend đã có `cors` middleware
- Kiểm tra app.js có `app.use(cors())`

### Android Emulator không kết nối
- Sử dụng IP: `10.0.2.2` thay vì `localhost`
- Đó là IP của host từ perspective của emulator

### Physical device không kết nối
- Phải ở same WiFi network với máy tính
- Sử dụng local IP (192.168.x.x)
- Không dùng localhost hoặc 127.0.0.1

## 💡 How to Use in Components

### Fetch Artists in any Screen

```tsx
import { useArtists } from '@/src/hooks/useArtists';

const MyScreen = () => {
  const { artists, loading, error, refetch } = useArtists();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={artists}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
};
```

### Search Artists

```tsx
import { useSearchArtists } from '@/src/hooks/useArtists';

const SearchScreen = () => {
  const { results, loading, error, search } = useSearchArtists();

  return (
    <TextInput 
      placeholder="Search artists..."
      onChangeText={(text) => search(text)}
    />
  );
};
```

### Direct API Call

```tsx
import ApiService from '@/src/server/apiService';

// Gọi bất kỳ endpoint nào
const artists = await ApiService.getAllArtists();
const artist = await ApiService.getArtistById(1);
await ApiService.createArtist({ name: 'New Artist', bio: '...' });
```

## 📊 Database Schema

Artists table:
```sql
CREATE TABLE artists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎯 Next Steps

1. ✅ Add more tables (albums, tracks, playlists)
2. ✅ Create corresponding API routes
3. ✅ Add hooks for other resources
4. ✅ Implement more screens (Player, Playlist detail)
5. ✅ Add authentication/user management
6. ✅ Add caching strategy

---

**Cần giúp đỡ?** Kiểm tra logs trong terminal backend và frontend để debug.
