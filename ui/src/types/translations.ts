export interface TranslationKeysInterface {
    app: {
        name: string;
        description: string;
    };
    navigation: {
        dashboard: string;
        employees: string;
        profile: string;
        settings: string;
        logout: string;
    };
    auth: {
        login: {
            title: string;
            subtitle: string;
            email: string;
            password: string;
            emailPlaceholder: string;
            passwordPlaceholder: string;
            signIn: string;
            signingIn: string;
        };
        logout: string;
        email: string;
        password: string;
        loginButton: string;
        loginSuccess: string;
        loginFailed: string;
        logoutSuccess: string;
        emailRequired: string;
        passwordRequired: string;
        invalidCredentials: string;
        sessionExpired: string;
        accessDenied: string;
        accessDeniedMessage: string;
        goBack: string;
    };
    dashboard: {
        welcome: string;
        welcomeSubtitle: string;
        stats: {
            totalEmployees: string;
            newHires: string;
            departments: string;
        };
        recentHires: {
            title: string;
            subtitle: string;
            started: string;
        };
        departmentOverview: {
            title: string;
            subtitle: string;
            employees: string;
        };
        recentActivity: {
            title: string;
            subtitle: string;
        };
        activities: {
            joinedEngineering: string;
            updatedProfile: string;
            newDepartment: string;
            onboardingCompleted: string;
        };
        timeAgo: {
            hoursAgo: string;
            hoursAgo_other: string;
            daysAgo: string;
            daysAgo_other: string;
        };
    };
    employees: {
        title: string;
        subtitle: string;
        actions: {
            add: string;
            search: string;
            create: string;
            edit: string;
            view: string;
            delete: string;
            uploadPhoto: string;
        };
        filters: {
            department: string;
            location: string;
        };
        table: {
            employee: string;
            position: string;
            department: string;
            location: string;
            status: string;
            actions: string;
        };
        found: string;
        found_other: string;
        view: {
            edit: string;
            back: string;
            contactInformation: string;
            workInformation: string;
            email: string;
            phone: string;
            position: string;
            hireDate: string;
            department: string;
            location: string;
            notAssigned: string;
            reportingStructure: string;
            reportsTo: string;
            noManagerAssigned: string;
            directReports: string;
            permissions: string;
            noPermissionsAssigned: string;
            employeeNotFound: string;
            failedToFetchEmployee: string;
        };
        fields: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone: string;
            position: string;
            hireDate: string;
            department: string;
            location: string;
            reportsTo: string;
            permissions: string;
            profilePhoto: string;
            selectDepartment: string;
            selectLocation: string;
            selectManager: string;
            selectPermissions: string;
        };
        validation: {
            firstNameRequired: string;
            lastNameRequired: string;
            emailRequired: string;
            emailInvalid: string;
            passwordRequired: string;
            passwordMinLength: string;
            phoneRequired: string;
            phoneInvalid: string;
            positionRequired: string;
            hireDateRequired: string;
            departmentRequired: string;
            locationRequired: string;
        };
        messages: {
            createSuccess: string;
            updateSuccess: string;
            deleteSuccess: string;
            createFailed: string;
            updateFailed: string;
            deleteFailed: string;
            confirmDelete: string;
            backToList: string;
            failedToLoadDepartments: string;
            failedToLoadLocations: string;
            failedToLoadEmployees: string;
            failedToLoadPermissions: string;
            failedToFetchEmployee: string;
        };
    };
    common: {
        theme: {
            light: string;
            dark: string;
            switchToLight: string;
            switchToDark: string;
        };
        language: {
            switchToEnglish: string;
            switchToFrench: string;
        };
        actions: {
            add: string;
            edit: string;
            delete: string;
            save: string;
            cancel: string;
            search: string;
            filter: string;
            export: string;
            import: string;
            refresh: string;
            view: string;
            create: string;
            update: string;
            submit: string;
            reset: string;
            clear: string;
            close: string;
            open: string;
            back: string;
            next: string;
            previous: string;
            confirm: string;
            reject: string;
            approve: string;
            uploadPhoto: string;
            changePhoto: string;
            showFilters: string;
            hideFilters: string;
            expandSidebar: string;
            collapseSidebar: string;
        };
        status: {
            active: string;
            inactive: string;
            pending: string;
            approved: string;
            rejected: string;
            draft: string;
            published: string;
            archived: string;
        };
        validation: {
            required: string;
            email: string;
            minLength: string;
            maxLength: string;
            pattern: string;
            numeric: string;
            alphanumeric: string;
            phone: string;
            url: string;
            date: string;
            time: string;
            dateTime: string;
            strongPassword: string;
        };
        messages: {
            loading: string;
            noData: string;
            error: string;
            success: string;
            warning: string;
            info: string;
            confirmDelete: string;
            unsavedChanges: string;
        };
        table: {
            actions: string;
        };
        or: string;
        welcome: string;
        viewProfile: string;
    };
}

type GenerateStringPaths<T, K extends keyof T = keyof T> = K extends string
    ? T[K] extends Record<string, any>
        ? T[K] extends string
            ? K
            : `${K}.${GenerateStringPaths<T[K]>}`
        : K
    : never;

export type TranslationKey = GenerateStringPaths<TranslationKeysInterface>;

export type TranslateFn = (key: TranslationKey, options?: any) => string;

export type TranslationNamespace = keyof TranslationKeysInterface;

export type GetTranslationKeys<T extends TranslationNamespace> =
    GenerateStringPaths<TranslationKeysInterface[T]>;

export const isValidTranslationKey = (key: string): key is TranslationKey => {
    return key.includes('.');
};
