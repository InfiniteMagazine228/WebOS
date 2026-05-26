import { createContext, useState, useContext } from 'react';

const OSContext = createContext();

export const OSProvider = ({ children }) => {
  // Mảng chứa các app đang mở, ví dụ: [{ id: 'notepad', title: 'Notepad', isOpen: true, zIndex: 1 }]
  const [openedApps, setOpenedApps] = useState([]);
  const [maxZIndex, setMaxZIndex] = useState(10);

  // Hàm mở một app mới
  const openApp = (id, title) => {
    const existing = openedApps.find(app => app.id === id);
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    if (existing) {
      // Nếu app đang mở, đẩy nó lên trên cùng (zIndex cao nhất)
      setOpenedApps(openedApps.map(app => app.id === id ? { ...app, zIndex: nextZ } : app));
    } else {
      // Nếu chưa mở, thêm mới vào mảng
      setOpenedApps([...openedApps, { id, title, zIndex: nextZ }]);
    }
  };

  // Hàm đóng app
  const closeApp = (id) => {
    setOpenedApps(openedApps.filter(app => app.id !== id));
  };

  return (
    <OSContext.Provider value={{ openedApps, openApp, closeApp, maxZIndex, setMaxZIndex }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => useContext(OSContext);
