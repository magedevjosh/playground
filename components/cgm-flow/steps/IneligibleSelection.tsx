import { StepProps } from '@/types/cgm-flow';

export default function IneligibleSelection({ }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Unable to Provide Equipment at This Time
        </h3>
        <p className="text-gray-700 mb-4">
          Based on your responses, we are unable to provide you with equipment at this time. 
          Since you have not selected a specific device and it has not been at least 5 years 
          since your last device update, you do not meet the current eligibility requirements.
        </p>
        <p className="text-gray-700">
          If you have any questions about your eligibility, please contact our customer support team at{' '}
          <a 
            href="tel:18005550123" 
            className="text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            1-800-555-0123
          </a>
          .
        </p>
      </div>
    </div>
  );
}

