import { parseArgs } from "util";
import fs from "fs/promises";
import path from "path";
import json from "../package.json";

if (!json.version) {
  const error = new Error();
  error.message = "Version could not be imported from package.json";
  throw error;
}

/**
 *
 * @param {string} version
 */
function bumpVersion(version) {
  if (isNaN(version)) {
    throw new Error("version provided is not a number");
  }
  let v = parseInt(version);
  v++;
  return v;
}

async function writeToJSON() {
  try {
    await fs.writeFile(
      path.join(import.meta.dir, "..", "package.json"),
      JSON.stringify(json, null, 2)
    );
    console.log("version successfully updated to:", json.version);
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param {string} - dirPath - path to directory
 * @returns {Promise<string[]>} - Array of .js files
 */
async function getModels(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    return files
      .filter((file) => file.endsWith(".js"))
      .map((file) => path.join(dirPath, file));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

/**
 * @param {string} - dirPath - path to directory
 * @returns {Promise<string[]>} - Array of .js files
 */
async function getIndex(dirPath) {
  try {
    return path.join(dirPath, "index.js");
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    throw e;
  }
}

try {
  const modelPath = path.join(import.meta.dirname, "..", "models");
  const models = await getModels(modelPath);
  const indexPath = path.join(import.meta.dirname, "..");
  const index = await getIndex(indexPath);
  
  await Bun.build({
    entrypoints: [index, ...models],
    outdir: "./dist",
    minify: true,
    target: "node",
    naming: "[name].bundle.js",
  });

  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      major: {
        default: false,
        type: "boolean",
      },
      minor: {
        default: false,
        type: "boolean",
      },
      build: {
        default: false,
        type: "boolean",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const [major, minor, build] = json.version.split(".");

  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  const versionDateString = `${year}.${month}.${day}`;

  switch (true) {
    case values.major:
      const newMajor = bumpVersion(major);
      json.version = `${newMajor}.0.0`;
      json.date = versionDateString;
      await writeToJSON();
      break;
    case values.minor:
      const newMinor = bumpVersion(minor);
      json.version = `${major}.${newMinor}.0`;
      json.date = versionDateString;
      await writeToJSON();

      break;
    case values.build:
      const newBuild = bumpVersion(build);
      json.version = `${major}.${minor}.${newBuild}`;
      json.date = versionDateString;
      await writeToJSON();
      break;
    default:
      console.log(
        "successfuly build but version was not modified:",
        json.version
      );
      break;
  }
} catch (e) {
  console.error(e);
}
