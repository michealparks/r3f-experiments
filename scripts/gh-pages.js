const ghpages = require('gh-pages')
const dir = 'dist'

ghpages.publish(dir, {
  dotfiles: true
}, (err) => {
  if (err) console.error(err)
  else console.log('Published')
})
