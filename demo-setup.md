# NGO Admin Panel - Quick Demo Setup

This guide will help you get the admin panel running quickly for demonstration purposes.

## Prerequisites

1. **Backend Server**: Ensure your NGO backend is running on `http://localhost:5000`
2. **Node.js**: Version 16 or higher
3. **Database**: MongoDB should be running and accessible

## Quick Start

### 1. Install Dependencies
```bash
cd ngo-admin
npm install
```

### 2. Start the Admin Panel
```bash
npm run dev
```

The admin panel will start on `http://localhost:5174` (or the next available port).

### 3. Access the Admin Panel
Open your browser and navigate to the URL shown in your terminal.

## Demo Data Setup

To see the admin panel in action, you'll need some sample data in your backend. Here are some example API calls you can make to populate your database:

### Create Sample Blog Posts
```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome to Our NGO",
    "content": "We are excited to announce our new website and initiatives...",
    "category": "Announcements",
    "date": "2024-01-15"
  }'
```

### Create Sample Activities
```bash
curl -X POST http://localhost:5000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Community Cleanup Day",
    "description": "Join us for a day of community service...",
    "category": "Community Service",
    "date": "2024-02-01",
    "location": "Central Park",
    "status": "upcoming"
  }'
```

### Create Sample Team Members
```bash
curl -X POST http://localhost:5000/api/teamMembers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "position": "Executive Director",
    "department": "Leadership",
    "bio": "John has over 15 years of experience in nonprofit management...",
    "email": "john@ngo.org"
  }'
```

## Testing the Admin Panel

### 1. Dashboard
- View statistics and counts
- Use quick action buttons
- Navigate between sections

### 2. Content Management
- **Blog**: Create, edit, and delete blog posts
- **Activities**: Manage events and activities
- **Team**: Add and update team information
- **Volunteers**: Handle applications and opportunities
- **About Us**: Update organization information
- **Testimonials**: Manage client feedback

### 3. Features to Test
- ✅ Form validation
- ✅ CRUD operations
- ✅ Responsive design
- ✅ Navigation
- ✅ Data tables
- ✅ Search and filtering (if implemented)

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - The admin panel will automatically use the next available port
   - Check your terminal for the correct URL

2. **API Connection Errors**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify database connection

3. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version compatibility

## Next Steps

Once you have the demo running:

1. **Customize Content**: Update the sample data with your actual NGO information
2. **Add Features**: Implement additional functionality as needed
3. **Style Customization**: Modify colors, fonts, and layout to match your brand
4. **Deploy**: Build and deploy to your production environment

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure backend services are running
4. Check the README.md for detailed documentation

Happy managing! 🎉
