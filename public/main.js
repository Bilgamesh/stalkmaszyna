function modifyImages() {

    var modal = document.getElementById("myModal");
    var imgs = document.getElementsByClassName('bobrazek');
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        img.onclick = function () {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }
    }
}

function searchMchat() {
    var table = document.getElementById('t01');
    table.tBodies[0].innerHTML = '';
    var username = document.getElementById('username').value;
    var keyword = document.getElementById('keyword').value;
    var key = document.getElementById('key').value;
    var tableSeparator = 'td';

    if (!username && !keyword)
        return alert('Musisz wypełnić przynajmniej jedno kryterium wyszukiwania');
    if (!key)
        return alert('Podaj hasło');
    fetch('http://ultra.serveousercontent.com/mchat/posts?username=' + username.trim() + '&keyword=' + keyword.trim() + '&key=' + key.trim())
        .then(function (res) {
            switch (res.status) {
                case 200:
                    return res.json();
                case 403:
                    alert('Wprowadzono złe hasło');
                    break;
                case 404:
                    alert('Nie wiem nic o takiej gumie');
                    break;
                case 422:
                    alert('Musisz wypełnić przynajmniej jedno kryterium wyszukiwania');
                    break;
                case 503:
                    alert('Brak dostępu do bazy danych. Powiadom admina.');
                    break;
            }
        })
        .then(function (posts) {
            if (!posts)
                return;
            for (var i = 0; i < posts.length; i++) {
                var style1 = '';
                var style2 = '';
                var message = posts[i].message
                    .replace(/<s>\[/gi, '[')
                    .replace(/]<\/s>/gi, ']')
                    .replace(/\[i\]/gi, '<i>')
                    .replace(/\[\/i\]/gi, '</i>')
                    .replace(/<link_text[^>]*>|<\/link_text>/gi, '')
                    .replace(/(\[mimg\]){2,10}/gi, '[mimg]')
                    .replace(/(\[\/mimg\]){2,10}/gi, '[/mimg]')
                    .replace(/\[mimg\]/gi, '<img class="bobrazek" style="max-width:150px; max-height; 150px;" src="')
                    .replace(/\[\/mimg\]/gi, '">')
                    .replace(/<mimg content="/gi, '<a target="_blank" rel="noreferrer" ahref="')
                    .replace(/<\/mimg>/gi, '</a>')
                    .replace(/\[quote="[^\]]*"\]/gi, '<blockquote>')
                    .replace(/\[quote\]/gi, '<blockquote>')
                    .replace(/\[\/quote\]/gi, '</blockquote>')
                    .replace(/<quote author="/gi, ' Autorstwa: ')
                    .replace(/"><blockquote>/gi, '<blockquote>')
                    .replace(/\[b\]|\[\/b\]/gi, '')
                    .replace(/\[url=/gi, '<a href="')
                    .replace(/\[\/url]/gi, '</a>')
                    .replace(/(<a href="[^\]]*)\]/gi, '$1">')
                    .replace(/<url url="/gi, '<a href="')
                    .replace(/<\/url>/gi, '</a>')
                    .replace(/(\[g\])([^\[]*)\[\/g\]/gi, '<p style="color:green">>$2</p>')
                    .replace(/<e>/gi, '');

                if (i == 0) {
                    style1 = ' style="border-top-left-radius: 12px;"';
                    style2 = ' style="border-top-right-radius: 12px;"';
                }
                table.tBodies[0].innerHTML += '<tr><' + tableSeparator + style1 + '><a title="Wyświetl profil" href="' + posts[i].profileUrl + '"><img class="avatar" src="' +
                    posts[i].avatarUrl + '"></a>' +
                    '</' + tableSeparator + '><' + tableSeparator + '>' + message +
                    '</' + tableSeparator + '><' + tableSeparator + style2 + '>' + new Date(posts[i].date * 1000 + 2 * 60 * 60 * 1000).toLocaleDateString() +
                    ' ' + new Date(posts[i].date * 1000 + 2 * 60 * 60 * 1000).toISOString().replace('T', '.').split('.')[1] + '</' + tableSeparator + '></tr>'
                if (tableSeparator == 'th')
                    tableSeparator = 'td';
                else
                    tableSeparator = 'th';
                modifyImages();
            }
        });
}