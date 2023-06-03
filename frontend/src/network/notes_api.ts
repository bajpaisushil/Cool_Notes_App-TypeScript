import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";
import axios from 'axios';

async function fetchData(input: RequestInfo, init?:RequestInit){
    try {
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
    } catch (error) {
        
    }
   
}

export async function getLoggedInUser(): Promise<User>{
    const response=await axios.request({
        url: "/api/notes",
        baseURL: "https://notes-app-backendn.onrender.com",
        method: "GET",
    })
    return response?.data;
}
export interface signUpCredentials{
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: signUpCredentials): Promise<User>{
    const response=await axios.request({url: "/api/users/signup",
    baseURL: "https://notes-app-backendn.onrender.com",
    method: "POST",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    data: credentials
       
    });
    return response?.data;
}
export interface loginCredentials{
    username: string,
    password: string,
}
export async function login(credentials: any){
    try{
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
    return response?.data;
}catch(err: any){
    alert('login err =>'+ err?.response?.data + "\n" + err?.message);
}
}
export async function logout(){
    await axios.request({
        url: "/api/users/logout",
        withCredentials: true,
        baseURL: "https://notes-app-backendn.onrender.com",
        method: "POST",
    })
}

export async function fetchNotes(): Promise<Note[]>{
    const response=await axios.request({
        url: "/api/notes",
        withCredentials: true,
        baseURL: "https://notes-app-backendn.onrender.com",
        method: "GET",
    });
    return response?.data;
}

export interface NoteInput{
    title: string,
    text?: string,
}

export async function createNote(note: any): Promise<Note>{
    const response=await axios.request({
        url: "/api/notes",
        baseURL: "https://notes-app-backendn.onrender.com",
            method: "POST",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
            data: note,
        })
    return response?.data;
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note>{
    const response=await axios.request({
        url: "/api/notes/"+noteId,
        baseURL: "https://notes-app-backendn.onrender.com",
        method: "PATCH",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: note,
    });
    return response?.data;
}

export async function deleteNote(noteId: string){
    await fetchData("/api/notes/"+noteId, {method: "DELETE"});
}
