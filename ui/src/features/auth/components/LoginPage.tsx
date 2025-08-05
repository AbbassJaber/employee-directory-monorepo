import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils/cn';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();

    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        credentials: '',
    });

    const validateForm = () => {
        const newErrors = { email: '', password: '', credentials: '' };
        let isValid = true;

        if (!data.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
        ) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!data.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (field: string, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '', credentials: '' }));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit(e as any);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setErrors(prev => ({ ...prev, credentials: '' }));
            await login(data.email, data.password);
            setData({ email: '', password: '' });
            navigate('/dashboard');
        } catch (err: any) {
            setErrors(prev => ({
                ...prev,
                credentials: 'Invalid email or password. Please try again.',
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-400 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <Card className="border-0 rounded-xl shadow-2xl bg-white/80  backdrop-blur-sm">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900mb-2">
                                Employee Directory
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Sign in to access your account
                            </p>
                            <p className="mt-4 text-gray-600 text-sm">
                                Hint: ceo@company.com / ceo123456
                            </p>
                        </div>

                        {errors.credentials && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <i className="pi pi-exclamation-triangle text-red-500 mr-2"></i>
                                    <span className="text-sm text-red-700">
                                        {errors.credentials}
                                    </span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Email Address
                                </label>
                                <span className="p-input-icon-left w-full">
                                    <InputText
                                        id="email"
                                        value={data.email}
                                        onChange={e =>
                                            handleInputChange(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={handleKeyDown}
                                        className={cn(
                                            'w-full text-base border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-200',
                                            errors.email
                                                ? 'p-invalid border-red-400'
                                                : ''
                                        )}
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </span>
                                {errors.email && (
                                    <small className="text-red-500 text-sm flex items-center mt-1">
                                        <i className="pi pi-exclamation-circle mr-1" />
                                        {errors.email}
                                    </small>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Password
                                </label>
                                <span className="p-input-icon-left w-full">
                                    <Password
                                        id="password"
                                        value={data.password}
                                        onChange={e =>
                                            handleInputChange(
                                                'password',
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={handleKeyDown}
                                        inputClassName={cn(
                                            'w-full text-base border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-200',
                                            errors.password
                                                ? 'p-invalid border-red-400'
                                                : ''
                                        )}
                                        className="w-full"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        feedback={false}
                                        toggleMask
                                    />
                                </span>
                                {errors.password && (
                                    <small className="text-red-500 text-sm flex items-center mt-1">
                                        <i className="pi pi-exclamation-circle mr-1" />
                                        {errors.password}
                                    </small>
                                )}
                            </div>

                            <Divider />

                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    loading={isLoading}
                                    className="px-8 py-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                    icon="pi pi-sign-in"
                                    iconPos="left"
                                    disabled={isLoading}
                                >
                                    <span className="font-semibold ml-2">
                                        {isLoading
                                            ? 'Signing in...'
                                            : 'Sign In'}
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
