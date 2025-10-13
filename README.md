# GoVissa - Visa Application Management System

A comprehensive visa application management platform built with modern web technologies.

## 🏗️ Project Structure

### Backend Services
- **Back-End/**: Node.js backend with Express.js
  - User management and authentication
  - Visa application processing
  - Admin dashboard functionality
  - File upload and document management

### Frontend Applications
- **Visa/**: Main visa application portal (React/Vite)
- **GoVisaaL/**: Mobile application (React Native/Expo)
- **Hotel-Management/**: Hotel booking management system

### Microservices
- **EasyOcr/**: Python-based OCR service for document processing
  - Passport text extraction
  - Document verification
  - Cloud deployment ready

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Visa Applications**: Complete visa application workflow
- **Document Processing**: OCR-powered document scanning and verification
- **Admin Dashboard**: Administrative controls and monitoring
- **Hotel Integration**: Hotel booking management
- **Mobile Support**: Cross-platform mobile application

## 🛠️ Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Cloudinary for file storage
- JWT authentication
- Multer for file uploads

### Frontend
- React.js with Vite
- React Native (Expo)
- TypeScript
- Modern CSS/Styling

### Services
- Python with EasyOCR
- Google Cloud Platform deployment
- Docker containerization

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd Back-End
npm install
npm start
```

### Frontend Setup
```bash
cd Visa
npm install
npm run dev
```

### Mobile App Setup
```bash
cd GoVisaaL
npm install
npx expo start
```

### OCR Service Setup
```bash
cd EasyOcr
pip install -r requirements.txt
python main.py
```

## 🔧 Configuration

1. Create `.env` files in respective directories
2. Configure MongoDB connection
3. Set up Cloudinary credentials
4. Configure authentication secrets

## 📱 Applications

### Main Visa Portal
- User registration and login
- Visa application submission
- Document upload and verification
- Application status tracking

### Mobile App
- Cross-platform mobile experience
- Offline capability
- Push notifications

### Admin Dashboard
- User management
- Application processing
- Analytics and reporting

## 🐳 Deployment

The project includes Docker configurations and Google Cloud Platform deployment files for easy scaling and deployment.

## 📄 License

This project is proprietary software for GoVissa visa services.

## 🤝 Contributing

Please contact the development team for contribution guidelines.

## 📞 Support

For technical support, please contact the GoVissa development team.
