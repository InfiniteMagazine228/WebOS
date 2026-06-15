import { createContext, useContext, useState } from "react";

const OSContext = createContext();

export function OSProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const [maxZ, setMaxZ] = useState(100);

  const openApp = (app) => {
    const existing = windows.find(w => w.id === app.id);

    if (existing) {
      focusWindow(app.id);
      return;
    }

    const nextZ = maxZ + 1;
    setMaxZ(nextZ);

    setWindows(prev => [
      ...prev,
      {
        ...app,
        zIndex: nextZ,
        minimized: false,
        x: 120,
        y: 80,
        width: 1000,
        height: 650
      }
    ]);
  };

  const closeApp = (id) => {
    setWindows(prev =>
      prev.filter(w => w.id !== id)
    );
  };

  const focusWindow = (id) => {
    const nextZ = maxZ + 1;

    setMaxZ(nextZ);

    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, zIndex: nextZ }
          : w
      )
    );
  };

  const minimizeWindow = (id) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, minimized: !w.minimized }
          : w
      )
    );
  };

  return (
    <OSContext.Provider
      value={{
        windows,
        openApp,
        closeApp,
        focusWindow,
        minimizeWindow
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export const useOS = () => useContext(OSContext);
