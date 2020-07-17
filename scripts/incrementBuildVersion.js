"use strict";

const fs = require("fs");
const file = "package.json";

const data = JSON.parse(fs.readFileSync(file));
data.jsBuildNumber = data.jsBuildNumber + 1;

fs.writeFileSync(file, JSON.stringify(data, null, 2));
