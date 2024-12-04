// 媒体查询定义，需要和SCSS文件中保持一致
const screenSmall = '20em' // 320px
const screenMedium = '40em' // 640px
const screenLarge = '80em' // 1280px

const screenPhone = screenSmall // 手机
const screenTablet = screenMedium // 平板
const screenDesktop = screenLarge // 电脑

export function isScreenPhone (): boolean {
  return window.matchMedia(`(min-width: ${screenPhone})`).matches
}

export function isScreenTablet (): boolean {
  return window.matchMedia(`(min-width: ${screenTablet})`).matches
}

export function isScreenDesktop (): boolean {
  return window.matchMedia(`(min-width: ${screenDesktop})`).matches
}
