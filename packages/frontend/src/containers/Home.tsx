import { useState, useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "../components/ui/button";

function formatDate(str: undefined | string) {
  return !str ? "" : new Date(str).toLocaleString();
}

export default function Home() {
  const [notes, setNotes] = useState<Array<NoteType>>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      } finally {
        setIsLoading(false);
      }
    }

    onLoad();
  }, [isAuthenticated]);

  async function loadNotes() {
    const response = await API.get("notes", "/notes", {});
    console.log("API Response:", response);
    return response;
  }

  function renderNotesList(notes: NoteType[]) {
    return (
      <div className="space-y-2">
        <Link to="/notes/new">
          <Button
            variant="outline"
            className="flex items-center justify-start w-full gap-2 py-6 text-left"
          >
            <Pencil className="w-4 h-4" />
            <span className="font-semibold">Create a new note</span>
          </Button>
        </Link>
        {notes.map(({ noteId, content, createdAt }) => (
          <Link key={noteId} to={`/notes/${noteId}`}>
            <div className="w-full p-4 my-2 transition-colors border rounded-lg hover:bg-accent">
              <div className="font-semibold truncate">
                {content.trim().split("\n")[0]}
              </div>
              <div className="text-sm text-muted-foreground">
                Created: {formatDate(createdAt)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  function renderLander() {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">SST Dev Notes</h1>
        <p className="text-lg text-muted-foreground">
          A simple note taking app
        </p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="container px-4 mx-auto">
        <h2 className="pb-3 mb-3 text-2xl font-semibold border-b">
          Your Notes
        </h2>
        <div className="space-y-2">{!isLoading && renderNotesList(notes)}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
