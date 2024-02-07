document.addEventListener("DOMContentLoaded", () =>{
    
    
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(data => {
        let ul = document.querySelector("#list")
        data.forEach(book => {
            let li = document.createElement("li")
            li.innerText = book.title
            ul.appendChild(li)
            li.addEventListener("click", () => displayInfo(book))
        })
        
    })

    function displayInfo(book) {
        let showPanel = document.querySelector("#show-panel")
        fetch(`http://localhost:3000/books/${book.id}`)
        .then(res => res.json())
        .then(book => {
            showPanel.innerText = ``
            let img = document.createElement("img")
            img.src = book.img_url

            let title = document.createElement("h2")
            title.innerText = `${book.title}`

            let subtitle = document.createElement("h4")
            subtitle.innerText = `${book.subtitle}`

            let author = document.createElement("p")
            author.innerText = `${book.author}`
            author.style.fontWeight = "bold"

            let description = document.createElement('p')
            description.innerText = `${book.description}`
            description.style.fontStyle = "italic"

            let likeBtn = document.createElement("button")
            likeBtn.innerText = "LIKE"
            showPanel.appendChild(img)
            showPanel.appendChild(title)
            showPanel.appendChild(subtitle)
            showPanel.appendChild(author)
            showPanel.appendChild(description)
           

            book.users.forEach(user => {
                let users = document.createElement("li")
                users.innerText = user.username
                showPanel.appendChild(users)
            })
            showPanel.appendChild(likeBtn)

            likeBtn.addEventListener('click', () => updateLike(book))
        })
    }

    function updateLike(book) {
       fetch("http://localhost:3000/users")
       .then(res => res.json())
       .then(data => {
        const currentUser = { "id": 1, "username": "pouros"}

        const userLiked = book.users.some(user => user.id === currentUser.id)

        if (!userLiked) {
            book.users.push(currentUser)
            
            fetch(`http://localhost:3000/books/${book.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({users: book.users})
            })
            .then(res => res.json())
            .then(updatedBook => displayInfo(updatedBook))
            
        } else {
            console.log('User has already liked the book')
        }
       })
    }
});
