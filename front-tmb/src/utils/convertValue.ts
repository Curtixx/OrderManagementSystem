export const convertValue = (value: string) => {
    const rawValue = value.replace(/\D/g, "");
    const numberValue = Number(rawValue) / 100;
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numberValue);
};

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
    });
};
