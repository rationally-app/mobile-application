/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const fs = require("fs");
const file = process.argv[2];

const data = JSON.parse(fs.readFileSync(file));
data.appBuildVersion = data.appBuildVersion + 1;

fs.writeFileSync(file, JSON.stringify(data, null, 2));