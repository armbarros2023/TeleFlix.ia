import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './ui/Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-destructive">Ops! Algo deu errado.</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Ocorreu um erro inesperado na aplicação.
                    </p>
                    <div className="bg-muted p-4 rounded-md mb-6 max-w-lg overflow-auto text-left text-sm font-mono">
                        {this.state.error?.toString()}
                    </div>
                    <Button onClick={() => window.location.reload()}>
                        Recarregar Página
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
