# User Guide - AYNA Feedback Platform

## Overview
AYNA is a full-stack feedback collection platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows administrators to create custom feedback forms and collect responses from users.

## Features
- ✅ Admin authentication (register/login)
- ✅ Dynamic form creation with multiple field types
- ✅ Public form submission (no authentication required)
- ✅ Response collection and management
- ✅ Admin dashboard with analytics
- ✅ CSV export functionality
- ✅ Modern, responsive UI
- ✅ Real-time form validation

## Getting Started

### For Administrators

#### 1. Account Registration
1. Visit the application homepage
2. Click "Get Started" or "Login"
3. Click "Don't have an account? Register"
4. Fill in your details:
   - Username
   - Email
   - Password
5. Click "Register"

#### 2. Login
1. Go to the login page
2. Enter your credentials
3. Click "Login"
4. You'll be redirected to the dashboard

#### 3. Creating a Form
1. From the dashboard, click "Create New Form"
2. Fill in the form details:
   - **Form Title**: Give your form a descriptive name
   - **Description**: Explain what the form is for
3. Add fields to your form:
   - **Text Fields**: For short text responses
   - **Email Fields**: For email addresses (with validation)
   - **Number Fields**: For numeric input
   - **Textarea Fields**: For longer text responses
   - **Select Fields**: For dropdown menus with options
   - **Radio Fields**: For single-choice questions
   - **Checkbox Fields**: For multiple-choice questions
4. For each field, specify:
   - Field Label
   - Field Type
   - Required/Optional
   - Options (for select, radio, checkbox fields)
5. Click "Create Form"

#### 4. Managing Forms
From the dashboard, you can:
- **View All Forms**: See all your created forms
- **View Responses**: Click "View Responses" to see submitted responses
- **Export Data**: Click "Export CSV" to download responses
- **Share Forms**: Copy the public form URL to share with users

#### 5. Viewing Responses
1. Click "View Responses" for any form
2. You'll see:
   - Total number of responses
   - Individual response details
   - Submission timestamps
3. Export responses as CSV for further analysis

### For Form Respondents

#### 1. Accessing a Form
1. Use the public form URL provided by the administrator
2. No account registration required

#### 2. Filling Out a Form
1. Read the form title and description
2. Fill out all required fields (marked with *)
3. Optional fields can be left blank
4. Click "Submit Response"
5. You'll see a success message upon submission

## Form Field Types

### Text Field
- Single-line text input
- Good for names, titles, short answers
- Can be marked as required

### Email Field
- Email address input with validation
- Automatically validates email format
- Can be marked as required

### Number Field
- Numeric input only
- Good for ratings, quantities, ages
- Can be marked as required

### Textarea Field
- Multi-line text input
- Good for comments, feedback, descriptions
- Can be marked as required

### Select Field (Dropdown)
- Single selection from predefined options
- Add options when creating the field
- Can be marked as required

### Radio Field
- Single selection from predefined options
- Options displayed as radio buttons
- Can be marked as required

### Checkbox Field
- Multiple selections from predefined options
- Options displayed as checkboxes
- Can be marked as required

## CSV Export Feature

### What Gets Exported
- All response data for a specific form
- Submission timestamps
- Response IDs
- All field values

### How to Export
1. Go to Dashboard or Form Responses page
2. Click "Export CSV" button
3. File will be downloaded automatically
4. Open with Excel, Google Sheets, or any CSV viewer

### CSV Format
```
Response ID,Submitted At,Field 1,Field 2,Field 3,...
1,2024-01-01T10:30:00.000Z,John Doe,john@example.com,Great service
2,2024-01-01T11:45:00.000Z,Jane Smith,jane@example.com,Good experience
```

## Tips and Best Practices

### For Form Creators
1. **Clear Titles**: Use descriptive form titles
2. **Helpful Descriptions**: Explain the purpose of your form
3. **Logical Order**: Arrange fields in a logical sequence
4. **Required Fields**: Only mark essential fields as required
5. **Field Labels**: Use clear, concise labels
6. **Test Forms**: Submit a test response to ensure everything works

### For Form Design
1. **Keep It Short**: Minimize the number of fields
2. **Group Related Fields**: Use logical grouping
3. **Provide Context**: Add descriptions for complex questions
4. **Use Appropriate Field Types**: Match field types to data needs
5. **Consider Mobile Users**: Forms are responsive but keep mobile UX in mind

### For Data Collection
1. **Regular Exports**: Export data regularly for backup
2. **Data Analysis**: Use Excel or Google Sheets for analysis
3. **Response Monitoring**: Check responses regularly
4. **Form Sharing**: Share forms through multiple channels

## Troubleshooting

### Common Issues

#### "Form Not Found" Error
- Check if the form URL is correct
- Ensure the form hasn't been deleted
- Contact the form creator

#### "Submission Failed" Error
- Check internet connection
- Ensure all required fields are filled
- Try refreshing the page and submitting again

#### "Login Failed" Error
- Verify username and password
- Check if account exists
- Try password reset if available

#### CSV Export Not Working
- Check if you have responses to export
- Ensure you're logged in as the form creator
- Try a different browser

### Getting Help
If you encounter issues:
1. Check this user guide
2. Verify your internet connection
3. Try refreshing the page
4. Contact system administrator

## Security and Privacy

### Data Protection
- All data is securely stored
- Passwords are encrypted
- Forms use HTTPS encryption
- No data is shared with third parties

### Privacy Considerations
- Only form creators can see responses
- Public forms don't require personal information
- Users can choose what information to share

### Best Practices
- Don't collect unnecessary personal data
- Be transparent about data usage
- Regularly export and backup important data
- Use strong passwords for admin accounts

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Responsive Design
The platform works on:
- Desktop computers
- Tablets
- Smartphones
- All screen sizes

## API Information
For developers who want to integrate with the platform:

### Base URL
`http://localhost:5000/api` (development)
`https://your-domain.com/api` (production)

### Authentication
- JWT tokens required for admin operations
- Public form submission doesn't require authentication

### Key Endpoints
- `POST /auth/register` - Register new admin
- `POST /auth/login` - Admin login
- `GET /forms` - Get all forms (admin only)
- `POST /forms` - Create new form (admin only)
- `GET /forms/:id/public` - Get public form data
- `POST /responses` - Submit form response
- `GET /responses/export/:formId` - Export responses as CSV

## Version Information
- **Version**: 1.0.0
- **Last Updated**: January 2024
- **Platform**: MERN Stack
- **License**: MIT
