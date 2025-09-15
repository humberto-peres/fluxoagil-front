import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { App, Button, Form } from "antd";
import FormUser from "@/pages/Auth/User/FormUser";
import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/services/user.services";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Configuration: React.FC = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [addressFieldsDisabled, setAddressFieldsDisabled] = useState(true);
    const { message } = App.useApp();
    const isEditing = true;

    useEffect(() => {
        (async () => {
            if (!user?.id) return;
            try {
                const u = await getUserById(user.id);
                const addr = u.address ?? null;

                form.setFieldsValue({
                    name: u.name,
                    username: u.username,
                    email: u.email,
                    cep: addr?.zipCode ?? "",
                    state: addr?.state ?? "",
                    city: addr?.city ?? "",
                    street: addr?.street ?? "",
                    neighborhood: addr?.neighborhood ?? "",
                    number: addr?.number ?? undefined,
                    password: "",
                });
                setAddressFieldsDisabled(!addr);
            } catch (e: any) {
                message.error(e?.message || "Não foi possível carregar seus dados.");
            }
        })();
    }, [user?.id, form]);

    const handleFormSubmit = async (values: any) => {
        if (!user?.id) return;

        const payload = {
            name: values.name,
            username: values.username,
            email: values.email,
            ...(values.password?.trim() ? { password: values.password } : {}),
            zipCode: values.cep,
            state: values.state,
            city: values.city,
            street: values.street,
            neighborhood: values.neighborhood,
            number: values.number != null ? Number(values.number) : undefined,
        };

        try {
            const res = await fetch(`${API_BASE}/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await res.text());
            message.success("Dados atualizados com sucesso!");
            const fresh = await getUserById(user.id);
            const addr = fresh.address ?? null;
            form.setFieldsValue({
                name: fresh.name,
                username: fresh.username,
                email: fresh.email,
                cep: addr?.zipCode ?? "",
                state: addr?.state ?? "",
                city: addr?.city ?? "",
                street: addr?.street ?? "",
                neighborhood: addr?.neighborhood ?? "",
                number: addr?.number ?? undefined,
                password: "",
            });
            setAddressFieldsDisabled(!addr);
        } catch (e: any) {
            message.error(e?.message || "Erro ao atualizar");
        }
    };

    return (
        <DefaultLayout title="Configurações de usuário">
            <div className="p-[20px]">
                <div className="mt-[20px]">
                    <FormUser
                        form={form}
                        onFinish={handleFormSubmit}
                        addressFieldsDisabled={addressFieldsDisabled}
                        setAddressFieldsDisabled={setAddressFieldsDisabled}
                        isEditing={isEditing}
                    />
                    <div className="mt-[16px]">
                        <Button type="primary" onClick={() => form.submit()}>
                            Salvar alterações
                        </Button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Configuration;
