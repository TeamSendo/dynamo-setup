module.exports = () => {
  const path = require('path');
  process.env.APP_ROOT = process.cwd();  // WARNING: `node` must be run from root
  require('dotenv').load({path: path.join(process.env.APP_ROOT, 'config', '.env')});
}
