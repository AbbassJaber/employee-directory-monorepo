export const parseIdArray = (ids: any): number[] | undefined => {
    if (!ids) return undefined;
    return Array.isArray(ids)
        ? ids.map((id: any) => parseInt(id as string))
        : [parseInt(ids as string)];
};
