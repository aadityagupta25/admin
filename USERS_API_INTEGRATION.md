# Users API Integration Documentation

## Overview
Successfully integrated the Users API endpoint `http://31.97.62.250:3000/api/users` into the Polo Live application with a comprehensive data table displaying all user information.

## Features Implemented

### 1. **Complete Data Table with All Columns**
The Users component now displays all available user data fields:

- **ID & User ID**: Database ID and unique user identifier
- **User Profile**: Avatar, full name, and username
- **Contact**: Mobile number and email
- **Demographics**: Gender, country, and language
- **Wallet**: Balance and currency
- **Social Stats**: Followers and following counts
- **Status**: Active/Inactive badge
- **Timestamps**: Created and updated dates (IST format)

### 2. **API Integration**
- ✅ Fetches real data from `http://31.97.62.250:3000/api/users`
- ✅ Displays 12 users from the API response
- ✅ Shows success toast with user count
- ✅ Error handling with user feedback

### 3. **User Management Features**

#### View Details
- Click on "View Details" in the actions menu
- Opens a comprehensive dialog showing:
  - Profile and background images
  - Complete user information
  - Wallet details
  - Social statistics
  - Timestamps

#### Toggle Status
- Activate/Deactivate users
- Updates status via API
- Visual feedback with badges and toasts

#### Delete User
- Soft delete functionality
- Confirmation dialog before deletion
- Updates table after successful deletion

#### Refresh Data
- Manual refresh button to reload users
- Shows loading state during fetch

### 4. **UI Components**

#### Search & Filter
- Search by full name
- Integrated with DataTable component
- Real-time filtering

#### Responsive Design
- Avatar with fallback initials
- Badges for status, gender
- Formatted dates and numbers
- Proper image URLs (handles relative paths)

#### Loading States
- Spinner during initial load
- Prevents interaction until data is loaded

## File Structure

```
src/
├── pages/
│   └── users/
│       ├── Users.jsx          (NEW - Main component with API integration)
│       └── Users2.jsx         (Old mock data version)
├── services/
│   ├── userService.js        (API service methods)
│   └── api.js                (Axios configuration)
├── routes/
│   └── AppRoutes.jsx         (Updated to use new Users component)
└── lib/
    └── constants.js          (API_URL configuration)
```

## API Response Structure

The component handles the following API response format:

```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": 13,
      "user_id": "10000012",
      "full_name": "Raju",
      "user_name": "raju_8888",
      "mobile_number": "8888888888",
      "email": "raju@example.com",
      "gender": "male",
      "country": "India",
      "language": "English",
      "profile_img": "/uploads/users/profile_img-xxx.png",
      "bg_img": "/uploads/users/bg_img-xxx.png",
      "wallet": {
        "balance": 0,
        "currency": "USD"
      },
      "followers_id": [],
      "following_id": [],
      "status": 1,
      "created_at_ist": "16/02/2026, 07:49:12 pm",
      "updated_at_ist": "16/02/2026, 08:01:57 pm"
    }
  ]
}
```

## Column Mapping

| API Field | Display Name | Format |
|-----------|-------------|---------|
| `id` | ID | Monospace text |
| `user_id` | User ID | Monospace text |
| `full_name` + `user_name` | User | Avatar + Name + @username |
| `mobile_number` | Mobile | Monospace text |
| `email` | Email | Text (or '-') |
| `gender` | Gender | Badge |
| `country` | Country | Text (or '-') |
| `language` | Language | Text (or '-') |
| `wallet.balance` + `wallet.currency` | Wallet Balance | Formatted amount |
| `followers_id.length` | Followers | Count |
| `following_id.length` | Following | Count |
| `status` | Status | Active/Inactive badge |
| `created_at_ist` | Joined | Formatted date |
| `updated_at_ist` | Last Updated | Formatted date |
| Actions | Actions | Dropdown menu |

## Image Handling

The component properly handles image URLs:
```javascript
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL.replace('/api', '')}${imagePath}`;
};
```

- Converts relative paths to absolute URLs
- Uses base URL: `http://31.97.62.250:3000`
- Falls back to initials if no image

## Usage

### Accessing the Users Page
1. Navigate to `/users` in the application
2. Users table loads automatically on mount
3. Use search box to filter by name
4. Click actions menu for user operations

### Testing the Integration
```bash
# Development server is running on:
http://localhost:5174/

# Navigate to:
http://localhost:5174/users
```

## API Service Methods Used

```javascript
// Get all users
await userService.getAll();

// Update user (for status toggle)
await userService.update(userId, { status: newStatus });

// Delete user
await userService.delete(userId);
```

## Dependencies

- React (with hooks: useState, useEffect)
- @tanstack/react-table (via DataTable component)
- shadcn/ui components (Button, Badge, Avatar, Dialog, etc.)
- sonner (for toast notifications)
- lucide-react (for icons)

## Error Handling

- Network errors: Toast notification with error message
- Loading states: Spinner during data fetch
- Empty states: Handled by DataTable component
- Image fallbacks: Initials avatar when no image

## Next Steps

### Potential Enhancements
1. **Add User Creation Form**
   - Modal with form fields
   - Image upload for profile and background
   - Validation

2. **Edit User Functionality**
   - Pre-filled form with current data
   - Update API integration

3. **Advanced Filtering**
   - Filter by country, language, status
   - Date range filters

4. **Pagination**
   - API supports pagination
   - Add page size selector
   - Navigate between pages

5. **Export Functionality**
   - Export to CSV/Excel
   - Print view

6. **Bulk Actions**
   - Select multiple users
   - Bulk delete, status update

## Notes

- API is configured in `src/lib/constants.js`
- All API calls go through `apiService` for consistent error handling
- Authentication token automatically added to requests
- Images are served from the same domain as API

## Testing Checklist

- ✅ Users load on component mount
- ✅ All columns display correct data
- ✅ Search functionality works
- ✅ View details shows complete information
- ✅ Status toggle updates successfully
- ✅ Delete confirmation works
- ✅ Refresh button reloads data
- ✅ Images display correctly
- ✅ Error handling works
- ✅ Loading states show properly

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check network tab for API responses
4. Ensure authentication token is valid
