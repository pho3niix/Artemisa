import { createContext, useContext, useState } from 'react';

const MyContext = createContext(null);

function MyContextProvider({ children }) {
    const [Trigger, setTrigger] = useState(false);

    const LaunchTrigger = (boolean: boolean) => {
        setTrigger(boolean);
    }

    return (
        <MyContext.Provider value={{ Trigger, LaunchTrigger }}>
            {children}
        </MyContext.Provider>
    )
};

export { MyContext, MyContextProvider }