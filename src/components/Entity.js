import React from "react";
import { pFirestore, ff, pAuth } from "../firebase/config";

class Entity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      username: "",
      isAdding: false,
      isDeleting: false,
    };
  }

  componentDidMount() {
    this.getData(this.props.id);
  }

  getData = (docId) => {
    var docF = pFirestore.collection("entities").doc(docId);
    docF.onSnapshot((doc) => {
      if (doc.exists) {
        this.setState({ data: doc.data() });
        pFirestore
          .collection("users")
          .doc(this.state.data.author)
          .get()
          .then((doc) => {
            this.setState({ username: doc.data().username });
          });
      } else {
        this.setState({ data: null });
      }
    });
  };

  addSyllabus = () => {
    this.setState({ isAdding: true });
    setTimeout(() => {
      this.setState({ isAdding: false });
    }, 5000);
    pFirestore
      .collection("syllabi")
      .doc(this.props.syllabus)
      .update({
        entities: ff.arrayUnion(this.props.id),
      });
  };

  deleteEntity = (docId) => {
    this.setState({ isDeleting: true });
    pFirestore
      .collection("entities")
      .doc(docId)
      .delete()
      .then(() => {
        this.setState({ isDeleting: false });
      })
      .catch((err) => console.log(err.message));
  };

  render() {
    if (this.state.data) {
      return (
        <div className="entity">
          <h3>{this.state.data.name}</h3>
          <p>{this.state.data.text}</p>
          {this.state.data.attachments.map((link) => {
            return (
              <button
                type="button"
                className="attachment"
                onClick={() => window.open(link, "_blank")}
              >
                Attachment: {link.substring(0, 30)}
              </button>
            );
          })}
          <ul>
            {this.state.data.tags.length > 0 && (
              <li className="tag-label">Tags:</li>
            )}
            {this.state.data.tags.map((tag) => {
              return <li className="tag">{tag}</li>;
            })}
          </ul>
          {this.props.syllabus && (
            <button
              type="button"
              className="add-entity"
              onClick={this.addSyllabus}
            >
              Add to Syllabus
            </button>
          )}
          {this.state.isAdding && <div>Adding can take a while</div>}
          <div style={{ margin: "15px", color: "black", fontWeight: "bold" }}>
            {" "}
            By: {this.state.username}
          </div>
          {pAuth.currentUser &&
            this.state.data.author == pAuth.currentUser.uid &&
            !this.props.syllabus && (
              <button
                onClick={() => this.deleteEntity(this.props.id)}
                className="delete-entity"
              >
                Delete
              </button>
            )}
          {this.state.isDeleting && <div>Deleting this entity</div>}
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Entity;
