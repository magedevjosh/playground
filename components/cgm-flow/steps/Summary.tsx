import { FlowAnswers, DEVICES, TIME_RANGES, StepId } from '@/types/cgm-flow';

interface SummaryProps {
  answers: FlowAnswers;
  onEditStep?: (stepId: StepId) => void;
}

export default function Summary({ answers, onEditStep }: SummaryProps) {
  const getDeviceName = (deviceId: string | null) => {
    if (!deviceId) return 'Not specified';
    const device = DEVICES.find((d) => d.id === deviceId);
    return device ? device.name : deviceId;
  };

  const getTimeRangeLabel = (rangeId: string | null, type: 'deviceUpdate' | 'sensorsOrdered') => {
    if (!rangeId) return 'Not specified';
    const range = TIME_RANGES[type].find((r) => r.id === rangeId);
    return range ? range.label : rangeId;
  };

  const formatBoolean = (value: boolean | null) => {
    if (value === null) return 'Not specified';
    return value ? 'Yes' : 'No';
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary-light p-6" style={{ borderWidth: '1px', borderColor: '#d2bed8' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#9d7ea7' }}>
          Your CGM Experience Profile
        </h3>
        <div className="space-y-4">
          <div>
            <dt className="text-sm font-medium mb-1">
              <button
                onClick={() => onEditStep?.('currently-using-cgm')}
                className="text-gray-600 hover:text-primary-dark hover:underline cursor-pointer text-left w-full"
                data-testid="edit-currently-using-cgm"
              >
                Currently Using CGM
              </button>
            </dt>
            <dd className="text-base text-gray-900">{formatBoolean(answers.currentlyUsingCGM)}</dd>
          </div>

          {answers.currentDevice && (
            <div>
              <dt className="text-sm font-medium mb-1">
                <button
                  onClick={() => onEditStep?.('current-device')}
                  className="text-gray-600 hover:text-primary-dark hover:underline cursor-pointer text-left w-full"
                  data-testid="edit-current-device"
                >
                  Current Device
                </button>
              </dt>
              <dd className="text-base text-gray-900">{getDeviceName(answers.currentDevice)}</dd>
            </div>
          )}

          {answers.lastDeviceUpdate && (
            <div>
              <dt className="text-sm font-medium mb-1">
                <button
                  onClick={() => onEditStep?.('last-device-update')}
                  className="text-gray-600 hover:text-primary-dark hover:underline cursor-pointer text-left w-full"
                  data-testid="edit-last-device-update"
                >
                  Last Device Update
                </button>
              </dt>
              <dd className="text-base text-gray-900">
                {getTimeRangeLabel(answers.lastDeviceUpdate, 'deviceUpdate')}
              </dd>
            </div>
          )}

          {answers.lastSensorsOrdered && (
            <div>
              <dt className="text-sm font-medium mb-1">
                <button
                  onClick={() => onEditStep?.('last-sensors-ordered')}
                  className="text-gray-600 hover:text-primary-dark hover:underline cursor-pointer text-left w-full"
                  data-testid="edit-last-sensors-ordered"
                >
                  Last Sensors Ordered
                </button>
              </dt>
              <dd className="text-base text-gray-900">
                {getTimeRangeLabel(answers.lastSensorsOrdered, 'sensorsOrdered')}
              </dd>
            </div>
          )}

          {answers.deviceSwitchIntention !== null && (
            <div>
              <dt className="text-sm font-medium mb-1">
                <button
                  onClick={() => onEditStep?.('device-switch-intention')}
                  className="text-gray-600 hover:text-primary-dark hover:underline cursor-pointer text-left w-full"
                  data-testid="edit-device-switch-intention"
                >
                  Interested in Switching
                </button>
              </dt>
              <dd className="text-base text-gray-900">
                {formatBoolean(answers.deviceSwitchIntention)}
              </dd>
            </div>
          )}

          {answers.deviceSelection && (
            <div>
              <dt className="text-sm font-medium mb-1">
                <button
                  onClick={() => onEditStep?.('device-selection')}
                  className="text-gray-600 hover:text-primary-dark hover:underline cursor-pointer text-left w-full"
                  data-testid="edit-device-selection"
                >
                  Selected Device
                </button>
              </dt>
              <dd className="text-base text-gray-900">{getDeviceName(answers.deviceSelection)}</dd>
            </div>
          )}

          {answers.lastDoctorVisit !== null && (
            <div>
              <dt className="text-sm font-medium mb-1">
                <button
                  onClick={() => onEditStep?.('last-doctor-visit')}
                  className="text-gray-600 hover:text-primary-dark hover:underline cursor-pointer text-left w-full"
                  data-testid="edit-last-doctor-visit"
                >
                  Seen Doctor in Last 6 Months
                </button>
              </dt>
              <dd className="text-base text-gray-900">{formatBoolean(answers.lastDoctorVisit)}</dd>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 mt-6">
        Thank you for completing the CGM device selection experience.
      </div>
    </div>
  );
}

