export interface Location {
	latitude: number;
	longitude: number;
	formattedAddress?: string;
	country?: string;
	city?: string;
	state?: string;
	countryCode?: string;
	neighbourhood?: string;
	provider?: string;
}

export interface Team {
	image_url: string;
	team: string;
	nickname: string;
	city: string;
	state: string;
	enrollment: string;
	conference: string;
	old_conferences: string;
	first_played: string;
	joined_fbs: string;
	athletic_link?: string;
	location: Location[];
}

export interface Conference {
	name: string;
	color: string;
	group: string;
    teams: Team[];
}

export interface Group {
    name: string
    conferences: Conference[];
    teams?: Team[]
}
