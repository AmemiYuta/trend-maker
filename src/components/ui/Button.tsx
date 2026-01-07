import type  { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  // ★修正: ここに 'upgrade' を追加しました
  variant?: 'primary' | 'secondary' | 'ghost' | 'upgrade';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) => {
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-lg border-transparent',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 border-transparent shadow-none',
    
    // ★追加: アップグレード専用の特別スタイル（紫のグラデーション）
    upgrade: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200 shadow-lg border-transparent hover:scale-[1.02]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`
        rounded-xl font-bold transition-all duration-200 
        flex items-center justify-center gap-2 border
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};