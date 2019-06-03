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
const pullRequestUrl = 'https://api.github.com/repos/kraljevo/changebot/pulls'
const timeLimit = 1000;
let password;

process.stdin.setEncoding('utf8');

const loginPassword = () => {
    //ask for username in this function
    process.stdout.write("Password: ")
    process.stdin.on('data', (data => {
        password = data.toString().trim();
        refresh = () => {
            console.log('Checking for Pull Requests.')
            axios
                .get(pullRequestUrl)
                .then(resp => {
                    let pullRequestData = resp.data;
                    if(pullRequestData[0] === undefined){
                        console.log('Nothing to report.')
                    }
                    pullRequestData.forEach(pull => {
                        let usernames = [];
                        let votesYes = 0;
                        let votesNo = 0;
                        let majorityVotes = 3;
                        let pullCommentsUrl = `https://api.github.com/repos/kraljevo/changebot/issues/${pull.number}/comments`;
                        let timeNow = new Date();
                        let timeRequested = new Date(pull.created_at);
                        if(timeNow.getTime() - timeRequested.getTime() > timeLimit){
                            console.log('Checking for votes.')
                            axios
                                .get(pullCommentsUrl)
                                .then(resp => {
                                    let allComments = resp.data
                                    allComments.forEach(commData => {
                                        let commBody = commData.body
                                        let commUser = commData.user.login
                                        if(commBody.startsWith('vote yes')){
                                            if(!usernames.includes(commUser)){
                                                //usernames.push(commUser);
                                                votesYes += 1;
                                                console.log(`There are currently ${votesYes} votes to approve this pull request.`)
                                            }
                                        } else if(commBody.startsWith('vote no')){
                                            if(!usernames.includes(commUser)){
                                                //usernames.push(commUser);
                                                votesNo += 1;
                                                console.log(`There are currently ${votesNo} votes to decline this pull request.`)
                                            }
                                        }
                                        if(votesYes >= majorityVotes){
                                            console.log('The request has been accepted.')
                                            axios({
                                                method: 'put',
                                                url: `${pullRequestUrl}/${pull.number}/merge`,
                                                auth: {
                                                    username: 'kraljevo',
                                                    password: password
                                                }
                                                })
                                                .then(resp => {
                                                    console.log(resp)
                                                })
                                                .catch(err => {
                                                    console.log(err)
                                                })
                                        } else if(votesNo >= majorityVotes){
                                            console.log('The request has been declined.')
                                        } else if(votesNo === 0 && votesYes === 0){
                                            console.log('No votes have been cast.')
                                        }
                                    })
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            setTimeout(refresh, 900000);
        }
        setTimeout(refresh, 900000);
    }))
};

loginPassword()