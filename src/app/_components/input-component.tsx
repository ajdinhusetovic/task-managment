interface InputComponentProps {
  label: string;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type,
  onChange,
  placeholder,
  value,
}) => {
  return (
    <div className="flex flex-col">
      <label className="p-1 font-medium">{label}</label>
      <input
        type={type}
        onChange={onChange}
        className="w-full rounded bg-violet-50 p-2 font-medium text-zinc-950 focus:outline-none md:text-xl"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputComponent;
