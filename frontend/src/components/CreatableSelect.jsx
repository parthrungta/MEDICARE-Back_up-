import { useState, useRef, useEffect } from 'react';

/**
 * CreatableSelect Component
 * A combobox that allows selecting from options OR typing a custom value
 */
const CreatableSelect = ({
    options = [],
    value = '',
    onChange,
    placeholder = 'Select or type...',
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Sync input value with prop value
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Filter options based on input
    useEffect(() => {
        if (inputValue) {
            const filtered = options.filter(opt =>
                opt.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [inputValue, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        setIsOpen(true);
    };

    const handleOptionClick = (option) => {
        setInputValue(option);
        onChange(option);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && filteredOptions.length > 0) {
            e.preventDefault();
            handleOptionClick(filteredOptions[0]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className={`creatable-select ${className}`} ref={wrapperRef}>
            <div className="creatable-input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="creatable-input"
                    autoComplete="off"
                />
                <button
                    type="button"
                    className="creatable-toggle"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) inputRef.current?.focus();
                    }}
                    disabled={disabled}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>
            </div>

            {isOpen && filteredOptions.length > 0 && (
                <ul className="creatable-dropdown">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            className={`creatable-option ${option === inputValue ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CreatableSelect;
