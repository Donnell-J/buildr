
# How to Run Buildr Locally:

#### Firstly, make sure you have [Node.JS](https://nodejs.org/en) with Version >= v20.9.0 installed.

#### Then, head over to https://github.com/Donnell-J/buildr-backend to set up the backend.

#### After doing the above, you will need to edit 2 lines of code:
First, in /app.js find the line:
```JavaScript
const resp = await fetch("http://backend-server-buildr.apps.a.comp-teach.qmul.ac.uk/getPCD", {
```
Simply, replace the existing URL with `"http://localhost:9999/getPCD"` if the backend is being ran on the same device you plan to access the frontend from, or the machine's IP if otherwise.  

Then in /components/MeshDownloadButton.js find the line:
```JavaScript
const response = await fetch("http://backend-server-buildr.apps.a.comp-teach.qmul.ac.uk/getMesh",{
```
Replace the existing URL with `"http://localhost:9999/getMesh"` if the backend is being ran on the same device you plan to access the frontend from, or the machine's IP if otherwise.  
### Once you have NodeJS installed, successfully have the backend running, and have made the apporpriate changes in the source code, open the Project Directory in a terminal and simply run the following: 
```
npx expo start -w
```
#### The above launches the webapp and makes it available on http://localhost:19006. 
#### If setup correctly, you should now have a local instance of the Buildr web app running. Enjoy :)
