export interface FormErrorType {
    error: string | string[] | null;
    message?: string;
}

export default function FormError({ error }: { error: FormErrorType | null }) {
    if (!error) return null;

    const err = error.error;
    return (
        <div className={`px-4 py-3 rounded mb-4 ` + (error?.error ? `bg-red-100 border border-red-400 text-red-700` : `bg-green-100 border-green-400 text-green-700`)} role="alert">
            {err && (
                <p className="font-bold">
                    {typeof err === "string"
                        ? err
                        : Array.isArray(error)
                            ? err.join(", ")
                            : JSON.stringify(err)}
                </p>
            )}
            {error && <p className="text-sm">{error.message}</p>}
        </div>
    );
}