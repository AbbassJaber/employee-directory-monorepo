import { useConfigStore } from '@/stores/configStore';
import { cn } from '@/utils/cn';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { sidebarCollapsed } = useConfigStore();

    return (
        <div className="app-layout">
            <Sidebar />

            <div
                className={cn(
                    'transition-all duration-300',
                    sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'
                )}
            >
                <Header />

                <main className="app-main py-8 pt-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
