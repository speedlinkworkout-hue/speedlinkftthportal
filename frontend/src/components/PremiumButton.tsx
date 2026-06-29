

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = ({
  onClick,
  label,
  type = 'button',
  disabled = false,
  children,
  className = '',
}: ButtonProps) => {
  return (
    <>
      <style>{`
        .premium-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.2em 1rem;
          cursor: pointer;
          gap: 0.5rem;
          font-weight: bold;
          border-radius: 30px;
          text-shadow: 2px 2px 3px rgb(136 0 136 / 50%);
          background: linear-gradient(15deg, #880088, #aa2068, #cc3f47, #de6f3d, #f09f33, #de6f3d, #cc3f47, #d74993ff, #880088) no-repeat;
          background-size: 300%;
          color: #fff;
          border: none;
          background-position: left center;
          box-shadow: 0 30px 10px -20px rgba(0,0,0,.2);
          transition: background .3s ease, opacity .2s ease, transform .2s ease;
        }

        .premium-button:hover:not(:disabled) {
          background-size: 320%;
          background-position: right center;
          transform: translateY(-2px);
        }

        .premium-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .premium-button:hover svg {
          fill: #fff;
        }

        .premium-button svg {
          width: 23px;
          fill: #f09f33;
          transition: .3s ease;
        }
      `}</style>
      <button
        type={type}
        disabled={disabled}
        className={`premium-button ${className}`}
        onClick={onClick}
      >
        {children ?? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24">
              <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z" />
            </svg>
            {label ?? 'Add to Queue'}
          </>
        )}
      </button>
    </>
  );
};

export default Button;
