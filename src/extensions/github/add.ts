var github = require('octonode')

const client = github.client('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')

const ghrepo = client.repo('Kaperskyguru/contentre-store')

export default async (data: any): Promise<boolean> => {
  await ghrepo.createContents(
    `portfolios/${data.userId}/${data.templateId}/html.txt`,
    'commit message',
    data.html
  )
  await ghrepo.createContents(
    `portfolios/${data.userId}/${data.templateId}/css.txt`,
    'commit message',
    data.css
  )
  return true
}
