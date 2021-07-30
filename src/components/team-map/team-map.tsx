import React, { useState } from "react";
import { Team, Conference } from "../../types/teams";
import { default as allTeams } from "../../data/data.json";
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
	Marker,
	Line,
} from "react-simple-maps";

interface TeamMapArgs {
	teams?: Team[];
	conferenceSelections?: Conference[];
}

const getRivals = (team: Team, teams: Team[]) => {
	return teams.filter(
		(t) => t.conference === team.conference && t.team !== team.team
	);
};

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const TeamMap = ({
	teams = allTeams
}: TeamMapArgs) => {
	const [zoom, setZoom] = useState(1);

	const conferenceColorMap = new Map();

	const handleZoom = (position: { coordinates: number[]; zoom: number }) => {
		setZoom(position.zoom);
	};

	return (
		<div>
			<ComposableMap fill="black" projection="geoAlbersUsa">
				<ZoomableGroup fill="black" zoom={1} onMoveEnd={handleZoom}>
					<Geographies fill="black" geography={geoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => (
								<Geography
									key={geo.rsmKey}
									geography={geo}
									fill="#AAA"
									stroke="#444"
									strokeWidth="0.5"
								/>
							))
						}
					</Geographies>
					{teams.map((team) => {
						return (
							team.location.length && (
								<Marker
									key={team.team}
									coordinates={[
										team.location[0].longitude,
										team.location[0].latitude,
									]}
								>
									<circle
										r={4 / zoom}
										fill={conferenceColorMap.get(team.conference)}
									/>
									<image
										href={team.image_url}
										height={30 / zoom}
										width={30 / zoom}
									/>
									{/* {getRivals(team, teams).forEach((rival) => {
										rival.location.length && (
											<Line
												from={[
													team.location[0].longitude,
													team.location[0].latitude,
												]}
												to={[
													rival.location[0].longitude,
													rival.location[0].latitude,
												]}
												color={conferenceColorMap.get(team.conference)}
												fill={conferenceColorMap.get(team.conference)}
												strokeWidth={1}
											/>
										);
									})} */}
								</Marker>
							)
						);
					})}
				</ZoomableGroup>
			</ComposableMap>
		</div>
	);
};

export default TeamMap;
