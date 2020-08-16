import React, { useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import Entity from "./Entity";

const Entitieslist = ({ syllabusParam }) => {
  const [syllabus, setSyllabus] = useState(syllabusParam);
  const [searchValue, setSearchValue] = useState("");
  const [maxNum, setMaxNum] = useState(10);
  const [docsP, setDocsP] = useState([]);
  var { docs } = useFirestore("entities", "name", searchValue, maxNum);
  console.log(docs);

  return (
    <div id="entities-list">
      <div className="searchbar">
        <h2>Entities</h2>
        <p>
          Search and Browse for books, notes, assignments, presentations,
          worksheets and more for your teaching utility and inspiration.{" "}
        </p>
        <input
          type="text"
          placeholder="Search for Entities"
          onChange={(e) => {
            setSearchValue(e.target.value);
            setDocsP(docs);
          }}
        ></input>
        <input
          id="number"
          type="number"
          placeholder="No. Results"
          onChange={(e) => {
            setMaxNum(e.target.value);
            setDocsP(docs);
          }}
        ></input>
      </div>
      <div></div>
      {docs.map((e) => {
        console.log(e.id);
        return <Entity id={e.id} syllabus={syllabus} />;
      })}
      {docs.length == 0 && (
        <div
          style={{ fontSize: "30px", fontWeight: "bold", padding: "5vh 5vw" }}
        >
          No Entities Match Your Search
        </div>
      )}
    </div>
  );
};

export default Entitieslist;
