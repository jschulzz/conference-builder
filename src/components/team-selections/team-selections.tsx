import React, { useEffect, useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

import { Conference, Group } from "../../types/teams";
import { default as allTeams } from "../../data/data.json";
import { default as allConferences } from "../../data/conferences.json";

import "./team-selections.css";

interface TeamSelectionArgs {
	onChange: Function;
}

interface TeamMap {
	[key: string]: boolean;
}

const TeamSelections = ({ onChange }: TeamSelectionArgs) => {
	const [teamStatuses, setTeamStatuses] = useState<TeamMap>({});
	const [groupStatuses, setGroupStatuses] = useState<any>({});
	const [conferenceStatuses, setConferenceStatuses] = useState<any>({});
	const [allGroups, setAllGroups] = useState<Group[]>([]);
	const [conferences, setConferences] = useState<Conference[]>([]);

	const initializeGroups = () => {
		let localTeamStatuses = { ...teamStatuses };
		let localConferences = [...conferences];
		let localGroups = [...allGroups];
		for (const team of allTeams) {
			localTeamStatuses[team.team] = true;
			const conferenceName = team.conference;
			let parentConference = localConferences.find(
				(c) => c.name === conferenceName
			);
			if (!parentConference) {
				const newConference: Conference = {
					...(allConferences.find(
						(c) => c.name === conferenceName
					) as Conference),
					teams: [team],
				};
				localConferences.push(newConference);
				parentConference = newConference;
			} else {
				parentConference.teams.push(team);
			}
		}

		localConferences.forEach((conference) => {
			let parentGroup = localGroups.find((g) => g.name === conference.group);
			if (!parentGroup) {
				const newGroup: Group = {
					name: conference.group,
					conferences: [conference],
				};
				localGroups.push(newGroup);
			} else {
				parentGroup.conferences.push(conference);
			}
		});
		setTeamStatuses(localTeamStatuses);
		setAllGroups(localGroups);
		setConferences(localConferences);
	};

	const updateGroupsAndConferences = () => {
		let localConferenceStatuses = { ...conferenceStatuses };
		let localGroupStatuses = { ...groupStatuses };

		allGroups.forEach((group) => {
			group.conferences.forEach((conference) => {
				const allSelected = conference.teams
					.map((team) => teamStatuses[team.team])
					.every((x) => x);
				const someSelected = conference.teams
					.map((team) => teamStatuses[team.team])
					.some((x) => x);
				localConferenceStatuses[conference.name] = {
					checked: allSelected,
					indeterminate: !allSelected && someSelected,
					collapsed: true,
				};
			});
			const allSelected = group.conferences
				.map((conference) => localConferenceStatuses[conference.name])
				.every((x) => x);
			const someSelected = group.conferences
				.map((conference) => localConferenceStatuses[conference.name])
				.some((x) => x);
			localGroupStatuses[group.name] = {
				checked: allSelected,
				indeterminate: !allSelected && someSelected,
				collapsed: true,
			};
		});
		setConferenceStatuses(localConferenceStatuses);
		setGroupStatuses(localGroupStatuses);
	};

	useEffect(() => {
		initializeGroups();
	}, []);

	useEffect(() => {
		console.log(groupStatuses, conferenceStatuses);
	}, [groupStatuses, conferenceStatuses]);

	useEffect(updateGroupsAndConferences, [conferences, allGroups, teamStatuses]);

	const changeSelections = (e: any, selectionType: string) => {
		if (e?.target?.name) {
			const key = e.target.name;

			let newSelections: TeamMap = {
				...teamStatuses,
			};

			if (selectionType === "group") {
				const group = allGroups.find((g) => g.name === key) as Group;
				group.conferences.forEach((c) => {
					c.teams.forEach((t) => {
						newSelections[t.team] = !groupStatuses[group.name].checked;
					});
				});
			}
			if (selectionType === "conference") {
				const conference = conferences.find(
					(c) => c.name === key
				) as Conference;
				conference.teams.forEach((t) => {
					newSelections[t.team] = !conferenceStatuses[conference.name].checked;
				});
			}
			if (selectionType === "team") {
				newSelections[key] = !teamStatuses[key];
			}

			// update local state
			setTeamStatuses(newSelections);
			// update parent component
			const selectionList = Object.keys(newSelections)
				.filter((team) => newSelections[team])
				.map((teamName) => allTeams.find((team) => team.team === teamName));
			onChange(selectionList);
		}
	};

	const changeCollapse = (type: string, id: string, value: boolean) => {
		console.log(type, id, value);
		let localGroupStatuses = {...groupStatuses};
		let localConferenceStatuses = {...conferenceStatuses};
		if (type === "group") {
			localGroupStatuses[id].collapsed = value;
		}
		if (type === "conference") {
			localConferenceStatuses[id].collapsed = value;
		}
		console.log(localGroupStatuses, localConferenceStatuses);
		setGroupStatuses(localGroupStatuses);
		setConferenceStatuses(localConferenceStatuses);
	};

	return (
		<div>
			<FormControl component="fieldset">
				<FormLabel component="legend">Assign responsibility</FormLabel>
				<FormGroup>
					{allGroups.map((group) => {
						console.log(group);
						return (
							<div>
								<FormControlLabel
									key={group.name}
									control={
										<Checkbox
											checked={groupStatuses[group.name]?.checked || false}
											onChange={(e) => changeSelections(e, "group")}
											name={group.name}
											indeterminate={
												groupStatuses[group.name]?.indeterminate || false
											}
										/>
									}
									label={
										<span>
											{group.name}
											{!groupStatuses[group.name]?.collapsed && (
												<IconButton
													onClick={() => {
														changeCollapse("group", group.name, true);
													}}
												>
													<ExpandMore />
												</IconButton>
											)}
											{groupStatuses[group.name]?.collapsed && (
												<IconButton
													onClick={() => {
														changeCollapse("group", group.name, false);
													}}
												>
													<ExpandLess />
												</IconButton>
											)}
										</span>
									}
								/>
								{group.conferences
									.filter((x) => !groupStatuses[group.name]?.collapsed)
									.map((conference) => {
										console.log(groupStatuses, group.name);
										return (
											<div className="conference-checkboxes">
												<FormControlLabel
													key={conference.name}
													control={
														<Checkbox
															checked={
																conferenceStatuses[conference.name]?.checked ||
																false
															}
															onChange={(e) =>
																changeSelections(e, "conference")
															}
															name={conference.name}
															indeterminate={
																conferenceStatuses[conference.name]
																	?.indeterminate || false
															}
														/>
													}
													label={<span>
                                                        {conference.name}
                                                        {!conferenceStatuses[conference.name]?.collapsed && (
                                                            <IconButton
                                                                onClick={() => {
                                                                    changeCollapse("conference", conference.name, true);
                                                                }}
                                                            >
                                                                <ExpandMore />
                                                            </IconButton>
                                                        )}
                                                        {conferenceStatuses[conference.name]?.collapsed && (
                                                            <IconButton
                                                                onClick={() => {
                                                                    changeCollapse("conference", conference.name, false);
                                                                }}
                                                            >
                                                                <ExpandLess />
                                                            </IconButton>
                                                        )}
                                                    </span>}
												/>
												{!conferenceStatuses[conference.name]?.collapsed &&
													conference.teams.map((team) => {
														return (
															<div className="team-checkboxes">
																<FormControlLabel
																	key={team.team}
																	control={
																		<Checkbox
																			checked={teamStatuses[team.team] || false}
																			onChange={(e) =>
																				changeSelections(e, "team")
																			}
																			name={team.team}
																		/>
																	}
																	label={team.team}
																/>
															</div>
														);
													})}
											</div>
										);
									})}
							</div>
						);
					})}
				</FormGroup>
			</FormControl>
		</div>
	);
};

export default TeamSelections;
