gsutil -m rsync -d -r discoverWebClient gs://web.probediscover.com

instructions for gsutil
https://codelabs.developers.google.com/codelabs/gcp-aws-gsutil/index.html?index=..%2F..%2Findex#2


git instructions:
git merge -X theirs new-feature (merge whatever is in new-feature without conflicts)
git reset HEAD nameOfFile (remove file from stage)
git checkout filename (reset file contents)
git revert HEAD^ (go back 1 commit)
git revert HEAD~5 (go back 5 commits)
git revert theHash

git reset --hard thehash (delete the commit and everything after it)

git lg (show commits graph)

git bisect start (start binary search debugging)

git bisect bad (if it's a bad commit)
git bisect good thehash
git bisect reset (done debugging)
git diff theHash^ theHash (compare branch and the one before it)
git blame theFile (know who messed it)