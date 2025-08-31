export interface Course{
    title: string;
    description: string;
    price:  number;
    thumbnail?: string;
    rating?: number;
    createdAt?:  string;
    id?: string;
    category: string;
    trainer?:{
        username: string;
        profilePic?: string;
        id?: string;
    }
}
