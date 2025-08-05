import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';

// Mock the stores
jest.mock('../../stores/configStore', () => ({
    useConfigStore: () => ({
        sidebarCollapsed: false,
    }),
}));

// Mock the components
jest.mock('../../components/Header', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="header">Header</div>,
    };
});

jest.mock('../../components/Sidebar', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="sidebar">Sidebar</div>,
    };
});

// Mock the cn utility
jest.mock('../../utils/cn', () => ({
    cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('AppLayout Component', () => {
    const renderAppLayout = (
        children: React.ReactNode = <div>Test Content</div>
    ) => {
        return render(
            <BrowserRouter>
                <AppLayout>{children}</AppLayout>
            </BrowserRouter>
        );
    };

    it('renders without crashing', () => {
        renderAppLayout();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('renders children content', () => {
        renderAppLayout(<div data-testid="test-content">Test Content</div>);
        expect(screen.getByTestId('test-content')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('has proper layout structure', () => {
        const { container } = renderAppLayout();

        // Check for app-layout wrapper
        expect(container.querySelector('.app-layout')).toBeInTheDocument();

        // Check for main content area
        expect(container.querySelector('.app-main')).toBeInTheDocument();

        // Check for content container
        expect(
            container.querySelector('.max-w-7xl.mx-auto.px-4')
        ).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
        renderAppLayout(
            <>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
                <div data-testid="child-3">Child 3</div>
            </>
        );

        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
        expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('has proper spacing classes', () => {
        const { container } = renderAppLayout();
        const mainElement = container.querySelector('.app-main');

        expect(mainElement).toHaveClass('py-8');
        expect(mainElement).toHaveClass('pt-24');
    });
});
