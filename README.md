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

this api to upload full image to the folder