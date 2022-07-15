import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

// Provider, Consumer

// # MAIN COMP..

const AppProvider = ({ children }) => {
	// # STATE VALUES
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);
	const [requests, setRequests] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState({ show: false, msg: "" });
	// errors
	// # FUNCTIONS AND SIDE EFFECTS
	const searchGithubUser = async user => {
		toggleError();
		setIsLoading(true);
		const response = await axios(`${rootUrl}/users/${user}`).catch(err =>
			console.log(err)
		);
		if (response) {
			setGithubUser(response.data);
			const { login, followers_url } = response.data;

			await Promise.allSettled([
				axios(`${rootUrl}/users/${login}/repos?per_page=100`),
				axios(`${followers_url}?per_page=100`),
			])
				.then(res => {
					const [repos, followers] = res;
					const status = "fulfilled";
					if (repos.status === status) {
						setRepos(repos.value.data);
					}
					if (followers.status === status) {
						setFollowers(followers.value.data);
					}
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			toggleError(true, "there is no user with that username");
		}

		checkReqRate();
		setIsLoading(false);
	};
	const checkReqRate = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining },
				} = data;
				setRequests(remaining);
				if (remaining === 0) {
					// # throw error
					toggleError(
						true,
						"sorry, you have exceeded your hourly rate limit"
					);
				}
			})
			.catch(err => console.log(err));
	};

	const toggleError = (show = false, msg = "") => {
		setError({ show, msg });
	};

	useEffect(checkReqRate, []);
	// # RETs
	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				requests,
				error,
				searchGithubUser,
				isLoading,
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

// # custom
const useGlobalContext = () => {
	// # RETs
	return useContext(GithubContext);
};
// # EXPORTS
export { AppProvider, useGlobalContext };

// ! NOTES
// WE HAVE OUR CONTEXT JS FILE FOR SETTING AND LIFTING OUR APP STATE AND MAKING IT ACCESSIBLE THROUGH THE APPLICATION.
// INSIDE THIS FILE WE CREATE OUR CONTEXT WITH REACT.CREATECONTEXT() AND ASSIGN TO OUR VARIABLE
// THIS NEW VARIABLE IS OUR MAIN CONTEXT THAT WILL PASS ON THE VALUES
// FROM THIS VARIABLE WE GET A COMPONENT WE WILL USE TO WRAP OUR ENTIRE APP I.E THE PROVIDER.
// THE PROVIDER COMPONENT WILL COME AS A PROPERTY ON THE CONTEXT VARIABLE
// BECAUSE WE NEED MORE LOGIC, WE WILL CREATE A FUNCTION COMPONENT THAT WILL HOUSE THIS PROVIDER. AFTER THIS, THE PROP THAT WILL PASS THE VALUES IS THE 'VALUE' PROP ON THE PROVIDER.
// AFTER SETTING ALL THIS UP, WE NEED TO EXPORT THE NEW COMPONENT THAT HOUSES THE PROVIDER TO THE INDEX JS. IT IS INSIDE THE INDEX JS OF THE ENTIRE APPLICATION WE WILL USE OUR PROVIDER COMPONENT TO WRAP THE APP. THIS STEP WILL MAKE WHATEVER IS IN THE VALUE PROP TO BE ACCESSIBLE BY THE WHOLE APPLICATION.
// WE ALSO NEED TO EXPORT THE CONTEXT ITSELF BECAUSE WE CANNOT ACCESS THE VALUE PROP AND ITS VALUES WITHOUT THE useContext HOOK ON THE CONTEXT ITSELF.
