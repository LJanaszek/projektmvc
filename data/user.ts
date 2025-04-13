interface User {
    id: string,
    username: string,
    password: string,
    imgBitmap?: string,
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
    },
    {
        id: "3",
        username: "user",
        password: "user",
        created_at: "2023-01-01"
    },
    {
        id: "4",
        username: "user",
        password: "user",
        created_at: "2023-01-01"
    },
    {
        id: "5",
        username: "user",
        password: "user",
        created_at: "2023-01-01"
    },
    {
        id: "6",
        username: "user",
        password: "user",
        created_at: "2023-01-01"
    },
    {
        id: "7",
        username: "user",
        password: "user",
        created_at: "2023-01-01"
    }
]