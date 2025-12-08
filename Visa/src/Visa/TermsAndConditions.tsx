const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Terms & Conditions – Visaafy
          </h1>
          <p className="text-gray-500">
            Effective Date: November 27, 2025
          </p>
          <p className="text-gray-500 mt-1">
            Company: <strong>Kehar Travel Services Pvt. Ltd.</strong> <br />
            Website: <strong>Visaafy.com</strong>
          </p>
        </div>

        <div className="prose prose-gray max-w-none text-gray-700">

          {/* 1. INTRODUCTION */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            1. Introduction
          </h2>
          <p>
            By accessing Visaafy.com or engaging with Kehar Travel Services Pvt. Ltd., 
            you agree to comply with and be bound by the following Terms of Use. 
            These terms apply to all users, clients, and visitors.
          </p>

          {/* 2. ACCEPTANCE */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            2. Acceptance of Terms
          </h2>
          <p>
            By using this platform, you acknowledge that you have read, understood,
            and agreed to these Terms of Use, as well as our Privacy Policy. 
            If you do not agree, you must discontinue use of the platform immediately.
          </p>

          {/* 3. SERVICES */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            3. Services Offered
          </h2>
          <p>We provide services including but not limited to:</p>
          <ul className="list-disc pl-6">
            <li>Visa consultancy and documentation assistance.</li>
            <li>Travel planning and itinerary services.</li>
            <li>Tourism services and bookings via partners.</li>
            <li>Information and advisory related to travel requirements.</li>
          </ul>
          <p className="mt-3">
            We do not guarantee visa approval and do not influence embassy decisions.
          </p>

          {/* 4. VISA DISCLAIMER */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            4. Visa Disclaimer
          </h2>
          <p>
            All visa decisions are taken solely by the concerned embassy, consulate, 
            or immigration authority. Our role is strictly limited to documentation 
            support and advisory based on publicly available rules.
          </p>
          <p className="mt-3">
            Refunds will not be issued for visa rejections, delays, or embassy decisions.
          </p>

          {/* 5. USER RESPONSIBILITIES */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            5. User Responsibilities
          </h2>
          <p>By using Visaafy, you agree to:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Provide accurate, truthful, and complete information in visa applications.</li>
            <li>Use the platform only for lawful purposes without fraud or misuse.</li>
            <li>Authorize Visaafy to prepare and submit visa applications on your behalf.</li>
            <li>Ensure all uploaded documents are legally obtained and valid.</li>
            <li>Kehar Travel Services is not responsible for errors due to incorrect information submitted by clients.</li>
          </ol>

          {/* 6. SERVICE SCOPE */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            6. Service Scope
          </h2>
          <p>Visaafy provides visa assistance and document-handling services including:</p>
          <ul className="list-disc pl-6">
            <li>Form preparation</li>
            <li>Document checking</li>
            <li>Submission assistance (where applicable)</li>
            <li>Customer support for visa-related queries</li>
          </ul>
          <p className="mt-3">
            Visaafy does <strong>not</strong> guarantee visa approval, processing speed, or acceptance of applications.
          </p>

          {/* 7. PAYMENTS & REFUNDS */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            7. Payment, Refund & Cancellation Policy
          </h2>

          <h3 className="text-lg font-semibold mt-4">7.1 Payment</h3>
          <p>All fees listed on the platform are service fees for consultancy and processing support.</p>
          <p>Embassy fees may be separate. Fees are non-refundable unless stated otherwise.</p>

          <h3 className="text-lg font-semibold mt-4">Payment & Razorpay Terms</h3>
          <ul className="list-disc pl-6">
            <li>Visaafy uses Razorpay for secure online payments.</li>
            <li>We do NOT store any card, CVV, UPI, or banking details.</li>
          </ul>

          <h4 className="font-semibold mt-3">Accepted Methods:</h4>
          <ul className="list-disc pl-6">
            <li>Credit/Debit Cards</li>
            <li>UPI</li>
            <li>Net Banking</li>
            <li>Wallets</li>
            <li>International Cards (subject to approval)</li>
          </ul>

          <h4 className="font-semibold mt-3">Failed Transactions:</h4>
          <p>
            Amount is normally auto-reversed by Razorpay within 5–10 working days depending on your bank.
          </p>

          <h4 className="font-semibold mt-3">Refund Processing:</h4>
          <ul className="list-disc pl-6">
            <li>Refunds are returned to the original payment method.</li>
            <li>Partial refunds may apply depending on processing stage.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">7.2 Refund & Cancellation</h3>
          <ul className="list-disc pl-6">
            <li>Application fees are non-refundable once submitted to an embassy or visa center.</li>
            <li>Cancellations before submission may receive a partial refund.</li>
            <li>Credit card refunds take up to 3 days after approval.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">7.3 Cancellation</h3>
          <p>You must contact Visaafy support before your application is forwarded for processing.</p>

          {/* 8. LIABILITY */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            8. Limitation of Liability
          </h2>
          <p>Visaafy is not responsible for:</p>
          <ul className="list-disc pl-6">
            <li>Delays caused by embassies or government bodies</li>
            <li>Loss or misplacement of documents by third parties</li>
            <li>Rejections due to incorrect user information</li>
            <li>Any indirect or consequential damages</li>
          </ul>

          {/* 9. PRIVACY */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            9. Privacy & Data Protection
          </h2>
          <p>
            Your personal data is processed securely according to our Privacy Policy. 
            Information may be shared with embassies or trusted partners only for 
            application processing purposes.
          </p>

          {/* 10. IP */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            10. Intellectual Property
          </h2>
          <p>
            All website content—including text, graphics, and design—is the property of Visaafy. 
            Unauthorized copying or distribution is prohibited.
          </p>

          {/* 11. AMENDMENTS */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            11. Amendments to Terms
          </h2>
          <p>
            Visaafy may update these Terms at any time. Continued use of the platform 
            indicates acceptance of revised Terms.
          </p>

          {/* 12. GOVERNING LAW */}
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mt-8">
            12. Governing Law
          </h2>
          <p>
            These Terms are governed by local laws applicable to Visaafy. 
            Any legal disputes shall be handled according to the jurisdiction’s regulations.
          </p>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
