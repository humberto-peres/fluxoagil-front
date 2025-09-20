import { useNavigate } from 'react-router-dom';

type OpenTaskOptions = {
    from?: string;
};

export function useOpenTask() {
    const navigate = useNavigate();
    return (taskOrId: { id: number } | number, opts?: OpenTaskOptions) => {
        const id = typeof taskOrId === 'number' ? taskOrId : taskOrId.id;
        navigate(`/task/${id}`, { state: { from: opts?.from } });
    };
}
