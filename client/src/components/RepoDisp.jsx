import React from 'react';

const RepoDisp = ({ repo }) => (
	<div>
		<a href={repo.html_url}>{repo.name}</a>
	</div>
);

export default RepoDisp;
