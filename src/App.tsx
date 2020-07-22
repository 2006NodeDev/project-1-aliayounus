import React from "react";
import { LoginComponent } from "./components/LogincComponent";

const App = () => {
    return (

     <div style={{ textAlign: "center"}}>
           <LoginComponent 
           onSubmit={({email, firstname, lastname}) => {
               console.log(email, firstname, lastname);
           }}
           />
        </div>
    );
};

export default App;