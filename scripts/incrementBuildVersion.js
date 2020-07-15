import jsonfile from "jsonfile";
const file = "version.json";

const data = jsonfile.readFileSync(file);
data.jsBuildNumber = data.jsBuildNumber + 1;

jsonfile.writeFileSync(file, data, { spaces: 2, EOL: "\r\n" });
