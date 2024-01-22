import { expect } from 'detox'

describe('Home screen', () => {
    beforeAll(async () => {
      await device.launchApp()
    })
  
    beforeEach(async () => {
      await device.reloadReactNative()
    })

    /* Visibility tests */

    it('text input for x should be visible', async () => {
        await expect(element(by.id('app-textinput-x'))).toBeVisible()
    })
    
    it('text input for y should be visible', async () => {
        await expect(element(by.id('app-textinput-y'))).toBeVisible()
    })

    it('"Add" button should be visible', async () => {
        await expect(element(by.id('app-button-add'))).toBeVisible()
    })

    it('"Sub" button should be visible', async () => {
        await expect(element(by.id('app-button-sub'))).toBeVisible()
    })

    it('"Mul" button should be visible', async () => {
        await expect(element(by.id('app-button-mul'))).toBeVisible()
    })

    it('"Div" button should be visible', async () => {
        await expect(element(by.id('app-button-div'))).toBeVisible()
    })

    it('"Result" text should be visible', async () => {
        await expect(element(by.id('app-text-res'))).toBeVisible()
    })

    /* Action tests */
  
    // it('shows "Hi!" after tapping "Click me"', async () => {
    //   await element(by.id('click-me-button')).tap()
    //   await expect(element(by.text('Hi!'))).toBeVisible()
    // })
  })

  