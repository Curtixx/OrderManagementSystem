export const convertValue = (value: string) => {
    const rawValue = value.replace(/\D/g, "");
    const numberValue = Number(rawValue) / 100;
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numberValue);
};