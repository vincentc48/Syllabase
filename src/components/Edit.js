import React from "react";
import Syllabus from "./Syllabus";
import Entitieslist from "./Entitieslist";

const Edit = () => {
  //SYLLABUS ID. IMPORTANT HERE
  const id = window.location.pathname.substring(6);

  return (
    <div id="edit">
      <div id="edit-col1">
        <Syllabus id={id} isEdit={true} />
      </div>
      <div id="edit-col2">
        <Entitieslist syllabusParam={id} />
      </div>
    </div>
  );
};

export default Edit;
