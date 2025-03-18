interface User {
    id: string,
    username: string,
    password: string,
    created_at: string,
}

export const UserData: User[] = [
    {
        id: "1",
        username: "pomidor",
        password: "securepassword",
        created_at: "2023-01-01"
    },
    {
        id: "2",
        username: "user",
        password: "user",
        created_at: "2023-01-01"
    }
]