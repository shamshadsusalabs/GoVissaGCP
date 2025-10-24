// AppRoutes.tsx
import './utils/fetchWithAuth';

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import EmployeeProtectedRoute from "./EmployeeProtectedRoute";
import ManagerProtectedRouter from "./ManagerProtectedRouter";


// Lazy load Visa-related components
const Navbar = lazy(() => import('./Visa/Navbar'));
// Lazy load Visa-related components
const AboutUs = lazy(() => import('./Visa/AboutUs'));
const DetailsNavbar = lazy(() => import('./Visa/DetailsNavbar'));

const VisaDestinations = lazy(() => import('./Visa/VisaDestinations'));
const Banner = lazy(() => import('./Visa/Banner'));
const VisaBookingCard = lazy(() => import('./Visa/VisaBooking/visa-booking-card'));
const VisasOnTime = lazy(() => import('./Visa/VisasOnTime'));
const AtlysNews = lazy(() => import('./Visa/AtlysNews'));
const Faq = lazy(() => import('./Visa/Faq'));
const Footer = lazy(() => import('./Visa/Footer'));
const VisaRequirements = lazy(() => import('./Visa/VisaRequirements'));
const VisaProcess = lazy(() => import('./Visa/VisaProcess'));
const PrivacyPolicy = lazy(() => import('./Visa/PrivacyPolicy'));
const CookiesPolicy = lazy(() => import('./Visa/CookiesPolicy'));
const TermsAndConditions = lazy(() => import('./Visa/TermsAndConditions'));
const VisaRejectionReasons = lazy(() => import('./Visa/VisaRejectionReasons'));
const VisaWizard = lazy(() => import('./Admin/VisaConfiq/VisaWizard'));

// Lazy load Admin components
const AdminLayout = lazy(() => import('./Admin/AdminLayout'));
const DashboardPage = lazy(() => import('./Admin/DashboardPage'));
const Login = lazy(() => import('./Admin/Login'));
const AllVisaApplication = lazy(() => import('./Admin/AllVisaApplication'));
const VisaFullDetails = lazy(() => import('./Admin/VisaFullDeatils'));
const VisaConfigList = lazy(() => import('./Admin/VisaConfigList'));
const Employee = lazy(() => import('./Admin/Employee'));
const AllUsers = lazy(() => import('./Admin/AllUsers'));
const AllPayments = lazy(() => import('./Admin/AllPayments'));
const CouponCode = lazy(() => import('./Admin/CouponCode'));
const Manager = lazy(() => import('./Admin/Manager'));

// Lazy load User components
const Auth = lazy(() => import('./User/auth'));
const UserLayout = lazy(() => import('./User/UserLayout'));
const GovissaWelcome = lazy(() => import('./User/GovissaWelcome'));
const ApplyVisa = lazy(() => import('./User/ApplyVisa'));
const Approved = lazy(() => import('./User/Approved'));
const Rejected = lazy(() => import('./User/Rejected'));
const Visatarcker = lazy(() => import('./User/Visatarcker'));
const Bill = lazy(() => import('./User/Bill'));
const BillList = lazy(() => import('./User/BillList'));
const UploadDocuments = lazy(() => import('./User/UplodDocumnets/upload-documents'));

// Lazy load Employee components
const Loginsignup = lazy(() => import('./Employee/Loginsignup'));
const Employeelayout = lazy(() => import('./Employee/Employeelayout'));
const AllVisaApplicationEmployee = lazy(() => import('./Employee/AllVisaApplicationEmployee'));
const EmployeeDashbord = lazy(() => import('./Employee/EmployeeDashbord'));
// Lazy load Employee components
const LoginsignupManager = lazy(() => import('./Manager/Loginsignup'));
const Managerlayout = lazy(() => import('./Manager/Managerlayout'));
const AllVisaApplicationManager = lazy(() => import('./Manager/AllVisaApplication'));
const DashboardPagemanager = lazy(() => import('./Manager/DashboardPagemanager'));
const EmployeeManager = lazy(() => import('./Manager/EmployeeManager'));
const ManagerCouponcode = lazy(() => import('./Manager/ManagerCouponcode'));
const VisaFulldetailsManager = lazy(() => import('./Manager/VisaFulldetailsManager'));

function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-xl font-semibold">Loading Components...</div>}>
      <Routes>

        {/* Public Home Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
            
              <VisaDestinations />
              <VisasOnTime />
              <AtlysNews />
                <Faq />
              <Footer />
            </>
          }
        />

        {/* Visa Details Page */}
        <Route
          path="/visa-details/:id"
          element={
            <>
               <DetailsNavbar />
              <Banner /> 
              <VisaBookingCard />
               <VisaRequirements />
              <VisaProcess />
              <VisaRejectionReasons />
              <Footer />
            </>
          }
        />

        {/* Auth Page */}
        <Route
          path="/auth"
          element={
            <Auth
              onAuthSuccess={(token: string) => {
                console.log("Access token received:", token);
              }}
            />
          }
        />
         <Route path="/about" element={<  AboutUs/>} />
         <Route path="/PrivacyPolicy" element={<  PrivacyPolicy />} />
          <Route path="/CookiesPolicy" element={<  CookiesPolicy />} />
           <Route path="/TermsAndConditions" element={<  TermsAndConditions />} />

        {/* Protected User Dashboard */}
        <Route
          path="/user-dashboard/*"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GovissaWelcome />} />
          <Route path="GovissaWelcome" element={<GovissaWelcome />} />
          <Route path="ApplyVisa" element={<ApplyVisa />} />
          <Route path="Approved" element={<Approved />} />
          <Route path="Rejected" element={<Rejected />} />
          <Route path="Visatarcker/:paymentId" element={<Visatarcker />} />
          <Route path="BillList" element={<BillList />} />
          <Route path="bill" element={<Bill />} />
          <Route path="upload-documents/:visaId/:travellers/:paymentId/:country" element={<UploadDocuments />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/dashboard/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="DashboardPage" element={<DashboardPage />} />
          <Route path="VisaConfigList" element={<VisaConfigList />} />
          <Route path="visa-config-form" element={<VisaWizard />} />
            <Route path="visa-config-form-update/:id" element={<VisaWizard />} />
          <Route path="AllVisaApplication" element={<AllVisaApplication />} />
          <Route path="VisaFullDeatils/:id" element={<VisaFullDetails />} />
          <Route path="Employee" element={<Employee />} />
          <Route path="AllUsers" element={<AllUsers />} />
          <Route path="AllPayments" element={<AllPayments />} />
           <Route path="CouponCode" element={<CouponCode/>} />
            <Route path="Manager" element={<Manager/>} />
        </Route>

        {/* Employee Routes */}
        <Route path="/employee" element={<Loginsignup />} />

        <Route
          path="/employee-dashboard/*"
          element={
            <EmployeeProtectedRoute>
              <Employeelayout />
            </EmployeeProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashbord />} />
          <Route path="AllVisaApplicationEmployee" element={<AllVisaApplicationEmployee />} />
           <Route path="EmployeeDashbord" element={<EmployeeDashbord/>} />
        </Route>

         <Route path="/manager" element={<LoginsignupManager/>} />

        <Route
          path="/manager-dashboard/*"
          element={
            <ManagerProtectedRouter>
              < Managerlayout />
            </ManagerProtectedRouter>
          }
        >
          <Route index element={<DashboardPagemanager />} />
           <Route path="DashboardPagemanager" element={<DashboardPagemanager/>} />
          <Route path="AllVisaApplicationManager" element={<AllVisaApplicationManager/>} />
            <Route path="EmployeeManager" element={<EmployeeManager/>} />
            <Route path="ManagerCouponcode" element={<ManagerCouponcode/>} />
             <Route path="VisaFulldetailsManager/:id" element={<VisaFulldetailsManager/>} />
             
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<div className="text-center py-10 text-lg">404 - Page Not Found</div>} />
        
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
