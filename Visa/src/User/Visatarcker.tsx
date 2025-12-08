import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Clock, Circle } from 'lucide-react';

interface StatusStep {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
  date: string;
  rejectionReason?: string;
}

interface ApiStatus {
  label: string;
  date: string;
  rejectionReason?: string;
}

const VisaStatusTracker = () => {
  const { paymentId } = useParams(); // Get ID from URL using React Router
  const [statusData, setStatusData] = useState<StatusStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/VisaApplication/status/${paymentId}`
        );
        const data = await response.json();
        
        // Fallback: If no statusHistory returned, try to resolve by searching all applications
        let statusHistory: ApiStatus[] = Array.isArray(data?.statusHistory) ? data.statusHistory : [];

        if (!statusHistory.length) {
          try {
            const allRes = await fetch('http://localhost:5000/api/VisaApplication/GetAll');
            const allData = await allRes.json();
            const apps = Array.isArray(allData?.data) ? allData.data : [];
            // Match by any of paymentId, paymentOrderId (which can be an orderId for cash), or _id
            const matched = apps.find((app: any) =>
              app.paymentId === paymentId || app.paymentOrderId === paymentId || app._id === paymentId
            );
            if (matched && Array.isArray(matched.statusHistory)) {
              statusHistory = matched.statusHistory;
            }
          } catch (_) {
            // ignore fallback errors; we'll show no data state below
          }
        }
        
        // Define all possible visa steps in order (excluding terminal states)
        const allPossibleSteps = [
          'pending',
          'document_received', 
          'document_verified',
          'in_process_with_embassy'
        ];

        // Transform API data to our format
        const completedSteps: StatusStep[] = statusHistory.map(
          (step: ApiStatus, index: number) => ({
            id: index + 1,
            name: step.label,
            status: 'completed',
            date: new Date(step.date).toLocaleDateString('en-CA'),
            rejectionReason: step.rejectionReason
          })
        );

        // Get the current status
        const completedStepNames = statusHistory.map((step: ApiStatus) => step.label);
        const currentStatus = completedStepNames[completedStepNames.length - 1];

        // Check if visa is approved or rejected (terminal states)
        const isApproved = currentStatus === 'visa_approved';
        const isRejected = currentStatus === 'visa_rejected';

        // Mark the last step as current instead of completed (unless it's a terminal state)
        if (completedSteps.length > 0 && !isApproved && !isRejected) {
          completedSteps[completedSteps.length - 1].status = 'current';
        }

        let pendingSteps: StatusStep[] = [];

        // If not approved or rejected, add pending steps
        if (!isApproved && !isRejected) {
          const currentStepIndex = allPossibleSteps.findIndex(step => step === currentStatus);
          
          // Add remaining process steps
          pendingSteps = allPossibleSteps
            .slice(currentStepIndex + 1)
            .map((stepName, index) => ({
              id: completedSteps.length + index + 1,
              name: stepName,
              status: 'pending' as const,
              date: ''
            }));
        }

        const transformedData = [...completedSteps, ...pendingSteps];

        setStatusData(transformedData);
      } catch (error) {
        console.error('Error fetching visa status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [paymentId]);

  const getStatusColor = (status: string, stepName?: string) => {
    if (stepName === 'visa_approved' && status === 'completed') {
      return 'bg-green-600';
    }
    if (stepName === 'visa_rejected' && status === 'completed') {
      return 'bg-red-600';
    }
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500 animate-pulse';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'current':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Circle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p>Loading visa status...</p>
      </div>
    );
  }

  if (!statusData.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p>No status data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">
        Your Visa Application Status
      </h2>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-4 top-0 h-full w-1 bg-gray-200 -z-10"></div>
        
        {/* Steps */}
        <div className="space-y-8">
          {statusData.map((step) => (
            <div key={step.id} className="flex items-start gap-4">
              {/* Status circle */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${getStatusColor(step.status, step.name)}`}>
                {getStatusIcon(step.status)}
              </div>
              
              {/* Step details */}
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  step.name === 'visa_approved' && step.status === 'completed' ? 'text-green-700' :
                  step.name === 'visa_rejected' && step.status === 'completed' ? 'text-red-700' :
                  step.status === 'current' ? 'text-blue-600' : 
                  step.status === 'completed' ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {step.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                {step.status === 'completed' && step.date && step.name === 'visa_approved' && (
                  <p className="text-sm text-green-700 mt-1 font-semibold">
                    🎉 Congratulations! Your visa has been approved on {step.date}
                  </p>
                )}
                {step.status === 'completed' && step.date && step.name === 'visa_rejected' && (
                  <div className="mt-1">
                    <p className="text-sm text-red-700 font-semibold">
                      ❌ Sorry, your visa application was rejected on {step.date}
                    </p>
                    {step.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
                        <span className="font-semibold">Reason: </span>
                        {step.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
                {step.status === 'completed' && step.date && step.name !== 'visa_approved' && step.name !== 'visa_rejected' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Completed on: {step.date}
                  </p>
                )}
                {step.status === 'current' && (
                  <p className="text-sm text-blue-500 mt-1">
                    Currently in progress
                  </p>
                )}
                {step.status === 'pending' && (
                  <p className="text-sm text-gray-400 mt-1">
                    Pending
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status legend */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
            <Check className="w-3 h-3" />
          </div>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <Clock className="w-3 h-3" />
          </div>
          <span className="text-sm">Current Step</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white">
            <Circle className="w-3 h-3" />
          </div>
          <span className="text-sm">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default VisaStatusTracker;