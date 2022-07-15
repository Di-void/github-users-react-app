import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import loadingGif from "../images/preloader.gif";

const PrivateRoute = ({ children, ...rest }) => {
	const { isAuthenticated, user, isLoading } = useAuth0();
	const isUser = isAuthenticated && user;

	// # RETs
	if (isLoading) {
		return <img src={loadingGif} className="loading-img" alt="loading" />;
	}
	return (
		<Route
			{...rest}
			render={() => (isUser ? children : <Redirect to="/login"></Redirect>)}
		></Route>
	);
};
export default PrivateRoute;
