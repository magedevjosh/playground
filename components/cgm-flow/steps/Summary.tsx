import { FlowAnswers, DEVICES, TIME_RANGES } from '@/types/cgm-flow';

interface SummaryProps {
  answers: FlowAnswers;
}

export default function Summary({ answers }: SummaryProps) {
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
            <dt className="text-sm font-medium text-gray-600 mb-1">Currently Using CGM</dt>
            <dd className="text-base text-gray-900">{formatBoolean(answers.currentlyUsingCGM)}</dd>
          </div>

          {answers.currentDevice && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Current Device</dt>
              <dd className="text-base text-gray-900">{getDeviceName(answers.currentDevice)}</dd>
            </div>
          )}

          {answers.lastDeviceUpdate && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Last Device Update</dt>
              <dd className="text-base text-gray-900">
                {getTimeRangeLabel(answers.lastDeviceUpdate, 'deviceUpdate')}
              </dd>
            </div>
          )}

          {answers.lastSensorsOrdered && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Last Sensors Ordered</dt>
              <dd className="text-base text-gray-900">
                {getTimeRangeLabel(answers.lastSensorsOrdered, 'sensorsOrdered')}
              </dd>
            </div>
          )}

          {answers.deviceSwitchIntention !== null && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Interested in Switching</dt>
              <dd className="text-base text-gray-900">
                {formatBoolean(answers.deviceSwitchIntention)}
              </dd>
            </div>
          )}

          {answers.deviceSelection && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Selected Device</dt>
              <dd className="text-base text-gray-900">{getDeviceName(answers.deviceSelection)}</dd>
            </div>
          )}

          {answers.lastDoctorVisit !== null && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">
                Seen Doctor in Last 6 Months
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

