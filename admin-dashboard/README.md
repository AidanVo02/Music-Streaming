# OscStation Admin Dashboard

Admin web dashboard for managing OscStation platform.

## Features

- 📊 **Overview Dashboard** - System statistics and recent activity
- 👥 **User Management** - View, edit, and manage user accounts
- 🎵 **Track Management** - Browse, edit, and delete tracks
- 📝 **Artist Applications** - Review and approve/reject artist applications
- ⚙️ **Settings** - Configure system settings

## Installation

```bash
cd admin-dashboard
npm install
```

## Development

```bash
npm run dev
```

The dashboard will open at `http://localhost:3001`

## Build for Production

```bash
npm run build
```

## Default Admin Credentials

```
Email: admin@signalonyx.com
Password: Admin@123
```

## Tech Stack

- Vanilla JavaScript (ES6+)
- Vite (Build tool)
- CSS3 (Custom styling)
- Fetch API (HTTP requests)

## Project Structure

```
admin-dashboard/
├── index.html          # Main HTML file
├── src/
│   ├── main.js        # Main JavaScript logic
│   └── styles/
│       └── main.css   # Styles
├── package.json
├── vite.config.js
└── README.md
```

## API Endpoints Used

- `POST /api/auth/login` - Admin login
- `GET /api/tracks` - Get all tracks
- `DELETE /api/tracks/:id` - Delete track
- `GET /api/tracks/genres` - Get all genres
- `GET /api/artist-application/pending` - Get pending applications
- `PUT /api/artist-application/:id/review` - Approve/reject application

## Features to Add

- [ ] User CRUD operations
- [ ] Track editing
- [ ] Bulk operations
- [ ] Analytics charts
- [ ] Export data
- [ ] Email notifications
- [ ] Activity logs
- [ ] Role management

## Security Notes

- Only users with `admin` role can access
- JWT token authentication
- Token stored in localStorage
- Auto-logout on token expiration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
