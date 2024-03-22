interface InputComponentProps {
  label: string;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col">
      <label className="xl:text-dark-text p-1 font-medium">{label}</label>
      <input
        type={type}
        onChange={onChange}
        className="text-dark-text w-full rounded border p-2 focus:outline-none md:text-xl"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputComponent;
