import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CSSProperties } from 'react';
import GovisaaLogo from '../assets/logo.jpeg';

interface TravellerDetails {
  adults?: number;
  children?: number;
  youngChildren?: number;
  total?: number;
}

interface Payment {
  _id: string;
  orderId: string;
  amount: string | number; // Can be string from API
  currency: string;
  country: string;
  status: string;
  email: string;
  phone: string;
  selectedDate: string;
  travellers: number;
  travellerDetails?: TravellerDetails;
  createdAt: number;
  paidAt?: string;
  paymentId?: string;
  paymentMethod?: string; // Added for cash payments
  paymentType?: string; // Added for cash payments
}

const Bill = () => {
  const billRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [customerName, setCustomerName] = useState<string>('');

  useEffect(() => {
    if (!location.state?.payment) {
      navigate('/'); // Redirect if no payment data
      return;
    }
    setPayment(location.state.payment);
    
    // Fetch customer name from API
    fetchCustomerName(location.state.payment.paymentId);

    // Fallback name immediately when no paymentId (e.g., cash payments)
    if (!location.state.payment.paymentId && location.state.payment.email) {
      const fallbackName = location.state.payment.email.split('@')[0];
      setCustomerName(fallbackName);
    }
  }, [location, navigate]);

  const fetchCustomerName = async (paymentId: string | undefined) => {
    if (!paymentId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/payments/customer-name/${paymentId}`);
      const result = await response.json();
      
      if (result.success) {
        setCustomerName(result.data.customerName);
      } else {
        // Fallback to email username
        setCustomerName(location.state.payment.email.split('@')[0]);
      }
    } catch (error) {
      console.error('Error fetching customer name:', error);
      // Fallback to email username
      setCustomerName(location.state.payment.email.split('@')[0]);
    }
  };

  const handleDownloadPDF = () => {
    const input = billRef.current;
    if (input) {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Kehar_Travel_Invoice_${payment?.orderId}.pdf`);
      });
    }
  };

  const formatDate = (dateString: string | number) => {
    if (typeof dateString === 'number') {
      // If timestamp is in seconds, convert to ms; if already ms, use as-is
      const ts = dateString < 1e12 ? dateString * 1000 : dateString;
      return new Date(ts).toLocaleDateString('en-IN');
    }
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const calculateTaxes = (amount: string | number) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    // Amount already includes 18% GST (9% CGST + 9% SGST)
    // Reverse calculate: base amount excluding GST
    const baseAmount = numericAmount / 1.18;
    const cgst = baseAmount * 0.09; // 9% CGST
    const sgst = baseAmount * 0.09; // 9% SGST
    const total = baseAmount + cgst + sgst; // Should equal numericAmount (₹5690)
    return { subtotal: baseAmount, cgst, sgst, total };
  };

  if (!payment) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <p>Loading payment details...</p>
      </div>
    );
  }

  const { subtotal, cgst, sgst, total } = calculateTaxes(payment.amount);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
    },
    billContainer: {
      width: '210mm',
      minHeight: '297mm',
      backgroundColor: '#ffffff',
      margin: '0 auto',
      padding: '32px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '2px solid #d1d5db',
      paddingBottom: '16px',
    },
    logoContainer: {
      width: '33%',
    },
    logo: {
      width: '192px',
      height: 'auto',
    },
    headerRight: {
      width: '66%',
      textAlign: 'right',
    },
    invoiceTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '8px',
    },
    companyInfo: {
      fontSize: '14px',
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    detailsContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      margin: '24px 0',
    },
    detailBox: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '4px',
      padding: '12px',
    },
    invoiceInfo: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '16px 0',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      width: '256px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '24px 0',
    },
    tableHeader: {
      backgroundColor: '#1f2937',
      color: '#ffffff',
    },
    tableCell: {
      padding: '8px',
      textAlign: 'left',
      border: '1px solid #d1d5db',
    },
    totalsContainer: {
      marginLeft: 'auto',
      width: '288px',
      margin: '24px 0',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      borderBottom: '1px solid #d1d5db',
    },
    totalAmount: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: '18px',
      paddingTop: '8px',
    },
    footer: {
      marginTop: '40px',
      borderTop: '2px solid #d1d5db',
      paddingTop: '16px',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
    },
    footerText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#4b5563',
      marginTop: '32px',
    },
    button: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontWeight: 'bold',
      padding: '8px 24px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      margin: '16px auto',
      display: 'block',
    },
  };

  return (
    <div style={styles.container}>
      <div ref={billRef} style={styles.billContainer}>
        {/* Header with logo */}
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={GovisaaLogo} alt="Govisaa Logo" style={styles.logo} />
          </div>
          <div style={styles.headerRight}>
            <h1 style={styles.invoiceTitle}>TAX INVOICE</h1>
            <div style={styles.companyInfo}>
              <p style={{ fontWeight: 'bold' }}>
                KEHAR TRAVEL SERVICES PRIVATE LIMITED
              </p>
              <p>GSTIN: 06AACCK3779PZZU</p>
              <p style={{ marginTop: '4px', fontSize: '12px' }}>
                Registration Valid From: 15/02/2022
              </p>
            </div>
          </div>
        </header>

        {/* Customer & Visa Details */}
        <div style={styles.detailsContainer}>
          <div>
            <h2 style={styles.sectionTitle}>Customer Details:</h2>
            <div style={styles.detailBox}>
              <p style={{ fontWeight: '500' }}>Name: {customerName}</p>
              <p>Email: {payment.email}</p>
              <p>Contact: {payment.phone}</p>
              <p>Booking Date: {formatDate(payment.createdAt)}</p>
            </div>
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Booking Details:</h2>
            <div style={styles.detailBox}>
              <p style={{ fontWeight: '500' }}>Order ID: {payment.orderId}</p>
              {payment.paymentMethod === 'cash' || payment.paymentType === 'cash' ? (
                <p>Payment Method: Cash</p>
              ) : (
                <p>Payment ID: {payment.paymentId || 'N/A'}</p>
              )}
              <p>Country: {payment.country}</p>
              <p>Travel Date: {formatDate(payment.selectedDate)}</p>
              <p>Travellers: {payment.travellers}</p>
              <p>
                Traveller Breakdown: {payment.travellerDetails?.adults || 0} Adult{(payment.travellerDetails?.adults || 0) > 1 ? 's' : ''}, {payment.travellerDetails?.children || 0} Child{(payment.travellerDetails?.children || 0) > 1 ? 'ren' : ''}, {payment.travellerDetails?.youngChildren || 0} Infant{(payment.travellerDetails?.youngChildren || 0) > 1 ? 's' : ''}
              </p>
              {payment.travellerDetails && (
                <div style={{ marginTop: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={styles.tableCell}>Type</th>
                        <th style={styles.tableCell}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={styles.tableCell}>Adults</td>
                        <td style={styles.tableCell}>{payment.travellerDetails.adults || 0}</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Children</td>
                        <td style={styles.tableCell}>{payment.travellerDetails.children || 0}</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Young Children</td>
                        <td style={styles.tableCell}>{payment.travellerDetails.youngChildren || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div style={styles.invoiceInfo}>
          <div style={styles.infoGrid}>
            <div style={{ fontWeight: 'bold' }}>Invoice Number:</div>
            <div style={{ textAlign: 'right' }}>{payment.orderId}</div>
            <div style={{ fontWeight: 'bold' }}>Date:</div>
            <div style={{ textAlign: 'right' }}>{formatDate(payment.createdAt)}</div>
            <div style={{ fontWeight: 'bold' }}>GST Category:</div>
            <div style={{ textAlign: 'right' }}>Regular</div>
          </div>
        </div>

        {/* Items Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>S.No</th>
              <th style={styles.tableCell}>Service</th>
              <th style={styles.tableCell}>Description</th>
              <th style={styles.tableCell}>Country</th>
              <th style={styles.tableCell}>HSN/SAC</th>
              <th style={styles.tableCell}>Qty</th>
              <th style={styles.tableCell}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.tableCell}>1</td>
              <td style={styles.tableCell}>Visa Processing</td>
              <td style={styles.tableCell}>
                Travel visa service for {payment.travellers} person(s) — {payment.travellerDetails?.adults || 0} Adult{(payment.travellerDetails?.adults || 0) > 1 ? 's' : ''}, {payment.travellerDetails?.children || 0} Child{(payment.travellerDetails?.children || 0) > 1 ? 'ren' : ''}, {payment.travellerDetails?.youngChildren || 0} Infant{(payment.travellerDetails?.youngChildren || 0) > 1 ? 's' : ''}
              </td>
              <td style={styles.tableCell}>{payment.country}</td>
              <td style={styles.tableCell}>9983</td>
              <td style={styles.tableCell}>{payment.travellers}</td>
              <td style={styles.tableCell}>{subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div style={styles.totalsContainer}>
          <div style={styles.totalRow}>
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>CGST (9%):</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>SGST (9%):</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
          <div style={styles.totalAmount}>
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerGrid}>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Bank Details:
              </h3>
              <p>Account Name: KEHAR TRAVEL SERVICES PVT LTD</p>
              <p>Account Number: XXXX XXXX XXXX 1523</p>
              <p>Bank Name: Example Bank</p>
              <p>IFSC Code: EXMP0000123</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '48px' }}>Authorized Signatory</p>
              <p>For KEHAR TRAVEL SERVICES PVT LTD</p>
            </div>
          </div>
          <div style={styles.footerText}>
            <p>GSTIN: 06AACCK3779PZZU | Registration Valid From: 15/02/2022</p>
            <p style={{ marginTop: '8px' }}>
              Thank you for choosing Govisaa - Your Gateway to the World!
            </p>
          </div>
        </footer>
      </div>

      <button onClick={handleDownloadPDF} style={styles.button}>
        Download as PDF
      </button>
    </div>
  );
};

export default Bill;