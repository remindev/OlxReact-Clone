import { useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext(null);
export default createContext(null);

export const UserDataContext = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
