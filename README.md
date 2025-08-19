# NGO Admin Panel

A comprehensive admin panel for managing NGO content and operations. This React-based application allows administrators to manage all aspects of the NGO website from a single, user-friendly interface.

## Features

### 🔐 Authentication & Security
- Secure login system with JWT tokens
- Protected routes for admin-only access
- Session management with automatic logout

### 📊 Dashboard
- Overview of all content types
- Quick statistics and counts
- Quick action buttons for common tasks
- Recent activity tracking

### 📝 Content Management
- **Blog Posts**: Create, edit, and delete blog articles
- **Activities**: Manage NGO activities and events
- **Team Members**: Add and update team information
- **Volunteers**: Handle volunteer applications and opportunities
- **About Us**: Manage organization information
- **Testimonials**: Control client and volunteer testimonials

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- Mobile-friendly sidebar navigation
- Clean, professional admin interface
- Intuitive forms and data tables

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone the repository**
   ```bash
   cd ngo-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5174` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Usage

### Login
1. Navigate to the admin panel
2. Enter your admin credentials
3. You'll be redirected to the dashboard upon successful login

### Managing Content

#### Blog Posts
- Click "Add New Blog Post" to create content
- Fill in title, content, category, and optional image URL
- Use the table to view, edit, or delete existing posts

#### Activities
- Add new activities with details like location, date, and status
- Set activity status (upcoming, ongoing, completed)
- Manage activity categories and descriptions

#### Team Members
- Add team members with their roles and contact information
- Include profile images and professional bios
- Organize by departments and positions

#### Volunteers
- View volunteer applications in the Applications tab
- Create and manage volunteer opportunities
- Set opportunity status and requirements

#### About Us
- Manage organization mission, vision, and values
- Update contact information and addresses
- Control the main organization image

#### Testimonials
- Add client and volunteer testimonials
- Set rating systems and approval status
- Control which testimonials are displayed publicly

### Navigation
- Use the sidebar to navigate between different sections
- The active section is highlighted in blue
- Mobile users can toggle the sidebar with the hamburger menu

## API Integration

The admin panel integrates with the following backend endpoints:

- `POST /api/admin/login` - Admin authentication
- `GET /api/blog` - Blog posts management
- `GET /api/activities` - Activities management
- `GET /api/teamMembers` - Team management
- `GET /api/volunteer-applications` - Volunteer applications
- `GET /api/volunteer-opportunities` - Volunteer opportunities
- `GET /api/about-us` - About us content
- `GET /api/testimonials` - Testimonials management

## File Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar
├── contexts/
│   └── AuthContext.jsx     # Authentication context
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Dashboard.jsx       # Dashboard overview
│   ├── BlogManagement.jsx  # Blog content management
│   ├── ActivityManagement.jsx # Activities management
│   ├── TeamManagement.jsx  # Team management
│   ├── VolunteerManagement.jsx # Volunteer management
│   ├── AboutUsManagement.jsx # About us management
│   └── TestimonialManagement.jsx # Testimonials management
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Customization

### Styling
- Modify `src/index.css` for custom CSS
- Update `tailwind.config.js` for theme customization
- Use the provided CSS classes for consistent styling

### Adding New Content Types
1. Create a new management page component
2. Add the route to `App.jsx`
3. Update the navigation in `Layout.jsx`
4. Implement the corresponding API calls

## Security Considerations

- All admin routes are protected with authentication
- JWT tokens are stored securely in localStorage
- Automatic token verification on app load
- Secure logout functionality

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure the backend server is running on port 5000
   - Check CORS configuration in the backend
   - Verify API endpoint URLs

2. **Authentication Issues**
   - Clear browser localStorage and try logging in again
   - Check if the JWT token is valid
   - Ensure admin credentials are correct

3. **Build Errors**
   - Clear `node_modules` and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all import statements are correct

## Contributing

1. Follow the existing code structure and patterns
2. Use consistent naming conventions
3. Add proper error handling for API calls
4. Test all functionality before submitting changes

## License

This project is part of the NGO management system and follows the same licensing terms.

## Support

For support and questions, please contact the development team or refer to the main project documentation.
