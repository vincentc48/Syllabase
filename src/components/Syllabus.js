import React, { useState } from "react";
import Entity from "./Entity";
import { pFirestore, ff, pAuth } from "../firebase/config";
import { Link } from "react-router-dom";

const Syllabus = ({ id, isEdit }) => {
  const [item, setItem] = useState({});
  const [isRemoving, setRemoving] = useState(false);
  const [username, setUsername] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  function getData() {
    pFirestore
      .collection("syllabi")
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setItem(doc.data());
          pFirestore
            .collection("users")
            .doc(doc.data().user)
            .get()
            .then((docRef) => {
              if (docRef.exists) {
                setUsername(docRef.data().username);
              }
            })
            .catch((err) => console.log(err.message));
        } else {
          console.log("doesn't exists");
        }
      });
  }

  getData();

  async function remove(e) {
    setRemoving(true);
    await pFirestore
      .collection("syllabi")
      .doc(id)
      .update({ entities: ff.arrayRemove(e) });
    setTimeout(() => {
      setRemoving(false);
    }, 5000);
  }

  function deleteSyllabus() {
    setIsDeleting(true);
    pFirestore
      .collection("syllabi")
      .doc(id)
      .delete()
      .then(() => {
        setIsDeleting(false);
      })
      .catch((err) => console.log(err.message));
  }

  const url = "/edit/" + id;

  return (
    <div className="syllabus">
      <h3>{item.title}</h3>
      <div className="syllabus-author">{username}</div>
      {isRemoving && (
        <div style={{ margin: "15px", fontSize: "20px", fontWeight: "bolds" }}>
          Removing may take a while
        </div>
      )}
      {!isEdit && pAuth.currentUser && pAuth.currentUser.uid == item.user && (
        <div>
          <Link to={url} className="edit-syllabus">
            Edit This Syllabus
          </Link>
          <button
            className="delete-syllabus"
            type="button"
            onClick={deleteSyllabus}
          >
            Delete this Syllabus
          </button>
        </div>
      )}
      {item.entities &&
        item.entities.map((element) => {
          return (
            <div>
              <Entity id={element} syllabus={null} />
              {isEdit && (
                <button
                  type="button"
                  className="remove-entity"
                  onClick={() => remove(element)}
                >
                  Remove from Syllabus
                </button>
              )}
            </div>
          );
        })}
      {isEdit && (
        <div className="select-entities-text">
          Select Entities on the right to add to the Syllabus
        </div>
      )}
    </div>
  );
};

export default Syllabus;
