var handler = null;
var page = 1;
var isLoading = false;
var apiURL = 'http://www.wookmark.com/api/json/popular'

// Prepare layout options.
var options = {
    autoResize: false, // This will auto-update the layout when the browser window is resized.
    container: $('#tiles'), // Optional, used for some extra CSS styling
    offset: 10, // Optional, the distance between grid items
    itemWidth: 220 // Optional, the width of a grid item
};

/**
* When scrolled all the way to the bottom, add more tiles.
*/
function onScroll(event) {
    // Only check when we're not still waiting for data.
    if (!isLoading) {
        // Check if we're within 100 pixels of the bottom edge of the broser window.
        var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);
        if (closeToBottom) {
            loadData();
        }
    }
};

/**
* Refreshes the layout.
*/
function applyLayout() {
    // Create a new layout handler.
    handler = $('#tiles div');
    handler.wookmark(options);
};

/**
* Loads data from the API.
*/
function loadData() {
    isLoading = true;
    $('#loaderCircle').show();

    $.ajax({
        url: apiURL,
        dataType: 'jsonp',
        data: { page: page }, // Page parameter to make sure we load new data
        success: onLoadData
    });
};

/**
* Receives data from the API, creates HTML for images and updates the layout
*/
function onLoadData(data) {
    isLoading = false;
    $('#loaderCircle').hide();

    // Increment page index for future calls.
    page++;

    // Create HTML for the images.
    var html = '';
    var i = 0, length = data.length, image;
    for (; i < length; i++) {
        image = data[i];
        html += '<div>';

        html += "<span class='profile-summary'><span class='profile-pic' style='vertical-align: top;'><a href='Index'><img class='size32' src='https://si0.twimg.com/profile_images/145962244/profile_stumble_normal.jpg' alt='Suraj Shrestha'></a></span> <span class='fullname' style='"
            + "width: 164px;'><a href='http://esuraj.tumblr.com' target='_blank' style='display: block;'><b>Suraj Shrestha</b></a></span></span>"
            + "<span class='post-content' >something new  and long enought to do multi lines </span>";

        html += '<img src="' + image.preview + '" width="200" height="' + Math.round(image.height / image.width * 200) + '">';

        // Image title.
        html += '<p>' + image.title + '</p>';

        html += '</div>';
    }

    // Add image HTML to the page.
    $('#tiles').append(html);

    // Apply layout.
    applyLayout();
};

$(document).ready(new function () {
    // Capture scroll event.
    $(document).bind('scroll', onScroll);

    // Load first data from the API.
    loadData();
});