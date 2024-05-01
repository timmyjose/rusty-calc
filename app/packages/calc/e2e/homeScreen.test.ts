import { expect, device, element, by } from 'detox'
import { beforeAll, beforeEach, describe, it, test } from '@jest/globals'

describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES', userTracking: 'YES' }
    })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  describe('Home Screen elements should be visible', () => {
    it('Should show the link for "backup"', async () => {
      const backupLink = element(by.id('app-button-backup'))
      await expect(backupLink).toBeVisible()
    })

    it('Should show the text inputs for the two input numbers', async () => {
      const textinputX = element(by.id('app-textinput-x'))
      await expect(textinputX).toBeVisible()

      const textinputY = element(by.id('app-textinput-y'))
      await expect(textinputY).toBeVisible()
    })

    it('Should show the five arithmetic operations buttons', async () => {
      const addButton = element(by.id('app-button-add'))
      await expect(addButton).toBeVisible()

      const subButton = element(by.id('app-button-sub'))
      await expect(subButton).toBeVisible()

      const mulButton = element(by.id('app-button-mul'))
      await expect(mulButton).toBeVisible()

      const divButton = element(by.id('app-button-div'))
      await expect(divButton).toBeVisible()

      const absButton = element(by.id('app-button-abs'))
      await expect(absButton).toBeVisible()
    })
  })
})
