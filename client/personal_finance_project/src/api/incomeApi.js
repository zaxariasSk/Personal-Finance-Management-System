export const addIncome = async () => {
    const res = await fetch();
}

export const getIncome = async () => {
    const res = await fetch('http://localhost:3000/income', {
        credentials: "include"
    });

    console.log(await res.json());
}