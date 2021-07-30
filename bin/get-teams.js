import cheerio from "cheerio";
import request from "request-promise";
import fs from "fs";
import path from "path";
import nodeGeocoder from "node-geocoder";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let options = {
	provider: "openstreetmap",
};

let geoCoder = nodeGeocoder(options);

const LIST_URL =
	"https://en.wikipedia.org/wiki/List_of_NCAA_Division_I_FBS_football_programs";

const execute = async () => {
	const response = await request({
		uri: LIST_URL,
	});

	const $ = cheerio.load(response);

	const mainTable = $(".wikitable").first();

	const allTeams = mainTable
		.find("tr")
		.map((row_idx, row) => {
			const $row = $(row);

			const data = $row
				.find("td")
				.map((cell_idx, cell) => {
					const $cell = $(cell);
					return $cell;
				})
				.toArray();

			const [
				team,
				nickname,
				city,
				state,
				enrollment,
				conference,
				old_conferences,
				first_played,
				joined_fbs,
			] = data;
			return {
				team: $(team).text().trim(),
				nickname: $(nickname).text().trim(),
				athletic_link:
					"https://en.wikipedia.org" + $(nickname).find("a").attr("href"),
				city: $(city).find("a").first().text().trim(),
				state: $(state).text().trim(),
				enrollment: $(enrollment).text().trim(),
				conference: $(conference).text().trim(),
				old_conferences: $(old_conferences).text().trim(),
				first_played: $(first_played).text().trim(),
				joined_fbs: $(joined_fbs).text().trim(),
			};
		})
		.toArray();

	allTeams.shift();

	for (const team of allTeams) {
		if (team.athletic_link) {
			const team_response = await request({
				uri: team.athletic_link,
			});

			const $_ = cheerio.load(team_response);

			const image_url = $_(".infobox")
				.find("td.infobox-image")
				.first()
				.find("img")
				.attr("src");

			team.image_url = "https:" + image_url;

			const fullCity = `${team.city}, ${team.state}`;
			console.log(fullCity, team.team);

			try {
				const location = await geoCoder.geocode({
					state: team.state,
					city: team.city,
				});
				team.location = location;
			} catch (error) {
				console.error(error);
			}
		}
	}

	fs.writeFileSync(
		path.resolve(__dirname, "../src/data/data.json"),
		JSON.stringify(allTeams, null, 2)
	);
};

execute();
