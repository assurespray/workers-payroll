# 🏗️ Construction Workers & Payroll Management System

Complete MERN stack application for managing construction workers, attendance tracking, contractor management, and payroll calculations.

## 📋 Features

### Employee Management
- ✅ Add/Edit/Delete employees with complete details
- ✅ Encrypted Aadhar number storage
- ✅ Bank details management
- ✅ Search and filter functionality

### Contractor Management
- ✅ Manage multiple contractors
- ✅ Add multiple work sites per contractor
- ✅ Track active work locations
- ✅ Site details with address and description

### Attendance System
- ✅ Multi-step attendance marking process
- ✅ Select contractor → site → employees → shift type → date
- ✅ Three shift types: Half Day, Full Day, Double Shift
- ✅ Bulk attendance entry for multiple workers
- ✅ Attendance history with filters
- ✅ Delete/Edit attendance records

### Reporting
- ✅ Contractor-wise reports (by site and date range)
- ✅ Employee-wise reports (work history)
- ✅ Shift breakdown (half/full/double days)
- ✅ Total equivalent days calculation
- ✅ Export to Excel functionality

### Payroll (Ready for Extension)
- ✅ Configurable rates per shift type
- ✅ Automatic calculation structure
- ✅ Deductions support
- ✅ Monthly payroll generation ready

## 🚀 Tech Stack

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas)
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **crypto-js** - Aadhar encryption
- **ExcelJS** - Excel export

### Frontend
- **React 18** - UI library
- **Material-UI v5** - Component library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **ExcelJS** - Excel export

### Deployment
- **Render.com** - Hosting (0.0.0.0:10000)
- **MongoDB Atlas** - Cloud database

## 📦 Project Structure

construction-workers-payroll/
├── backend/
│ ├── models/ # Database schemas
│ ├── controllers/ # Business logic
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & validation
│ ├── utils/ # Helper functions
│ └── server.js # Main server file
├── frontend/
│ ├── public/ # Static files
│ └── src/
│ ├── components/ # React components
│ ├── services/ # API services
│ └── utils/ # Helper functions
├── render.yaml # Deployment config
├── README.md # This file
└── DEPLOYMENT.md # Deployment guide

## 🔧 Environment Variables

### Backend (.env)
PORT=10000
HOST=0.0.0.0
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_32_char_secret
JWT_EXPIRE=30d
AADHAR_ENCRYPTION_KEY=your_32_char_key
CLIENT_URL=https://your-frontend.onrender.com

### Frontend (.env)
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_ENV=production


## 💻 Local Development

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
    git clone <your-repo-url>
    cd construction-workers-payroll

2. **Backend Setup**
    cd backend
    npm install
    cp .env.example .env

    Edit .env with your values
    npm start


3. **Frontend Setup**
    cd frontend
    npm install
    cp .env.example .env

    Edit .env with your backend URL
    npm start


4. **Generate JWT Secret and Encryption Key**
    JWT Secret (32+ characters)
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

    Aadhar Encryption Key (32 characters)
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Contractors
- `GET /api/contractors` - Get all contractors
- `POST /api/contractors` - Create contractor
- `GET /api/contractors/:id/sites` - Get contractor sites
- `POST /api/contractors/:id/sites` - Add site
- `PUT /api/contractors/:id/sites/:siteId` - Update site
- `DELETE /api/contractors/:id/sites/:siteId` - Delete site

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get attendance records
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

### Reports
- `GET /api/reports/contractor` - Contractor report
- `GET /api/reports/employee` - Employee report
- `GET /api/reports/summary` - Attendance summary

### Payroll
- `GET /api/payroll/settings` - Get payroll settings
- `PUT /api/payroll/settings/:id` - Update settings
- `GET /api/payroll/calculate/:employeeId` - Calculate payroll

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Aadhar number encryption with AES
- Input validation
- Rate limiting
- Helmet.js security headers
- CORS protection

## 📊 Database Models

### Employee
- Personal info (name, phone, Aadhar)
- Bank details (account, IFSC, bank name)
- Auto-generated employee ID (EMP2510001)
- Active/inactive status

### Contractor
- Basic info (name, contact)
- Embedded sites array
- Auto-generated contractor ID (CON2510001)

### Attendance
- Employee, contractor, site references
- Date and shift type
- Remarks field
- Timestamps

### PayrollSettings
- Configurable rates per shift type
- Deduction settings
- Calculation methods

## 🎯 Future Enhancements

- SMS notifications
- Biometric attendance integration
- Advanced payroll generation
- Multi-language support
- Mobile app (React Native)
- Supervisor approvals
- Advance payment tracking
- Leave management
- Performance analytics

## 📝 License

This project is proprietary software.

## 👥 Support

For support, email: support@example.com

## 🙏 Acknowledgments

- Material-UI for the amazing component library
- Render.com for free hosting
- MongoDB Atlas for database hosting

