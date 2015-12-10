# Dev Test

## View demo:

There should be a working demo hosted on Github Pages at http://richardwestenra.com/guardian-dev-test/ and visible on the `gh-pages` branch.

## Dev setup/installation:

1. Install node, npm, bower etc. if you haven’t already. 
2. Clone the git repo. 
3. Run `npm install && bower install`. 
4. Project files are in `/app`, bower packages are in `/bower_components`, and node packages are in `/node_modules`. 
5. Use the following grunt commands: 
    - `grunt serve` runs the server for local dev work
    - `grunt` creates a production build in `/dist/`
    - `grunt deploy` makes a build and deploys it to gh-pages
    - `grunt zip` makes a build and creates a zipped deliverable file in `/zips`
