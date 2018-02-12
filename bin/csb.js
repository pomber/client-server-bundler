#!/usr/bin/env node

"use strict";

const fs = require("fs-extra");
const path = require("path");
const copy = require("copy-template-dir");
const exec = require("child_process").exec;

const buildTarget = "build";
const clientFolder = "client";
const serverFolder = "server";

const clientTarget = path.join(buildTarget, clientFolder);
const serverTarget = path.join(buildTarget, serverFolder);

//TODO: call yarn build
const clientSource = path.join(clientFolder, "build");
const serverSource = path.join(serverFolder);

fs.emptyDirSync(buildTarget);
fs.copySync(clientSource, clientTarget);
fs.copySync(serverSource, serverTarget);

const templateFolder = path.join(__dirname, "..", "templates");

const rootPackage = fs.readJsonSync("package.json");
const clientPackage = fs.readJsonSync(path.join(clientFolder, "package.json"));
const serverPackage = fs.readJsonSync(path.join(serverFolder, "package.json"));

const vars = {
  name: rootPackage.name,
  proxy: clientPackage.proxy
};

copy(templateFolder, buildTarget, vars, (err, createdFiles) => {
  if (err) throw err;
  createdFiles.forEach(filePath => console.log(`Created ${filePath}`));
  const child = exec(
    "yarn install",
    { cwd: buildTarget },
    (error, stdout, stderr) => {
      console.log(`install stdout: ${stdout}`);
      console.log(`install stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
      // exec("yarn deploy", { cwd: buildTarget }, (error, stdout, stderr) => {
      //   console.log(`deploy stdout: ${stdout}`);
      //   console.log(`deploy stderr: ${stderr}`);
      //   if (error !== null) {
      //     console.log(`exec error: ${error}`);
      //   }
      // });
    }
  );
});
