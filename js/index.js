let apiKey = "AIzaSyBMuiP0cMmLEgT4-f2yHfJatdWxYmRHPB0"
var search = ""
var nextT = ""
var prevT = ""

function handleFetch(q, callback) {
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12",
        method: "GET",
        data: {
            key: apiKey,
            q: q
        },
        dataType: "json",
        success: responseJson => callback(responseJson),
        error: err => console.log(err)
    })
    search = q
}

function handleManageRes(callback, pToken) {
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12",
        method: "GET",
        data: {
            key: apiKey,
            q: search,
            pageToken: pToken
        },
        dataType: "json",
        success: responseJson => callback(responseJson),
        error: err => console.log(err)
    })
}

function displayResults(data) {
    console.log(data)
    $('.results').html('')
    data.items.forEach((item, index) => {
        let thumbnail = item.snippet.thumbnails.medium.url
        let link = item.id.videoId
        $('.results').append(`
        <div class = videotable >
        <div class = link>
            <a target="-blank" href="https://www.youtube.com/watch?v=${link}">
                <h3>${item.snippet.title}</h3>
            </a>
        </div>
        <div class = imagelink>
            <a id="thumb" target="-blank" href="https://www.youtube.com/watch?v=${link}">
                <img class = "video" src="${thumbnail}" alt="thumbnail">
            </a>
            </div>
        </div>
        `)
    })
    if (data.prevPageToken) {
        $('.results').append(`
            <div class="moreResultsDiv">
                <button class="resButton" id="prevres" type="button">Previous Results</button>
                <button class="resButton" id="nextres" type="button">Next Results</button>
            </div>
        `)
        prevT = data.prevPageToken
        nextT = data.nextPageToken
    } else {
        $('.results').append(`
            <div class="moreResultsDiv">
                <button class="resButton" id="nextres" type="button">Next Results</button>
            </div>
        `)
        nextT = data.nextPageToken
    }
}

$('.results').on("click", "#prevres", function (event) {
    handleManageRes(displayResults, prevT)
})

$('.results').on("click", "#nextres", function (event) {
    handleManageRes(displayResults, nextT)
})

function watchForm() {
    $('.ytForm').on('submit', (event) => {
        event.preventDefault()
        let q = $('#searchBox').val()
        handleFetch(q, displayResults)
    })
}

$(watchForm)