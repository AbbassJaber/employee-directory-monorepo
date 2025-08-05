import { cn } from '../../utils/cn';

describe('cn utility function', () => {
    it('combines multiple class names', () => {
        const result = cn('text-red-500', 'bg-blue-500', 'p-4');
        expect(result).toBe('text-red-500 bg-blue-500 p-4');
    });

    it('handles conditional classes', () => {
        const isActive = true;
        const result = cn('base-class', isActive && 'active-class');
        expect(result).toBe('base-class active-class');
    });

    it('handles falsy values', () => {
        const isActive = false;
        const result = cn('base-class', isActive && 'active-class');
        expect(result).toBe('base-class');
    });

    it('handles arrays of classes', () => {
        const result = cn(['text-red-500', 'bg-blue-500'], 'p-4');
        expect(result).toBe('text-red-500 bg-blue-500 p-4');
    });

    it('handles objects with conditional classes', () => {
        const isActive = true;
        const result = cn('base-class', {
            'active-class': isActive,
            'inactive-class': !isActive,
        });
        expect(result).toBe('base-class active-class');
    });

    it('merges conflicting Tailwind classes', () => {
        const result = cn('text-red-500', 'text-blue-500');
        expect(result).toBe('text-blue-500'); // Last one wins
    });

    it('handles empty strings and null values', () => {
        const result = cn('base-class', '', null, undefined, 'valid-class');
        expect(result).toBe('base-class valid-class');
    });

    it('handles mixed input types', () => {
        const isActive = true;
        const result = cn(
            'base-class',
            ['array-class-1', 'array-class-2'],
            {
                'object-class': isActive,
            },
            'string-class'
        );
        expect(result).toBe(
            'base-class array-class-1 array-class-2 object-class string-class'
        );
    });

    it('handles complex conditional logic', () => {
        const user = { role: 'admin' };
        const isLoggedIn = true;

        const result = cn(
            'base-button',
            isLoggedIn && 'logged-in',
            user.role === 'admin' && 'admin-button',
            user.role === 'user' && 'user-button'
        );

        expect(result).toBe('base-button logged-in admin-button');
    });

    it('handles Tailwind responsive classes', () => {
        const result = cn('text-sm', 'md:text-base', 'lg:text-lg');
        expect(result).toBe('text-sm md:text-base lg:text-lg');
    });

    it('handles Tailwind state classes', () => {
        const result = cn(
            'bg-gray-100',
            'hover:bg-gray-200',
            'focus:bg-gray-300'
        );
        expect(result).toBe('bg-gray-100 hover:bg-gray-200 focus:bg-gray-300');
    });
});
