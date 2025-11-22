interface RadioOptionProps {
  id: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
}

export default function RadioOption({
  id,
  label,
  value,
  checked,
  onChange,
  name,
}: RadioOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center p-4 border-2 cursor-pointer transition-all ${
        checked
          ? 'bg-primary-light'
          : 'border-gray-300 hover:border-gray-400 bg-white'
      }`}
      style={checked ? { borderColor: '#d2bed8' } : undefined}
      data-testid={`radio-option-${value}`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-5 h-5 focus:ring-2"
        style={{ accentColor: '#d2bed8' }}
        data-testid={`radio-input-${value}`}
      />
      <span className={`ml-3 text-lg ${checked ? 'font-semibold' : 'text-gray-700'}`}
        style={checked ? { color: '#9d7ea7' } : undefined}>
        {label}
      </span>
    </label>
  );
}

