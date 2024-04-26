import { sanitized } from "./sanitized";

export const html = sanitized({
    transformDirty: (unsafeString: string) => (unsafeString as any)?.__is_safe ? unsafeString : unsafeString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'),
    finalize: (safeString: string) => {
        (safeString as any).__proto__.toResponse = () => {
            return new Response(safeString, {
                headers: {
                    "Content-Type": "text/html"
                }
            });
        }

        (safeString as any).__proto__.__is_safe = true;

        return safeString;
    }
});
