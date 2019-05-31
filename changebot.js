/*In this repo, write a bot using the GitHub api
that automatically accepts any pull requests to
this repo after X amount of time if the pull request
receives more thumbs up emoji reacts than thumbs
down. Then whenever a new pull request is accepted
to the master branch, the bot should pull the latest
version of the master branch and restart itself
using that code.
*/

const axios = require('axios');
const gitApiUrl = 'https://api.github.com/repos/kraljevo/changebot/pulls'

refresh = () => {
    console.log('Pulling data.')
    axios
        .get(gitApiUrl)
        .then(resp => {
            console.log(resp.data.links.statuses)
            console.log('Response should be logged.')
        })
        .catch(err => {
            console.log(err)
        })

    setTimeout(refresh, 900000);
}
setTimeout(refresh, 900000);

refresh();
/*
if(pullrequests){
    if(x time has passed){
        if(pullrequest has thumbs up){
            approve pullrequest
        }
    }
}
*/