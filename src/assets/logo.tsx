import logoImage from './logo.png';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => (
  <div className={`relative ${className}`}>
    <img
      src={logoImage}
      alt="Company Logo"
      className="w-full h-full object-contain"
      style={{ filter: 'brightness(0) invert(1)' }} // Makes the logo white in dark backgrounds
    />
  </div>
);
