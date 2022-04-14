import React from "react";
import { render } from "react-dom";
import './Header.css'

export class Header extends React.Component {
    render() {
        return (
            <section id="bannersection" className="banner">
                    <header>
                        <div className="content">
                            <div id="title">
                                <h1>Tic tac toe</h1>  
                            </div>
                        </div>
                    </header>     
             </section>
        )
    }
}