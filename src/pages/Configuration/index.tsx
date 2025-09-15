import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { App, Button, Form, Card, Grid, Affix } from "antd";
import FormUser from "@/pages/Auth/User/FormUser";
import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/services/user.services";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const { useBreakpoint } = Grid;

const Configuration: React.FC = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [addressFieldsDisabled, setAddressFieldsDisabled] = useState(true);
    const { message } = App.useApp();
    const [saving, setSaving] = useState(false);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

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
    }, [user?.id, form, message]);

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
            setSaving(true);
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
        } finally {
            setSaving(false);
        }
    };

    const SaveActions = (
        <Button type="primary" onClick={() => form.submit()} loading={saving}>
            Salvar alterações
        </Button>
    );

    return (
        <DefaultLayout title="Configurações de usuário">
            <Card variant="borderless" style={{ marginTop: 8 }}>
                <FormUser
                    form={form}
                    onFinish={handleFormSubmit}
                    addressFieldsDisabled={addressFieldsDisabled}
                    setAddressFieldsDisabled={setAddressFieldsDisabled}
                    isEditing={isEditing}
                />

                {!isMobile && (
                    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                        {SaveActions}
                    </div>
                )}
            </Card>

            {isMobile && (
                <Affix offsetBottom={16}>
                    <div
                        style={{
                            margin: "0 12px",
                            background: "rgba(0,0,0,0.25)",
                            backdropFilter: "blur(6px)",
                            borderRadius: 12,
                            padding: 8,
                        }}
                    >
                        <Button type="primary" size="large" block onClick={() => form.submit()} loading={saving}>
                            Salvar alterações
                        </Button>
                    </div>
                </Affix>
            )}
        </DefaultLayout>
    );
};

export default Configuration;
