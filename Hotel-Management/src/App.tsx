import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';

// Lazy loaded components for Main Layout
const Hotel = lazy(() => import('./_pages/Hotels/domesticHotels/Hotel'));
const TravelRecomandations = lazy(() => import('./_pages/Hotels/domesticHotels/TravelRecomandations'));
const Service = lazy(() => import('./_pages/Hotels/domesticHotels/Service'));
const Patner = lazy(() => import('./_pages/Hotels/domesticHotels/Patner'));
const Footer = lazy(() => import('./_pages/Hotels/domesticHotels/Footer'));

const OverseasHotels = lazy(() => import('./_pages/Hotels/OverseasHotels/OverseasHotels'));
const HotelAffilation = lazy(() => import('./_pages/Hotels/OverseasHotels/HotelAffiliation'));

const FlightSearch = lazy(() => import('./_pages/Flights/domesticFlights/FlightSearch'));
const LowPriceExpress = lazy(() => import('./_pages/Flights/domesticFlights/LowPriceExpress'));
const InterNational = lazy(() => import('./_pages/Flights/OverseasFlights/InterNational'));

// Admin Layout and Pages
const AdminLayout = lazy(() => import('./Admin_Pages/AdminLayout'));
const AdminDashboard = lazy(() => import('./Admin_Pages/AdminDashBoard'));

const AllUser = lazy(() => import('./Admin_Pages/User/AllUser'));
const FlightBookings = lazy(() => import('./Admin_Pages/User/FlightBookings'));
const HotelBookings = lazy(() => import('./Admin_Pages/User/HotelBookings'));
const TransPorts = lazy(() => import('./Admin_Pages/User/TransPorts'));
const VisaConfig = lazy(() => import('./Admin_Pages/VisaConfiq/visaconfig'));

const AllCorporateUsers = lazy(() => import('./Admin_Pages/Corporate/AllCorporateUsers'));
const CorporateFlightBookings = lazy(() => import('./Admin_Pages/Corporate/CorporateFlightBookings'));
const CorporateHotelBookings = lazy(() => import('./Admin_Pages/Corporate/CorporateHotelBookings'));
const CorporateTransportBookings = lazy(() => import('./Admin_Pages/Corporate/CorporateTransportBookings'));

const AllAgents = lazy(() => import('./Admin_Pages/agents/AllAgents'));
const AgentIncomeDetails = lazy(() => import('./Admin_Pages/agents/AgentIncomeDetails'));

const AgentsLayout = lazy(() => import('./Agents_Pages/AgentsLayout'));
const AgentsdashBoard = lazy(() => import('./Agents_Pages/AgentsdashBoard'));
const AgentPackageSales = lazy(() => import('./Agents_Pages/AgentPackageSales'));
const AgentPackageStats = lazy(() => import('./Agents_Pages/AgentPackageStats'));

const UserLayout = lazy(() => import('./User_Pages/UserLayout'));
const UserDashboard = lazy(() => import('./User_Pages/UserDashboard'));
const UserFlightHistory = lazy(() => import('./User_Pages/UserFlightHistory'));
const UserHotelHistory = lazy(() => import('./User_Pages/UserHotelHistory'));
const UserTransport = lazy(() => import('./User_Pages/UserTransport'));

const CorporateLayout = lazy(() => import('./Corporate_Pages/CorporateLayout'));
const CorporateTravelDashboard = lazy(() => import('./Corporate_Pages/CorporateTravelDashboard'));
const CorporateFlightBookingsTable = lazy(() => import('./Corporate_Pages/CorporateFlightBookingsTable'));
const CorporateHotelBookingsTable = lazy(() => import('./Corporate_Pages/CorporateHotelBookingsTable'));
const CorporateTransportBookingsTable = lazy(() => import('./Corporate_Pages/CorporateTransportBookingsTable'));
const CorporateRefundTracker = lazy(() => import('./Corporate_Pages/CorporateRefundTracker'));

const Travellandingpages = lazy(() => import('./_pages/Travellandingpages'));
const Login = lazy(() => import('./Authentication/Login'));

const VisaService = lazy(() => import('./Visa/Header'));
const VisaDestinations = lazy(() => import('./Visa/VisaDestinations'));
const Banner = lazy(() => import('./Visa/Banner'));
const VisaBookingCard = lazy(() => import('./Visa/VisaBookingCard'));
const VisaRequirements = lazy(() => import('./Visa/VisaRequirements'));
const VisaProcess = lazy(() => import('./Visa/VisaProcess'));
const PassportUpload = lazy(() => import('./Visa/PassportUpload'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
        <Routes>
          {/* Public Website Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Travellandingpages />
              </Layout>
            }
          />
          <Route
            path="/domestic"
            element={
              <Layout>
                <>
                  <Hotel />
                  <TravelRecomandations />
                  <Service />
                  <Patner />
                  <Footer />
                </>
              </Layout>
            }
          />
          <Route
            path="/overseas"
            element={
              <Layout>
                <>
                  <OverseasHotels />
                  <HotelAffilation />
                  <Footer />
                </>
              </Layout>
            }
          />
          <Route
            path="/domesticFlight"
            element={
              <Layout>
                <>
                  <FlightSearch />
                  <LowPriceExpress />
                  <Footer />
                </>
              </Layout>
            }
          />
          <Route
            path="/overseasFlights"
            element={
              <Layout>
                <>
                  <FlightSearch />
                  <InterNational />
                  <Footer />
                </>
              </Layout>
            }
          />
          <Route
            path="/visa"
            element={
              <Layout>
                <VisaService />
                <VisaDestinations />
              </Layout>
            }
          />
          <Route
            path="/visa-details"
            element={
              <Layout>
                <Banner />
                <VisaBookingCard />
                <VisaRequirements />
                
                   <VisaProcess />

              </Layout>
            }
          />
             <Route  path="/PassportUpload"  element={< PassportUpload />}>
           
          </Route>

          {/* Admin Panel Routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AllUser />} />
            <Route path="users/flight-bookings" element={<FlightBookings />} />
            <Route path="users/hotel-bookings" element={<HotelBookings />} />
            <Route path="users/transport" element={<TransPorts />} />
            <Route path="corporate" element={<AllCorporateUsers />} />
            <Route path="corporate/flight-bookings" element={<CorporateFlightBookings />} />
            <Route path="corporate/hotel-bookings" element={<CorporateHotelBookings />} />
            <Route path="corporate/transport" element={<CorporateTransportBookings />} />
            <Route path="agents" element={<AllAgents />} />
            <Route path="agentIncomedetails" element={<AgentIncomeDetails />} />
            <Route path="visaconfig" element={<VisaConfig />} />
          </Route>

          {/* Agent Routes */}
          <Route path="/agent/*" element={<AgentsLayout />}>
            <Route index element={<Navigate to="AgentsdashBoard" replace />} />
            <Route path="AgentsdashBoard" element={<AgentsdashBoard />} />
            <Route path="AgentPackageSales" element={<AgentPackageSales />} />
            <Route path="AgentPackageStats" element={<AgentPackageStats />} />
          </Route>

          {/* User Routes */}
          <Route path="/user/*" element={<UserLayout />}>
            <Route index element={<Navigate to="UserDashboard" replace />} />
            <Route path="UserDashboard" element={<UserDashboard />} />
            <Route path="UserFlightHistory" element={<UserFlightHistory />} />
            <Route path="UserHotelHistory" element={<UserHotelHistory />} />
            <Route path="UserTransport" element={<UserTransport />} />
          </Route>

          {/* Corporate User Routes */}
          <Route path="/corporate/*" element={<CorporateLayout />}>
            <Route index element={<Navigate to="CorporateTravelDashboard" replace />} />
            <Route path="CorporateTravelDashboard" element={<CorporateTravelDashboard />} />
            <Route path="CorporateFlightBookingsTable" element={<CorporateFlightBookingsTable />} />
            <Route path="CorporateHotelBookingsTable" element={<CorporateHotelBookingsTable />} />
            <Route path="CorporateTransportBookingsTable" element={<CorporateTransportBookingsTable />} />
            <Route path="CorporateRefundTracker" element={<CorporateRefundTracker />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
