# Harvegen - Email and CSV Integration

This project now includes SMTP email functionality and CSV data storage capabilities.

## Features Added

### 📧 Email System
- **SMTP Integration**: Uses Nodemailer for sending emails
- **Welcome Emails**: Automatically sends welcome emails to new users
- **Contact Form**: Sends notifications to admin and confirmation to users
- **Configurable**: All SMTP settings can be configured via environment variables

### 📊 CSV Data Storage
- **Contact Data**: Stores all contact form submissions in `data/contacts.csv`
- **User Data**: Stores user registration data in `data/users.csv`
- **Automatic Creation**: CSV files are created automatically with proper headers
- **Safe Storage**: Handles special characters and proper CSV formatting

## Installation

```bash
npm install nodemailer
```

## Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Configure your SMTP settings in `.env.local`:
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@harvegen.com
```

### Where to Store Credentials

**IMPORTANT: Never commit `.env.local` to version control!**

Your credentials should be stored in the `.env.local` file at the root of your project. This file is automatically ignored by git (it's in `.gitignore`).

**Example `.env.local` file:**
```env
# SMTP Configuration for Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
ADMIN_EMAIL=admin@harvegen.com

# For other email providers:
# SMTP_HOST=smtp.outlook.com
# SMTP_PORT=587
# SMTP_USER=your-email@outlook.com
# SMTP_PASS=your-app-password
```

### Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to https://security.google.com/settings/security/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Harvegen App" and click "Generate"
   - Copy the 16-character password
3. **Use the App Password** in `SMTP_PASS` (NOT your regular Gmail password)

### Required Environment Variables

**These variables are REQUIRED for the email system to work:**

- `SMTP_HOST` - Your email provider's SMTP server (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP port (usually `587` for TLS)
- `SMTP_USER` - Your full email address (e.g., `your-email@gmail.com`)
- `SMTP_PASS` - Your app password or email password

**Optional but recommended:**
- `ADMIN_EMAIL` - Where admin notifications are sent (defaults to `admin@harvegen.com`)

### Quick Setup for Gmail (Most Common)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=kannajinagendra@gmail.com
SMTP_PASS=your-16-character-app-password
ADMIN_EMAIL=kannajinagendra@gmail.com
```

**Note:** Replace `kannajinagendra@gmail.com` with your actual admin email address.

### Quick Setup for Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
ADMIN_EMAIL=admin@harvegen.com
```

### Quick Setup for Yahoo

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@harvegen.com
```

### Security Notes

- **Never share your `.env.local` file**
- **Never commit it to git** (it's already in `.gitignore`)
- **Use app passwords** instead of your main email password
- **Consider using environment variables** in production deployments
- **Regularly rotate passwords** for security

### Gmail Setup
For Gmail, you'll need to:
1. Enable 2-Factor Authentication
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use the App Password in `SMTP_PASS`

## Usage

### Sending Emails
```javascript
import { sendWelcomeEmail, sendContactEmail } from './lib/email';

// Send welcome email
await sendWelcomeEmail('user@example.com', 'John Doe');

// Send contact form email
await sendContactEmail({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'Hello, I have a question...'
});
```

### Storing Data
```javascript
import { saveContact, saveUser } from './lib/csv';

// Save contact form data
saveContact({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'Hello, I have a question...'
});

// Save user registration data
saveUser({
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Files Created/Modified

### New Files
- `lib/email.js` - Email functionality with SMTP integration
- `lib/csv.js` - CSV data storage utilities
- `.env.example` - Environment variables template

### Modified Files
- `context/UserContext.js` - Added user data storage on login
- `components/About.jsx` - Enhanced contact form with email and CSV storage

## Data Storage

### Contact Data (`data/contacts.csv`)
Stores all contact form submissions with:
- Name
- Email
- Subject
- Message
- Timestamp

### User Data (`data/users.csv`)
Stores user registration information with:
- Name
- Email
- Registration timestamp

## Security Notes

- Never commit `.env.local` to version control
- Use app passwords for Gmail instead of your main password
- Consider using environment variables in production deployments
- CSV files are stored in the `data/` directory at project root

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Email templates with HTML styling
- Data export functionality
- Admin dashboard for viewing submissions