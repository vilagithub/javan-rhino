import fs from 'fs';

// location and name of file is consistent across projects
const filename = './version-info.txt';
let revision;

try {
  revision = fs.readFileSync(filename, 'utf8').trim();
} catch(e) {
  // TODO logger
  // console.log(`missing ${filename} cannot set X-Vcs-revision)`);
}

export default (req, res, next) => {
  if (revision && !/\s/.test(revision)) {
    res.set('X-VCS-Revision', revision);
  }
  next();
};
