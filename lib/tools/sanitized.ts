export const sanitized = <T>({
    transformDirty,
    transformClean,
    finalize
}: {
    transformDirty: (unsafeString: string) => any,
    transformClean?: (safeString: string) => string,
    finalize: (safeString: string) => T
}) => {

    return (strings: TemplateStringsArray, ...values: any[]): T => {
        let output = '';
        strings.forEach((string, i) => {
            output += (transformClean ? transformClean(string) : string) + transformDirty(values[i] || '');
        });
        return finalize(output) as T;
    };
}
