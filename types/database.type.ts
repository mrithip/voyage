import { Models } from "react-native-appwrite";

export interface Logs extends Models.Document{
     $id: string;
    userid: string;
    title:string;
    place:string;
    date:string;
    notes:string;
    imageBase64?: string;
}