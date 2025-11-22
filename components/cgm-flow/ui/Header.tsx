interface HeaderProps {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="w-full py-6 mb-8">
      <div className="flex justify-center items-center">
        <button
          onClick={onLogoClick}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Return to first step"
        >
          <img 
            src="https://aeroflowdiabetes.com/media/logo/stores/37/RGB__Aeroflow_Diabetes_Horizontal_Black-2101x257-813447f.png"
            alt="Aeroflow Diabetes"
            className="h-12 w-auto"
          />
        </button>
      </div>
    </header>
  );
}

