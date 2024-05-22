import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "./styles/styles.scss";

import {Router} from "./router";

class App {
    constructor() {
        new Router();
    }
}

(new App());