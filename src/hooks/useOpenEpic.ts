import { useNavigate } from 'react-router-dom';

type OpenEpicOptions = {
    from?: string;
};

export function useOpenEpic() {
    const navigate = useNavigate();
    return (epicOrId: { id: number } | number, opts?: OpenEpicOptions) => {
        const id = typeof epicOrId === 'number' ? epicOrId : epicOrId.id;
        navigate(`/epic/${id}`, { state: { from: opts?.from } });
    };
}
