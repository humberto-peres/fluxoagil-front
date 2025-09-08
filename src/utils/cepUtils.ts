export default {
    fetchAddress: async (cep: string) => {
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            if (data.erro) {
                throw new Error("CEP inválido!");
            }

            return {
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
            };
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
            throw error;
        }
    },
};