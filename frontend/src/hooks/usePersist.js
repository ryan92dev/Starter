import { useState, useEffect } from "react";

const usePersist = () => {
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || true
    // have to set to true or false (set to false initially and then give user option to change and save to local storage)
  );

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};
export default usePersist;

// Giving the user the ability to persist their login session
