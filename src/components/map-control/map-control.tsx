import React, { useState } from "react";
import TeamMap from "../team-map/team-map";
import TeamSelections from "../team-selections/team-selections";
import { default as allConferences } from "../../data/conferences.json";
import { default as allTeams } from "../../data/data.json";

import "./map-control.css";
// import { Conference } from "../../types/teams";


const MapControl = () => {
	const [teamSelections, setTeamSelections] = useState(allTeams);

	return (
		<div className="map-control">
			<TeamSelections onChange={setTeamSelections} />
			<div className="map-container">
				<div className="map">
					<TeamMap teams={teamSelections} />
				</div>
			</div>
		</div>
	);
};

export default MapControl;
