import React from "react";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle } from "@tabler/icons-react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class TableErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // LOGGING: This is where you capture the crash
        console.error("CRITICAL TABLE ERROR:", error);
        console.error("Component Stack:", errorInfo.componentStack);

        // You could also send this to Sentry/LogRocket here
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-red-50/50 p-6 text-center">
                    <IconAlertTriangle className="size-10 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-red-900">Something went wrong</h3>
                    <p className="text-sm text-red-600 max-w-md mt-2 mb-4">
                        The table encountered an error while updating.
                        {this.state.error?.message && <span className="font-mono block mt-2 bg-red-100 p-1 rounded">{this.state.error.message}</span>}
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                    >
                        Reload Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}