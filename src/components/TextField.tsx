import React from 'react';

interface Props {
  label: string;
  id: string;
  value?: string;
  onChange?: any;
  type: 'text' | 'password';
  placeholder: string;
}

const TextField: React.FC<Props> = ({
  label,
  id,
  value,
  onChange,
  type,
  placeholder,
}) => {
  return (
    <div className="px-4 pb-2">
      <label htmlFor={id} className="text-sm block font-bold pb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={id}
        id={id}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-inner focus:shadow-blue-400 border-blue-300"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextField;
