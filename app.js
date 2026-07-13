document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; 
    if (!file) return;

    EXIF.getData(file, function() {
        const allTags = EXIF.getAllTags(this);
        
        // Extract basic data
        const cameraModel = allTags.Model || "Unknown Camera";
        const dateTaken = allTags.DateTime || "Unknown Date";

        // Display basic data
        document.getElementById('camera').textContent = cameraModel;
        document.getElementById('date').textContent = dateTaken;

        // Process GPS Data
        if (allTags.GPSLatitude && allTags.GPSLongitude) {
            // Convert EXIF degree/minute/second arrays to decimals
            const lat = convertToDecimal(allTags.GPSLatitude, allTags.GPSLatitudeRef);
            const lng = convertToDecimal(allTags.GPSLongitude, allTags.GPSLongitudeRef);

            // Display raw coordinates
            document.getElementById('gps').textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            
            // Create a clickable Google Maps link
            const mapsLink = document.getElementById('mapsLink');
            mapsLink.href = `https://google.com{lat},${lng}`;
            mapsLink.style.display = 'inline';
        } else {
            document.getElementById('gps').textContent = "No GPS data found in this photo.";
            document.getElementById('mapsLink').style.display = 'none';
        }
        
        document.getElementById('result').style.display = 'block';
    });
});

// Helper function to turn EXIF GPS data into standard decimals
function convertToDecimal(coordinateArray, reference) {
    const degrees = coordinateArray[0].numerator / coordinateArray[0].denominator;
    const minutes = coordinateArray[1].numerator / coordinateArray[1].denominator;
    const seconds = coordinateArray[2].numerator / coordinateArray[2].denominator;

    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    
    // South and West coordinates must be negative numbers
    if (reference === "S" || reference === "W") {
        decimal = decimal * -1;
    }
    return decimal;
}
