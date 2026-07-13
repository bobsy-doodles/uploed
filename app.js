document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Use EXIF library to read data from the image file
    EXIF.getData(file, function() {
        // Extract all metadata tags available
        const allTags = EXIF.getAllTags(this);
        
        // Isolate and shorten data to just the key elements we want
        const cameraModel = allTags.Model || "Unknown Camera";
        const dateTaken = allTags.DateTime || "Unknown Date";
        const width = allTags.PixelXDimension || "Unknown";
        const height = allTags.PixelYDimension || "Unknown";

        // Display the shortened data on the webpage
        document.getElementById('camera').textContent = cameraModel;
        document.getElementById('date').textContent = dateTaken;
        document.getElementById('dimensions').textContent = `${width} x ${height} pixels`;
        
        // Show the results container box
        document.getElementById('result').style.display = 'block';
    });
});
