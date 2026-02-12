const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    onClick,
    disabled = false,
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = variant === 'primary'
        ? 'btn-primary'
        : variant === 'danger'
            ? 'btn-danger'
            : 'btn-secondary';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
