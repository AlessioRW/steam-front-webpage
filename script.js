console.log(0)

const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '',
      'X-RapidAPI-Host': 'steam2.p.rapidapi.com'
    }
};

async function getGameInfo(gameId,title, review, gameId, releaseDate){
    let response = await fetch(`https://steam2.p.rapidapi.com/appDetail/${gameId}`, options)
    let data = await response.json()

    updateModal(title, review, releaseDate,data.imgUrl,data.description)
}

function updateModal(title, review, releaseDate, bigImg, description){
    document.querySelector('#modal-title').innerHTML = title
    document.querySelector('#modal-text').innerHTML = ''

    let mainText = document.createElement('div')

    let imgTag = document.createElement('img')
    imgTag.src = bigImg

    let descriptionTag = document.createElement('p')
    descriptionTag.innerHTML = description
    
    let dateTag = document.createElement('h5')
    dateTag.innerHTML = `Release Date: ${releaseDate}`

    let reviewTag = document.createElement('h5')
    reviewTag.innerHTML = `Review Score: ${review.split('<br>')[0]}`

    mainText.append(imgTag,descriptionTag,reviewTag,dateTag)
    document.querySelector('#modal-text').append(mainText)
}

function showGames(gameData){
    let title = gameData.title
    let imgUrl = gameData.imgUrl
    let price = gameData.price

    if (price.includes('Free')){
        price = 'Free To Play'
    }
    else{
        if (price.includes('€')){
            price = gameData.price.split('€')[(gameData.price.split('€').length)-2].replace(',','.')
        }
        else{
            price = 'Purchase Unavailable'
        }
    }

    let gameCard = document.createElement('section')
    gameCard.classList.add('game')
    gameCard.addEventListener('click', () => {
        getGameInfo(gameData.appId,title, gameData.reviewSummary,gameData.appId, gameData.released)
        document.querySelector('#modal-title').innerHTML = 'Loading, Please Wait'
        document.querySelector('#modal-text').innerHTML = ''
        document.querySelector('#modal-button').click()
    })

    let imageTag = document.createElement('img')
    imageTag.setAttribute('src', imgUrl)
    
    let titleTag = document.createElement('h2')
    titleTag.innerHTML = title
    titleTag.classList.add('game-title')

    let priceTag = document.createElement('h2')
    priceTag.innerHTML = (price.includes('Free') || price.includes('Unavailable')) ? price: `Price: €${price}`
    priceTag.classList.add('game-price')

    gameCard.append(imageTag,titleTag,priceTag)
    document.querySelector('#games').append(gameCard)

}


currentPage = 1
currentSearch = '' //so the search box does not need to be full to click next pags
document.querySelector('#search-box').addEventListener('keyup', (event) => {
    if (event.keyCode === 13){
        currentPage = 1
        //console.log(document.querySelector('#search-box').value)
        currentSearch = document.querySelector('#search-box').value
        searchAPI()
        document.querySelector('#page-number').innerHTML = `Page ${currentPage}`
    }
})

document.querySelector('#prev-btn').addEventListener('click', () => {
    if (currentPage > 1){
        currentPage -= 1
        searchAPI()
        document.querySelector('#page-number').innerHTML = `Page ${currentPage}`
    }
})

document.querySelector('#next-btn').addEventListener('click', () => {
    currentPage += 1
    searchAPI()
    document.querySelector('#page-number').innerHTML = `Page ${currentPage}`
})

async function searchAPI(){
    let response = await fetch(`https://steam2.p.rapidapi.com/search/${currentSearch}/page/${currentPage}`,options)
    let data = await response.json()
    console.log(data)
    document.querySelector('#page-buttons-div').removeAttribute("hidden")

    document.querySelector('#games').innerHTML = ''
    for (let game of data){
        showGames(game)
    }
}
