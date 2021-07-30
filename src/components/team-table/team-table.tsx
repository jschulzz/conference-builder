import React from "react";
import { Team } from "../../types/teams";
import {default as allTeams} from "../../data/data.json";

interface TeamTableArgs {
	teams?: Team[];
}

const getImageUrl = (imageURL: string) => {
	if (!imageURL) {
		return imageURL;
	}
	return `${imageURL}`;
};

const TeamTable = ({ teams = allTeams }: TeamTableArgs) => {
	return (
		<div className="team-table">
			<table>
				<thead>
					<tr>
						<td>Image</td>
						<td>School</td>
						<td>Mascot</td>
						<td>Location</td>
						<td>Conference</td>
						<td>Past Conferences</td>
					</tr>
				</thead>
				<tbody>
					{teams.map((team) => (
						<tr>
							<td>
								<img
									src={getImageUrl(team.image_url)}
									alt={team.team + " logo"}
								/>
							</td>
							<td>{team.team}</td>
							<td>{team.nickname}</td>
							<td>{team.location.length ? `${team.location[0].city}, ${team.location[0].state}` : "unknown"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TeamTable;
