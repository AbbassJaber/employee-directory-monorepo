type SortOrder = 'asc' | 'desc';

interface PrismaOrderBy {
    [key: string]:
        | SortOrder
        | {
              [key: string]: SortOrder;
          };
}

export const buildOrderBy = (
    sortField?: string,
    sortOrder: SortOrder = 'asc',
    defaultOrderBy: PrismaOrderBy = { firstName: 'asc' }
): PrismaOrderBy => {
    if (sortField?.includes('.')) {
        // Handle sorting by related fields (e.g., location.name, department.name)
        const [relation, field] = sortField.split('.') as [string, string];
        return {
            [relation]: {
                [field]: sortOrder,
            },
        };
    }

    if (sortField) {
        // Handle sorting by direct fields
        return {
            [sortField]: sortOrder,
        };
    }

    // Use default sorting
    return defaultOrderBy;
};
