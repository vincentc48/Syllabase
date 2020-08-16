import React from "react";
import { pFirestore, pAuth } from "../firebase/config";
import Syllabus from "./Syllabus";
import { Link, Redirect } from "react-router-dom";

//TODO: add views, comments properties to the syllabi and then make this a functional component and implement the search feature with the useFireStore SEO
class Syllabilist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      stitle: "",
    };
  }

  componentDidMount() {
    this.getSyllabi();
  }

  getSyllabi = () => {
    pFirestore.collection("syllabi").onSnapshot((snap) => {
      var documents = [];
      snap.forEach((doc) => {
        if (!this.props.user) documents.push({ ...doc.data(), id: doc.id });
        else {
          if (this.props.user == doc.data().user) {
            documents.push({ ...doc.data(), id: doc.id });
          }
        }
      });
      console.log(documents);
      this.setState({ docs: documents });
    });
  };

  createSyllabus = () => {
    pFirestore
      .collection("syllabi")
      .add({
        title: this.state.stitle,
        entities: [],
        user: pAuth.currentUser.uid,
      })
      .then((doc) => {
        var url = "/edit/" + doc.id;
        window.location = url;
      });
  };

  changeState = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    console.log(this.state);
    return (
      <div id="syllabi-list">
        <div className="searchbar">
          <h2>Syllabi</h2>
          <p>
            Collections of entities put together to organize and structure class
            material and curriculums
          </p>
        </div>
        {pAuth.currentUser && (
          <div>
            <input
              type="text"
              onChange={this.changeState}
              name="stitle"
              placeholder="Syllabus Title"
            ></input>
            <button onClick={this.createSyllabus}>Create New Syllabus</button>
          </div>
        )}
        {this.state.docs.map((doc) => {
          return <Syllabus id={doc.id} isEdit={false} />;
        })}
        {this.state.docs.length == 0 && (
          <div
            style={{ fontSize: "30px", fontWeight: "bold", padding: "5vh 5vw" }}
          >
            You have no syllabi yet
          </div>
        )}
      </div>
    );
  }
}

export default Syllabilist;
