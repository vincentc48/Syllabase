import { useState, useEffect } from "react";
import { pFirestore } from "../firebase/config";

const useFirestore = (collection, orderBy, searchValue, maxNum) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsub = pFirestore
      .collection(collection)
      .orderBy(orderBy)
      .onSnapshot((snap) => {
        var documents = [];
        snap.forEach((doc) => {
          //**USE FILTER LOGIC HERE, INSTEAD OF .where(), because it has restrictions */
          var d = doc.data();
          var isValid = false;
          var scaleSEOIndex = d.likes * 1.3 + d.views + d.comments.length * 1.3;
          if (searchValue) {
            if (d.name.includes(searchValue)) {
              scaleSEOIndex *= 1.2;
              isValid = true;
            }
            if (d.author.includes(searchValue)) {
              scaleSEOIndex *= 1.25;
              isValid = true;
            }
            if (d.tags.includes(searchValue)) {
              scaleSEOIndex *= 1.17;
              isValid = true;
            }
          } else isValid = true;
          if (isValid)
            documents.push({
              ...doc.data(),
              seoIndex: -scaleSEOIndex,
              id: doc.id,
            });
          /*END OF SEO LOGIC*/
        });
        documents
          .sort((a, b) => {
            return a.seoIndex < b.seoIndex ? -1 : 1;
          })
          .slice(0, maxNum);
        setDocs(documents);
      });
    return () => unsub();
  }, [orderBy, searchValue, collection, maxNum]);

  return { docs };
};

export { useFirestore };
