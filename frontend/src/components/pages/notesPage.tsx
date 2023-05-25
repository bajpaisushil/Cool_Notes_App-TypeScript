import { Container } from "react-bootstrap"
import NotesPageLoggedInView from "../notesPageLoggedInView"
import NotesPageLoggedOutView from "../notesPageLoggedOutView"
import styles from "../../styles/notespage.module.css";
import { User } from "../../models/user";

interface NotesPageProps{
    loggedInUser: User | null,
}

const NotePage=({loggedInUser}: NotesPageProps)=>{
    return(
        <Container className={styles.notesPage}>
            <>
            {loggedInUser ? <NotesPageLoggedInView /> : <NotesPageLoggedOutView />}
            </>
        </Container>
    )
}

export default NotePage;
