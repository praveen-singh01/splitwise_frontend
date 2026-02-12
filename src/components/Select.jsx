const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    required = false,
    multiple = false,
    ...props
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                multiple={multiple}
                className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...props}
            >
                {!multiple && <option value="">Select...</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Select;
