import React from "react";
import { pAuth, pFirestore, timestamp, pStorage } from "../firebase/config";
import { Redirect } from "react-router-dom";

class Createentity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: [],
      tags: [],
      name: "",
      text: "",
      isUploading: false,
    };
  }

  addTag = () => {
    var arr = this.state.tags;
    arr.push("");
    console.log(arr);
    this.setState({ tags: arr });
  };

  changeTag = (event) => {
    const { key, value, name } = event.target;
    var arr = this.state.tags;
    arr.splice(name, 1, value);
    console.log(name);
    this.setState((prevState) => {
      return { tags: arr };
    });
    console.log(this.state.tags);
  };

  changeState = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    console.log(this.state);
  };

  changeFiles = (event) => {
    const files = event.target.files;
    console.log(files);
    this.setState({ attachments: files });
  };

  createEntity = async () => {
    this.setState({ isUploading: true });
    await pFirestore
      .collection("entities")
      .add({
        name: this.state.name,
        text: this.state.text,
        attachments: [],
        comments: [],
        likes: 0,
        views: 0,
        time: timestamp(),
        author: pAuth.currentUser.uid,
        tags: this.state.tags,
        imageURL: "",
      })
      .then((docRef) => {
        console.log(docRef.id);
        var c = pFirestore.collection("entities").doc(docRef.id);
        Array.from(this.state.attachments).forEach((file) => {
          const storageRef = pStorage.ref(file.name);
          storageRef.put(file).on(
            "state_changed",
            (snap) => {},
            (err) => {},
            async () => {
              c.get()
                .then(async (doc) => {
                  console.log(doc);
                  if (doc.exists) {
                    var arr = doc.data().attachments;
                    console.log("Updating database with attachment urls", arr);
                    const url = await storageRef.getDownloadURL();
                    arr.push(url);
                    pFirestore.collection("entities").doc(docRef.id).update({
                      attachments: arr,
                    });
                    this.doneCreating();
                  } else {
                    console.log("database update failed");
                    this.doneCreating();
                  }
                })
                .catch((err) => {
                  console.log(err.message);
                  this.doneCreating();
                });
            }
          );
        });
        this.doneCreating();
      })
      .catch((err) => console.log(err));
  };

  doneCreating = () => {
    this.setState({ isUploading: false });
    return <Redirect to="/login" />;
  };

  render() {
    var num = -1;
    var arr = this.state.tags.map((element) => {
      num++;
      return (
        <li>
          <input
            className="tag-input"
            type="text"
            key={num}
            name={num}
            onChange={this.changeTag}
          ></input>
        </li>
      );
    });
    return (
      <div id="create-entity">
        <h3>Create A New Entity</h3>
        <form>
          <input
            type="text"
            placeholder="Entity Title"
            name="name"
            onChange={this.changeState}
          ></input>
          <input
            type="text"
            placeholder="Text Body"
            name="text"
            style={{ width: "50%", height: "100px" }}
            onChange={this.changeState}
          ></input>
          <input
            type="file"
            multiple
            name="attachments"
            id="input-files"
            onChange={this.changeFiles}
          ></input>
          <ul className="ul-tags-input">{arr}</ul>
          <button type="button" onClick={this.addTag}>
            Add a Tag
          </button>
          <button type="button" onClick={this.createEntity}>
            Create Entity
          </button>
          {this.state.isUploading && <div>Uploading in Progress</div>}
        </form>
      </div>
    );
  }
}

export default Createentity;
