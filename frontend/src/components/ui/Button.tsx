interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const base = 'rounded-xl px-4 py-3 font-semibold transition';
  const styles = variant === 'secondary'
    ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
    : 'bg-sky-600 text-white hover:bg-sky-700';

  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

export default Button;
