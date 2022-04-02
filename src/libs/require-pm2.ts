/* eslint-disable global-require,import/no-dynamic-require */
import path from 'path';
import fs from 'fs';
import childProcess from 'child_process';
import type { PM2 } from '@type/index';
import { homepage } from '../../package.json';

const pm2libraryName: string = 'pm2';
const nodeModulesFolderName: string = 'node_modules';
const nodeRootIconicFiles: string[] = ['CHANGELOG.md', 'LICENSE', 'README.md'];

/**
 * @description Get the Node root path to which the current script belongs
 * @return {string | undefined}
 */
function getNodeRootPath(): string | undefined {
  const [nodeExePath] = process.argv;
  let currentPath: string = path.dirname(nodeExePath);
  while (!/^[^/\\]*[/\\]$/.test(currentPath)) {
    const filenames: string[] = fs.readdirSync(currentPath);
    if (
      nodeRootIconicFiles.every((iconicFile: string): boolean => filenames.includes(iconicFile))
    ) {
      return currentPath;
    }
    currentPath = path.resolve(currentPath, '..');
  }
  return undefined;
}

/**
 * @description Find node_modules in the specified path
 * @param {string} nodeRootPath
 * @return {string}
 */
function getNodeModulesPath(nodeRootPath: string): string | undefined {
  let currentPath: string = nodeRootPath;
  // Because the file structure of the node root path between systems such as windows and linux is different,
  // so here is a compatible treatment for different situations.
  const filenames: string[] = fs.readdirSync(currentPath);
  if (filenames.includes(nodeModulesFolderName)) { // Windows
    return path.resolve(currentPath, nodeModulesFolderName);
  }
  if (filenames.includes('lib')) {
    currentPath = path.resolve(currentPath, 'lib'); // Linux/Mac
    if (fs.readdirSync(currentPath).includes(nodeModulesFolderName)) {
      return path.resolve(currentPath, nodeModulesFolderName);
    }
  }
  return undefined;
}

/**
 * @description Get NPM's custom configuration for the installation path
 * @return {Promise<unknown>}
 */
function getNPMGlobalPrefixPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    childProcess.exec('npm config get prefix', (err: childProcess.ExecException | null, res: string) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res.replace(/^\s+|\s+$/, ''));
    });
  });
}

export default async function requirePm2(nodeModulesPathProvided?: string): Promise<PM2> {
  try {
    let pm2: PM2;
    // Try to import from the path user provided.
    if (nodeModulesPathProvided) {
      try {
        pm2 = require(path.resolve(nodeModulesPathProvided, pm2libraryName));
        return pm2;
      } catch (err) {
        console.error(`Cannot find module "${pm2libraryName}" from "${nodeModulesPathProvided}"!`);
        throw err;
      }
    }
    // Try to import directly.
    try {
      pm2 = require(pm2libraryName);
      return pm2;
    } catch (err) {
      //
    }
    // Find it in the default node_modules installation directory.
    const currentNodePath: string | undefined = getNodeRootPath();
    if (currentNodePath) {
      const nodeModulesPath: string | undefined = getNodeModulesPath(currentNodePath);
      if (nodeModulesPath) {
        try {
          pm2 = require(path.resolve(nodeModulesPath, pm2libraryName));
          return pm2;
        } catch (err) {
          //
        }
      }
    }
    // Find it from the node_modules installation path of the custom configuration.
    const npmGlobalPrefixPath: string = await getNPMGlobalPrefixPath();
    if (!npmGlobalPrefixPath) {
      throw new Error('Cannot find npm config global prefix');
    }
    const nodeModulesPath: string | undefined = getNodeModulesPath(npmGlobalPrefixPath);
    if (nodeModulesPath) {
      pm2 = require(path.resolve(nodeModulesPath, pm2libraryName));
      return pm2;
    }
    throw new Error(`Cannot find module "${pm2libraryName}"`);
  } catch (e) {
    console.error(`Cannot find module "${pm2libraryName}" automatically, you can give the "${nodeModulesFolderName}" path it belongs to by yourself (see ${homepage}#api).`);
    throw e;
  }
}
