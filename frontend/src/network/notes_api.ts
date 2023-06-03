import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";
import axios from 'axios';

async function fetchData(input: RequestInfo, init?:RequestInit){
    const response=await fetch(input, init);
    if(response.ok){
        return response;
    }
    else{
        const errorBody=await response.json();
        const errorMessage=errorBody.error;
        if(response.status===401){
            throw new UnauthorizedError(errorMessage);
        }
        else if(response.status===409){
            throw new ConflictError(errorMessage);
        }
        else{
            throw Error("Request failed with status: "+response.status+" message: "+errorMessage);
        }
    }
}

export async function getLoggedInUser(): Promise<User>{
    const response=await fetchData("/api/notes", {method: "GET"});
    return response.json();
}
export interface signUpCredentials{
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: signUpCredentials): Promise<User>{
    const response=await fetchData("/api/users/signup", {
        method: "POST",
        
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials)
    });
    return response.json();
}
export interface loginCredentials{
    username: string,
    password: string,
}
export async function login(credentials: any): Promise<User>{
    alert("credentials =>>" + credentials + "\n" + credentials?.username)
    const response:any=await axios.request({
        url: "/api/users/login",
        baseURL: "https://notes-app-backendn.onrender.com",
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: credentials
    });
    alert(JSON.stringify(response?.data));
    return response;
}
export async function logout(){
    await fetchData("/api/users/logout", {method: "POST"});
}

export async function fetchNotes(): Promise<Note[]>{
    const response=await fetchData("/api/notes", {method: "GET"});
    return response.json();
}

export interface NoteInput{
    title: string,
    text?: string,
}

export async function createNote(note: NoteInput): Promise<Note>{
    const response=await fetchData("/api/notes",
    {
        method: "POST",
        
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    })
    return response.json();
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note>{
    const response=await fetchData("/api/notes/"+noteId, {
        method: "PATCH",
        
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return response.json();
}

export async function deleteNote(noteId: string){
    await fetchData("/api/notes/"+noteId, {method: "DELETE"});
}
