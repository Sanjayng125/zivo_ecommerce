import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minute
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: 2
        }
    }
});

export default queryClient
