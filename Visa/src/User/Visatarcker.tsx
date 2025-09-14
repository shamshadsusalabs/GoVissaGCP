import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface StatusStep {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
  date: string;
}

interface ApiStatus {
  label: string;
  date: string;
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
        
        // Transform API data to our format
        const transformedData = data.statusHistory.map(
          (step: ApiStatus, index: number) => ({
            id: index + 1,
            name: step.label,
            status: 'completed' as const,
            date: new Date(step.date).toLocaleDateString('en-CA') // Format to YYYY-MM-DD
          })
        );

        // Add current and pending statuses
        if (transformedData.length > 0) {
          // Mark last step as current
          transformedData[transformedData.length - 1].status = 'current';
          
          // Add pending steps if needed (example structure)
        
        }

        setStatusData(transformedData);
      } catch (error) {
        console.error('Error fetching visa status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [paymentId]);

  const getStatusColor = (status: string) => {
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
        return '✓';
      case 'current':
        return '...';
      case 'pending':
        return '○';
      default:
        return '○';
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
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${getStatusColor(step.status)}`}>
                {getStatusIcon(step.status)}
              </div>
              
              {/* Step details */}
              <div className="flex-1">
                <h3 className={`font-semibold ${step.status === 'current' ? 'text-blue-600' : 'text-gray-800'}`}>
                  {step.name}
                </h3>
                {step.date && (
                  <p className="text-sm text-gray-500 mt-1">
                    Completed on: {step.date}
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
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm">Current Step</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-300"></div>
          <span className="text-sm">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default VisaStatusTracker;