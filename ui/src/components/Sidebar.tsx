import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLocalize } from '@/hooks/useLocalize';
import { useConfigStore } from '@/stores/configStore';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { cn } from '@/utils/cn';
import { PERMISSIONS } from '@/utils/constants';
import { useAuthStore } from '@/stores/authStore';

const Sidebar = () => {
    const { l } = useLocalize();
    const { sidebarCollapsed } = useConfigStore();
    const { hasPermission } = useAuthStore();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleMobileToggle = () => {
            setMobileMenuOpen(!mobileMenuOpen);
        };

        window.addEventListener('toggleMobileSidebar', handleMobileToggle);

        return () => {
            window.removeEventListener(
                'toggleMobileSidebar',
                handleMobileToggle
            );
        };
    }, [mobileMenuOpen]);

    const navigation = [
        {
            id: 'dashboard',
            name: l('navigation.dashboard'),
            href: '/dashboard',
            icon: 'pi pi-home',
            current: location.pathname === '/dashboard',
        },
        {
            id: 'employees',
            name: l('navigation.employees'),
            href: '/employees',
            icon: 'pi pi-users',
            current: location.pathname.startsWith('/employees'),
            permission: PERMISSIONS.READ_EMPLOYEE,
        },
    ];

    const SidebarContent = () => (
        <div
            className={cn(
                'flex flex-col h-full app-sidebar transition-all duration-300',
                sidebarCollapsed ? 'w-16' : 'w-72'
            )}
        >
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <div className="space-y-1">
                    {navigation.map(
                        item =>
                            (!item?.permission ||
                                (item.permission &&
                                    hasPermission(item.permission))) && (
                                <Link
                                    key={item.id}
                                    to={item.href}
                                    className={cn(
                                        'group flex items-center rounded-lg transition-all duration-300',
                                        sidebarCollapsed
                                            ? 'px-2 py-3 justify-center'
                                            : 'px-3 py-2.5',
                                        item.current
                                            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                                            : 'text-secondary hover-surface'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                    title={
                                        sidebarCollapsed ? item.name : undefined
                                    }
                                >
                                    <i
                                        className={cn(
                                            item.icon,
                                            'text-lg transition-all duration-300',
                                            sidebarCollapsed ? 'mr-0' : 'mr-3',
                                            item.current
                                                ? 'text-primary-600'
                                                : 'text-secondary group-hover:text-primary'
                                        )}
                                    />
                                    {!sidebarCollapsed && (
                                        <span>{item.name}</span>
                                    )}
                                </Link>
                            )
                    )}
                </div>
            </nav>
        </div>
    );

    const MobileSidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex h-16 items-center justify-center px-4 border-b border-gray-200">
                <div className="text-lg font-semibold text-gray-800">
                    Employee Directory
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <div className="space-y-1">
                    {navigation.map(item => (
                        <Link
                            key={item.id}
                            to={item.href}
                            className={cn(
                                'group flex items-center rounded-lg transition-all duration-300 px-3 py-2.5',
                                item.current
                                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                                    : 'text-secondary hover-surface'
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <i
                                className={cn(
                                    item.icon,
                                    'text-lg mr-3',
                                    item.current
                                        ? 'text-primary-600'
                                        : 'text-secondary group-hover:text-primary'
                                )}
                            />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );

    return (
        <>
            <div
                className={cn(
                    'hidden lg:block lg:fixed lg:top-16 lg:left-0 lg:bottom-0 lg:z-40 transition-all duration-300',
                    sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'
                )}
            >
                <div className="flex flex-col h-full shadow-xl bg-white dark:bg-gray-800">
                    <SidebarContent />
                </div>
            </div>

            <PrimeSidebar
                visible={mobileMenuOpen}
                onHide={() => setMobileMenuOpen(false)}
                position="left"
                className="lg:hidden"
                style={{ width: '18rem' }}
                modal
                dismissable={false}
            >
                <MobileSidebarContent />
            </PrimeSidebar>
        </>
    );
};

export default Sidebar;
