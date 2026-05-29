# Fix AsyncStorage trên Android

## ✅ Đã hoàn tất Prebuild!

Native Android code đã được tạo lại với AsyncStorage được cấu hình đúng.

## 🚀 Các bước tiếp theo:

### Cách 1: Chạy trên thiết bị Android thật (Khuyến nghị)

1. **Kết nối điện thoại Android qua USB**
   - Bật Developer Options trên điện thoại
   - Bật USB Debugging
   - Kết nối USB và chọn "File Transfer" mode

2. **Kiểm tra thiết bị đã kết nối**
   ```bash
   adb devices
   ```
   Phải thấy thiết bị trong danh sách

3. **Build và chạy app**
   ```bash
   cd frontend
   npx expo run:android
   ```

### Cách 2: Sử dụng Expo Development Build

1. **Start Metro bundler**
   ```bash
   cd frontend
   npx expo start --dev-client
   ```

2. **Scan QR code** bằng camera điện thoại hoặc Expo Go app

### Cách 3: Build APK để cài đặt thủ công

```bash
cd frontend

# Build development APK
npx expo run:android --variant release

# APK sẽ được tạo tại:
# android/app/build/outputs/apk/release/app-release.apk
```

Sau đó copy file APK vào điện thoại và cài đặt.

## 🔧 Troubleshooting

### Nếu vẫn gặp lỗi AsyncStorage:

1. **Clear cache hoàn toàn**
   ```bash
   cd frontend
   rm -rf node_modules
   rm -rf .expo
   rm -rf android/app/build
   npm install
   npx expo prebuild --clean
   ```

2. **Kiểm tra package version**
   ```bash
   npm list @react-native-async-storage/async-storage
   ```
   Phải là version 3.0.2 hoặc cao hơn

3. **Restart Metro bundler**
   ```bash
   npx expo start --clear
   ```

## 📱 Tài khoản test

Login với các tài khoản sau để test:

- **USER**: user@signalonyx.com / User@123
  - Xem stats: Listening Time, Liked Songs, Discovery Streak
  - Thấy "Become an Artist" banner
  
- **ARTIST**: artist@signalonyx.com / Artist@123
  - Xem stats: Published Tracks, Storage Used
  - Có nút Upload Track
  
- **ADMIN**: admin@signalonyx.com / Admin@123
  - Full permissions

## ✨ Tính năng mới

- ✅ Role-based User Profile screen
- ✅ Fallback storage (app vẫn chạy được nếu AsyncStorage fail)
- ✅ Real data từ database
- ✅ Conditional rendering theo role
- ✅ "Become an Artist" CTA cho user
- ✅ Personal Library vs Artist Studio

## 🎯 Kiểm tra sau khi chạy

1. Login thành công
2. Profile screen hiển thị đúng stats theo role
3. Restart app → session vẫn được giữ (AsyncStorage hoạt động)
4. Logout và login lại → hoạt động bình thường
