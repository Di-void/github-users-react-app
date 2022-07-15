import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { AppProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";
// dev-n3zkjm-3.us.auth0.com
// DyCq44h7SW4ugHykvT4dOIz5f6VcG5R0
ReactDOM.render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev-n3zkjm-3.us.auth0.com"
			clientId="DyCq44h7SW4ugHykvT4dOIz5f6VcG5R0"
			redirectUri={window.location.origin}
			cacheLocation="localstorage"
		>
			<AppProvider>
				<App />
			</AppProvider>
		</Auth0Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
