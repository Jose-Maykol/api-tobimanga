import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SyncAllMangasChaptersCommand } from '../sync-all-mangas-chapters.command'
import { Inject } from '@nestjs/common'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { chromium } from 'playwright'

@CommandHandler(SyncAllMangasChaptersCommand)
export class SyncAllMangasChaptersHandler
  implements ICommandHandler<SyncAllMangasChaptersCommand>
{
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute() {
    const MANGADEX_URL = 'https://mangadex.org'
    const browser = await chromium.launch({ headless: false })
    const page = await browser.newPage()
    console.log('Syncing all mangas chapters...')
    try {
      await page.goto(MANGADEX_URL)
      const searchInput = await page.locator('//*[@id="header-search-input"]')
      await searchInput.fill('Dandadan')
      /* await searchInput.fill('Sousou no Frieren') */
      await page.keyboard.press('Enter')
      const searchResults = await page.locator(
        'xpath=/html/body/div[1]/div[1]/div[2]/div[3]/div/div[3]/div//a',
      )
      await searchResults.first().click()
      const mangaChapters = await page.locator(
        'xpath=/html/body/div[1]/div[1]/div[2]/div[3]/div/div[9]/div[2]/div/div[2]/div[1]/div[2]//div',
      )
      const lastChapterCard = await mangaChapters.first()
      const chapterNumberElement = await lastChapterCard
        .locator('.chapter-header div')
        .first()
      const chapterNumberText = await chapterNumberElement.textContent()
      console.log(chapterNumberText)
    } catch (error) {
      console.log(error)
    } finally {
      await browser.close()
    }
    /* const mangas = await this.mangaRepository.findAll() */

    return {
      message: 'All mangas chapters synced',
    }
  }
}
