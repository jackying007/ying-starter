import { faker } from '@faker-js/faker'
import { getRandomInRange } from '@ying/utils'
import { ArticleEntity } from '@ying/shared/entity'
import dataSource from '../typeorm.config'

function generateBlogPost() {
  const title = `<h2>${faker.lorem.sentence()}</h2>`
  const paragraph1 = `<p>${faker.lorem.paragraph()} <strong>${faker.lorem.sentence()}</strong> ${faker.lorem.paragraph()}</p>`
  const listItems = faker.helpers
    .multiple(() => `<li>${faker.commerce.productAdjective()} ${faker.commerce.product()}</li>`, { count: 3 })
    .map(item => `  ${item}`)
    .join('\n')
  const list = `<ul>\n${listItems}\n</ul>`
  const image = `<img src="${faker.image.urlLoremFlickr({ category: 'nature' })}" alt="${faker.lorem.words(3)}" />`

  return `<article>
  ${title}
  ${paragraph1}
  <h3>Our Advantages：</h3>
  ${list}
  <p>${faker.lorem.paragraph()}</p>
  ${image}
</article>`.trim()
}

void (async function () {
  await dataSource.initialize()
  const articleRepository = dataSource.getRepository(ArticleEntity)
  console.log('正在生成文章中')
  const articles: ArticleEntity[] = []
  for (let i = 0; i < 954; i++) {
    const name = `test-${i + 1}`
    const title = faker.lorem.text()
    const content = generateBlogPost()
    articles.push(
      articleRepository.create({
        name,
        title: {
          en: title,
          zh: title
        },
        keywords: Array.from({ length: Math.floor(getRandomInRange(2, 5)) }).map(() => faker.lorem.word()),
        content: {
          en: content,
          zh: content
        },
        coverId: 5
      })
    )
  }
  console.log('正在保存文章中')
  await articleRepository.save(articles)
  console.log('文章保存完毕')
})().finally(() => {
  process.exit(1)
})
