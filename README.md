scripts:
 npm run format --> to run prettier
 npm run build --> to build the project
 npm run test --> to run the test cases
 npm run start --> to start the server
 npm run lint --> to run eslint


End Points:
http://localhost:3000/images?filename=jford&height=700&width=400&format=jpg
 this is the end point for resizing image by user:
    filename, height, and width are mandatory, format is used if the user wants to convert the image to the disgnated format if empty default is jpg

http://localhost:3000/images/full
to return the list of full images names
http://localhost:3000/images/thumb
to return the list of thumbnail images names

http://localhost:3000/images/fullView
to display the list of full images in simple UI
http://localhost:3000/images/thumbView
to display the list of thumbnail images in simple UI

http://localhost:3000/images/upload

this endpoint to upload full image to the folder

http://localhost:3000/images/deleteThumb
to delete all the thumbnails 

running http://localhost:3000/ will start a simple UI allowing you to try the endpoint through the API. Hope you enjoy it :)