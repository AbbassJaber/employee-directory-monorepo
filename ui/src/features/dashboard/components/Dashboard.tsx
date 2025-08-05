import { useLocalize } from '@/hooks/useLocalize';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ProgressBar } from 'primereact/progressbar';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';

const Dashboard = () => {
    const { l } = useLocalize();
    const { user } = useAuthStore();
    const DashboardHome = () => {
        const stats = [
            {
                title: l('dashboard.stats.totalEmployees'),
                value: '15',
                change: '+14%',
                changeType: 'positive',
                icon: 'pi pi-users',
                color: 'bg-blue-500',
            },
            {
                title: l('dashboard.stats.newHires'),
                value: '14',
                change: '+100%',
                changeType: 'positive',
                icon: 'pi pi-user-plus',
                color: 'bg-green-500',
            },
            {
                title: l('dashboard.stats.departments'),
                value: '6',
                change: '0%',
                changeType: 'neutral',
                icon: 'pi pi-building',
                color: 'bg-purple-500',
            },
        ];

        const recentActivities = [
            {
                id: 1,
                action: l('dashboard.activities.joinedEngineering', {
                    name: 'Sarah Johnson',
                }),
                time: l('dashboard.timeAgo.daysAgo', {
                    count: 1,
                }),
                icon: 'pi pi-plus-circle',
                color: 'text-success',
            },
            {
                id: 2,
                action: l('dashboard.activities.updatedProfile', {
                    name: 'Mike Chen',
                }),
                time: l('dashboard.timeAgo.daysAgo', {
                    count: 1,
                }),
                icon: 'pi pi-user-edit',
                color: 'text-info',
            },
            {
                id: 3,
                action: l('dashboard.activities.newDepartment', {
                    department: 'Finance',
                }),
                time: l('dashboard.timeAgo.daysAgo', {
                    count: 1,
                }),
                icon: 'pi pi-building',
                color: 'text-warning',
            },
            {
                id: 4,
                action: l('dashboard.activities.onboardingCompleted'),
                time: l('dashboard.timeAgo.daysAgo', {
                    count: 1,
                }),
                icon: 'pi pi-check-circle',
                color: 'text-success',
            },
        ];

        const topDepartments = [
            { name: 'Engineering', count: 5, percentage: 33 },
            { name: 'Marketing', count: 3, percentage: 20 },
            { name: 'Sales', count: 2, percentage: 13 },
            { name: 'Human Resources', count: 2, percentage: 13 },
            { name: 'Finance', count: 2, percentage: 13 },
            { name: 'Executive', count: 1, percentage: 7 },
        ];

        const recentHires = [
            {
                id: 1,
                name: 'Sarah Johnson',
                position: 'Senior Software Engineer',
                department: 'Engineering',
                startDate: '2024-01-01',
                avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
            },
            {
                id: 2,
                name: 'Mike Chen',
                position: 'Marketing Manager',
                department: 'Marketing',
                startDate: '2024-01-01',
                avatar: 'https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png',
            },
            {
                id: 3,
                name: 'Emma Wilson',
                position: 'Sales Representative',
                department: 'Sales',
                startDate: '2024-01-01',
                avatar: 'https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png',
            },
        ];

        return (
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {l('dashboard.welcome', {
                                    name: user?.firstName,
                                })}
                            </h1>
                            <p className="text-blue-100">
                                {l('dashboard.welcomeSubtitle')}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <AvatarGroup>
                                <Avatar
                                    image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                                    size="large"
                                    shape="circle"
                                />
                                <Avatar
                                    image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
                                    size="large"
                                    shape="circle"
                                />
                                <Avatar
                                    image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png"
                                    size="large"
                                    shape="circle"
                                />
                                <Avatar
                                    label="+5"
                                    size="large"
                                    shape="circle"
                                    style={{
                                        backgroundColor:
                                            'rgba(255,255,255,0.2)',
                                    }}
                                />
                            </AvatarGroup>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-secondary mb-1">
                                        {stat.title}
                                    </p>
                                    <div className="flex items-baseline space-x-2">
                                        <h3 className="text-2xl font-bold text-primary">
                                            {stat.value}
                                        </h3>
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                stat.changeType === 'positive'
                                                    ? 'text-success'
                                                    : stat.changeType ===
                                                        'negative'
                                                      ? 'text-danger'
                                                      : 'text-secondary'
                                            )}
                                        >
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        'w-12 h-12 rounded-xl',
                                        stat.color,
                                        'flex items-center justify-center'
                                    )}
                                >
                                    <i
                                        className={cn(
                                            stat.icon,
                                            'text-white text-xl'
                                        )}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Hires and Department Overview */}
                    <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Hires */}
                        <Card className="border-0 shadow-lg rounded-xl">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-primary">
                                    {l('dashboard.recentHires.title')}
                                </h3>
                                <p className="text-sm text-secondary">
                                    {l('dashboard.recentHires.subtitle')}
                                </p>
                            </div>
                            <div className="space-y-4">
                                {recentHires.map(hire => (
                                    <div
                                        key={hire.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover-surface"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Avatar
                                                image={hire.avatar}
                                                size="normal"
                                                shape="circle"
                                            />
                                            <div>
                                                <p className="font-medium text-primary">
                                                    {hire.name}
                                                </p>
                                                <p className="text-sm text-secondary">
                                                    {hire.position}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-primary">
                                                {hire.department}
                                            </p>
                                            <p className="text-xs text-secondary">
                                                {l(
                                                    'dashboard.recentHires.started'
                                                )}
                                                {hire.startDate}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Department Overview */}
                        <Card className="border-0 shadow-lg rounded-xl">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-primary">
                                    {l('dashboard.departmentOverview.title')}
                                </h3>
                                <p className="text-sm text-secondary">
                                    {l('dashboard.departmentOverview.subtitle')}
                                </p>
                            </div>
                            <div className="space-y-4">
                                {topDepartments.map((dept, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
                                                <i className="pi pi-building text-secondary text-sm" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-primary">
                                                    {dept.name}
                                                </p>
                                                <p className="text-sm text-secondary">
                                                    {dept.count}{' '}
                                                    {l(
                                                        'dashboard.departmentOverview.employees'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-primary">
                                                {dept.percentage}%
                                            </p>
                                            <div className="w-16 mt-1">
                                                <ProgressBar
                                                    value={dept.percentage}
                                                    showValue={false}
                                                    style={{ height: '4px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Activity Feed */}
                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-lg rounded-xl h-full">
                            <div className="h-full flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary">
                                            {l(
                                                'dashboard.recentActivity.title'
                                            )}
                                        </h3>
                                        <p className="text-sm text-secondary">
                                            {l(
                                                'dashboard.recentActivity.subtitle'
                                            )}
                                        </p>
                                    </div>
                                    <Button
                                        icon="pi pi-refresh"
                                        className="p-button-text p-button-sm"
                                        aria-label="Refresh"
                                    />
                                </div>
                                <div className="space-y-4 flex-1">
                                    {recentActivities.map(activity => (
                                        <div
                                            key={activity.id}
                                            className="flex items-start space-x-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0">
                                                <i
                                                    className={cn(
                                                        activity.icon,
                                                        activity.color,
                                                        'text-sm'
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-primary">
                                                    {activity.action}
                                                </p>
                                                <p className="text-xs text-secondary">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    return <DashboardHome />;
};

export default Dashboard;
