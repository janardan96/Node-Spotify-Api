# Node-Spotify-Api

1. Upload song on url http://localhost:5000/api/admin/uploadSongFile with 
file(audio) ,title ,artist key value.

2. For uploading song image ,put request on  http://localhost:5000/api/admin/songImage with songImage
(Optional).

3. Creat album for this song , post request on http://localhost:5000/api/admin/createAlbum with albumName, by, artistHeadline,albumImage(optional).

4. Store songs in album using put request on http://localhost:5000/api/admin/updateAlbumSongList with albumName and songId

5. Update Album data like albumName , by, artistHeadLine using put request http://localhost:5000/api/admin/updateAlbum (for finding doc use albumName and for new albumName use newAlbumName key)
Ex: albumName: album name for find,
    newAlbumName:change name for album