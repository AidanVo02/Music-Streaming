# 🎵 PLAYLIST SYSTEM - USER GUIDE

## ✅ HOÀN THÀNH!

Playlist System đã được implement đầy đủ với các tính năng:

---

## 📱 **CÁCH SỬ DỤNG**

### 1️⃣ **TẠO PLAYLIST MỚI**

**Cách 1: Từ Library Screen**
1. Mở app → Go to **Library** tab
2. Click tab **PLAYLISTS**
3. Click nút **+** ở góc phải
4. Nhập tên playlist và description (optional)
5. Click **CREATE**

**Cách 2: Khi thêm track**
- Khi bạn thêm track vào playlist mà chưa có playlist nào, sẽ có gợi ý tạo playlist mới

---

### 2️⃣ **THÊM TRACK VÀO PLAYLIST**

**Từ Player Screen:**
1. Đang nghe nhạc → Mở **Player** (full screen)
2. Scroll xuống phần actions
3. Click nút **PLAYLIST** (icon playlist-add)
4. Chọn playlist muốn thêm
5. Done! ✅

**Từ Track List:** *(Coming soon)*
- Long press vào track → Menu → Add to Playlist

**Từ Artist Detail:** *(Coming soon)*
- Click 3 dots bên cạnh track → Add to Playlist

---

### 3️⃣ **XEM PLAYLIST**

1. Go to **Library** → **PLAYLISTS** tab
2. Click vào playlist muốn xem
3. Xem danh sách tracks, thông tin playlist

---

### 4️⃣ **XÓA TRACK KHỎI PLAYLIST**

1. Mở playlist detail
2. Click nút **X** bên cạnh track (chỉ hiện nếu bạn là owner)
3. Confirm → Track bị xóa khỏi playlist

---

### 5️⃣ **XÓA PLAYLIST**

*(Coming soon - Edit playlist screen)*

---

## 🎯 **TÍNH NĂNG**

### ✅ Đã Có:
- ✅ Tạo playlist (public/private)
- ✅ Xem danh sách playlists
- ✅ Xem chi tiết playlist với tracks
- ✅ Thêm track vào playlist từ Player
- ✅ Xóa track khỏi playlist
- ✅ Auto-update track count & duration
- ✅ Owner-only permissions
- ✅ Public/Private visibility

### 🚧 Đang Phát Triển:
- 🚧 Edit playlist (name, description, cover)
- 🚧 Delete playlist
- 🚧 Reorder tracks (drag & drop)
- 🚧 Add to playlist từ track list
- 🚧 Add to playlist từ artist detail
- 🚧 Share playlist
- 🚧 Play entire playlist
- 🚧 Playlist cover image upload

---

## 💡 **TIPS & TRICKS**

### Playlist Public vs Private:
- **Public**: Ai cũng có thể xem
- **Private**: Chỉ bạn mới thấy (có icon khóa 🔒)

### Track Count & Duration:
- Tự động cập nhật khi thêm/xóa tracks
- Không cần refresh

### Duplicate Tracks:
- Không thể thêm cùng 1 track 2 lần vào playlist
- Sẽ báo "Track already in this playlist"

---

## 🐛 **TROUBLESHOOTING**

### "Not authenticated" error:
- Đảm bảo bạn đã đăng nhập
- Logout và login lại

### Playlist không hiển thị:
- Pull to refresh trong Library screen
- Kiểm tra tab PLAYLISTS đã được chọn

### Không thêm được track:
- Kiểm tra bạn có phải owner của playlist
- Kiểm tra track có tồn tại không
- Restart app

---

## 🎨 **UI/UX HIGHLIGHTS**

### Player Screen:
- Nút **PLAYLIST** thay thế nút **QUEUE** cũ
- Icon: `playlist-add` (MaterialIcons)
- Vị trí: Actions row, giữa SHARE và DEVICES

### Add to Playlist Modal:
- Slide up từ dưới lên
- Hiển thị tất cả playlists của user
- Loading state khi đang thêm
- Success/Error alerts

### Library Screen:
- Tab PLAYLISTS hiển thị danh sách
- Nút + để tạo playlist mới
- Empty state với gợi ý tạo playlist

### Playlist Detail:
- Cover image (hoặc fallback)
- Tên, description, metadata
- Danh sách tracks với position
- Nút X để xóa (chỉ owner)

---

## 📊 **STATISTICS**

### Files Created: 8
- `AddToPlaylistModal.tsx` - Modal component
- `CreatePlaylistModal.tsx` - Create playlist modal
- `usePlaylists.ts` - Custom hooks
- `PlaylistController.js` - Backend controller
- `Playlist.js` - Database model
- `playlists.js` - API routes
- `playlistDetail/index.tsx` - Detail screen
- Database tables & triggers

### Files Updated: 6
- `player/index.tsx` - Added playlist button
- `library/index.tsx` - Show real playlists
- `apiService.ts` - Playlist API methods
- `app.js` - Playlist routes
- `_layout.tsx` - Playlist route
- `db-schema-check.md` - Schema docs

### Lines of Code: ~2000+
- Backend: ~800 lines
- Frontend: ~1200 lines

---

## 🚀 **NEXT PHASE: QUEUE SYSTEM**

Sau khi hoàn thiện Playlist System, phase tiếp theo sẽ là:

1. **Queue Management**
   - Add tracks to queue
   - View queue
   - Reorder queue
   - Clear queue

2. **Playback Controls**
   - Next/Previous track
   - Shuffle mode
   - Repeat modes (off, one, all)
   - Play entire playlist

3. **Enhanced Player**
   - Queue panel
   - Up next section
   - History

---

## ✨ **ENJOY YOUR PLAYLISTS!**

Bây giờ bạn có thể:
- 🎵 Tạo playlists cho từng mood
- 📝 Organize tracks theo thể loại
- 🔒 Private playlists cho riêng mình
- 🌍 Public playlists để share với mọi người

**Happy listening!** 🎧
