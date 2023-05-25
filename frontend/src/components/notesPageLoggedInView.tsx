import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from "../models/note";
import * as NotesApi from "../network/notes_api";
import styleUtils from "../styles/utils.module.css";
import AddEditNoteDialog from "./addEditNoteDialog";
import Note from "./note";
import styles from "../styles/notespage.module.css";


const NotesPageLoggedInView=()=>{

    const [notesLoading, setNotesLoading]=useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError]=useState(false);
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit]=useState<NoteModel | null>(null);
  const [notes, setNotes] = useState<NoteModel[]>([]);
  

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
        alert(error);
      } finally{
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, [])
  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id))
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  const notesGrid=
  <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
        {notes.map(note => (
          <Col>
            <Note note={note} className={styles.note} onNoteClicked={setNoteToEdit} onDeleteNoteClicked={deleteNote} />
          </Col>
        ))}
      </Row>

    return (
        <>
        <Button className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`} onClick={() => setShowAddEditNoteDialog(true)}>
        <FaPlus />
        Add New Note
      </Button>
        {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && <p>Something went wrong. Please Refresh the Page.</p>}
      {!notesLoading && !showNotesLoadingError && 
      <>
      {
        notes.length>0 ? notesGrid: <p> You don't have any Notes yet.</p>
      }
      </>
      }
      {
        showAddEditNoteDialog &&
        <AddEditNoteDialog
          onDismiss={() => setShowAddEditNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote])
            setShowAddEditNoteDialog(false);
          }} />
      }
      {noteToEdit &&
      <AddEditNoteDialog
      noteToEdit={noteToEdit}
      onDismiss={()=> setNoteToEdit(null)}
      onNoteSaved={(updatedNote)=>{
        setNotes(notes.map(existingNote=> existingNote._id===updatedNote._id? updatedNote: existingNote));
        setNoteToEdit(null);
      }}
      />
      }
        </>
    )
}

export default NotesPageLoggedInView;
