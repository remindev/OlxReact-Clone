import { useState } from "react";
import { createContext } from "react";

export const PostContextOrgin = createContext(null);

export const PostContext = ({ children }) => {
  const [post, setPost] = useState([]);
  return (
    <PostContextOrgin.Provider value={{ post, setPost }}>
      {children}
    </PostContextOrgin.Provider>
  );
};
