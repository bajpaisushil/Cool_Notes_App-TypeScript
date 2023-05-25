import styles from "../styles/note.module.css";
import {Note as NoteModel} from "../models/note";
import {Card} from "react-bootstrap";
import { formatDate } from "../util/formatDate";
import styleUtils from "../styles/utils.module.css";
import {MdDelete} from "react-icons/md";

interface NoteProps{
    note: NoteModel,
    onNoteClicked: (note: NoteModel)=> void,
    onDeleteNoteClicked: (note: NoteModel)=> void,
    className?: string,
}

const Note=({note, onNoteClicked, onDeleteNoteClicked, className}: NoteProps)=>{
    const {
        title,
        text,
        createdAt,
        updatedAt
    }=note;
    let createdUpdatedText: string;
    if(updatedAt>createdAt){
        createdUpdatedText="Updated: "+formatDate(updatedAt);
    }
    else{
        createdUpdatedText="Created: "+formatDate(createdAt);
    }

    return (
        <Card className={`${styles.noteCard} ${className}`} onClick={()=> onNoteClicked(note)}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <MdDelete className="text-muted ms-auto" onClick={(e)=> {
                        onDeleteNoteClicked(note);
                        e.stopPropagation();
                        }} />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Note;
